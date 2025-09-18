import { eq, getTableColumns, sql } from "drizzle-orm";
import z from "zod";
import { db } from "../db";
import { course } from "../db/schema/course";
import { progress } from "../db/schema/progress";
import { user } from "../db/schema/user";
import { protectedProcedure } from "../lib/orpc";
import { formatHoursAndMinutes } from "../lib/utils";

const tags = ["Users"];

export const userRouter = {
	getAll: protectedProcedure
		.route({
			spec: (spec) => ({
				...spec,
				tags,
				summary: "Get all users",
				description: "Retrieve all users",
			}),
		})
		.input(
			z
				.object({
					search: z.string().optional(),
					limit: z.number().min(1).max(100).optional(),
					offset: z.number().min(0).optional(),
					sortBy: z
						.enum(["name", "progress", "timeSpent", "coursesCompleted"])
						.optional(),
					sortOrder: z.enum(["asc", "desc"]).optional(),
					overdue: z
						.boolean()
						.optional()
						.describe("Filter users with overdue courses"),
				})
				.optional()
				.default({}),
		)
		.handler(async ({ input }) => {
			const {
				search,
				limit = 10,
				offset = 0,
				sortBy = "timeSpent",
				sortOrder = "desc",
				overdue = false,
			} = input;

			const dbQuery = db
				.select({
					...getTableColumns(user),
					timeSpent: sql`COALESCE(SUM(${progress.timeSpentMinutes}), 0)`
						.mapWith(Number)
						.as("timeSpent"),
					progress: sql`COALESCE(AVG(${progress.completionPercentage}), 0)`
						.mapWith(Number)
						.as("progress"),
					coursesCompleted:
						sql`count(CASE WHEN ${progress.status} = 'completed' THEN 1 END)`
							.mapWith(Number)
							.as("coursesCompleted"),
					totalCourses: sql`count(${progress.id})`.mapWith(Number),
				})
				.from(user);

			// !TODO: check if plainto_tsquery is better for user search

			const matchQuery = sql`(
            setweight(to_tsvector('english', ${user.name}), 'A') ||
            setweight(to_tsvector('english', ${user.email}), 'B'))`;

			const whereConditions = [];

			if (search) {
				whereConditions.push(
					sql`to_tsquery('english', ${search}) @@ ${matchQuery}`,
				);
			}

			if (overdue) {
				whereConditions.push(sql`EXISTS (
          SELECT 1 FROM ${progress} p
          WHERE p.user_id = ${user.id}
          AND p.due_date < NOW()
          AND p.status != 'completed'
        )`);
			}

			const whereClause =
				whereConditions.length > 0
					? sql`${sql.join(whereConditions, sql` AND `)}`
					: undefined;

			if (search) {
				dbQuery.orderBy(
					sql`ts_rank(${matchQuery}, to_tsquery('english', ${search})) DESC`,
				);
			}

			dbQuery.leftJoin(progress, eq(user.id, progress.userId)).groupBy(user.id);

			if (whereClause) {
				dbQuery.where(whereClause);
			}

			const count = await db.$count(user, whereClause);
			const data = await dbQuery
				.limit(limit)
				.offset(offset)
				.orderBy(sql`${sql.identifier(sortBy)} ${sql.raw(sortOrder)}`);

			return {
				count,
				items: data.map((u) => ({
					...u,
					progress: Math.round(u.progress || 0),
					timeSpent: formatHoursAndMinutes(u.timeSpent || 0),
					coursesCompleted: u.coursesCompleted || 0,
					totalCourses: u.totalCourses || 0,
				})),
			};
		}),

	getById: protectedProcedure
		.route({
			spec: (spec) => ({
				...spec,
				tags,
				summary: "Get user by ID",
				description: "Retrieve a user with their course progress",
			}),
		})
		.input(z.object({ id: z.number() }))
		.handler(async ({ input }) => {
			const userData = await db
				.select({
					...getTableColumns(user),
					totalTimeSpent: sql`COALESCE(SUM(${progress.timeSpentMinutes}), 0)`
						.mapWith(Number)
						.as("totalTimeSpent"),
					averageProgress:
						sql`COALESCE(AVG(${progress.completionPercentage}), 0)`
							.mapWith(Number)
							.as("averageProgress"),
					coursesCompleted:
						sql`count(CASE WHEN ${progress.status} = 'completed' THEN 1 END)`.mapWith(
							Number,
						),
					totalCourses: sql`count(${progress.id})`.mapWith(Number),
				})
				.from(user)
				.leftJoin(progress, eq(user.id, progress.userId))
				.where(eq(user.id, input.id))
				.groupBy(user.id)
				.limit(1);

			if (userData.length === 0) {
				throw new Error("User not found");
			}

			const userWithStats = userData[0];

			const userProgressData = await db
				.select({
					...getTableColumns(progress),
					courseTitle: course.title,
					courseDescription: course.description,
					courseDurationMinutes: course.durationMinutes,
				})
				.from(progress)
				.innerJoin(course, eq(progress.courseId, course.id))
				.where(eq(progress.userId, input.id));

			const courses = userProgressData.map((p) => ({
				id: p.id,
				courseId: p.courseId,
				title: p.courseTitle,
				description: p.courseDescription,
				durationMinutes: p.courseDurationMinutes,
				timeSpentMinutes: p.timeSpentMinutes,
				completionPercentage: p.completionPercentage,
				status: p.status,
				startedAt: p.startedAt,
				completedAt: p.completedAt,
				dueDate: p.dueDate,
				timeSpent: formatHoursAndMinutes(p.timeSpentMinutes),
				duration: formatHoursAndMinutes(p.courseDurationMinutes),
			}));

			return {
				...userWithStats,
				courses,
				stats: {
					totalTimeSpent: formatHoursAndMinutes(userWithStats.totalTimeSpent),
					averageProgress: Math.round(userWithStats.averageProgress),
					coursesCompleted: userWithStats.coursesCompleted,
					totalCourses: userWithStats.totalCourses,
				},
			};
		}),
};
