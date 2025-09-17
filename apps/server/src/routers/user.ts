import { eq, getTableColumns, sql } from "drizzle-orm";
import z from "zod";
import { db } from "../db";
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
					sortBy: z.enum(["name", "progress", "timeSpent"]).optional(),
					sortOrder: z.enum(["asc", "desc"]).optional(),
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
			} = input;

			console.log({ input });

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
						sql`count(CASE WHEN ${progress.status} = 'completed' THEN 1 END)`.mapWith(
							Number,
						),
					totalCourses: sql`count(${progress.id})`.mapWith(Number),
				})
				.from(user);

			const matchQuery = sql`(
            setweight(to_tsvector('english', ${user.name}), 'A') ||
            setweight(to_tsvector('english', ${user.email}), 'B'))`;

			const whereClause = search
				? sql`to_tsquery('english', ${search}) @@ ${matchQuery}`
				: undefined;

			if (search) {
				dbQuery
					.where(sql`to_tsquery('english', ${search}) @@ ${matchQuery}`)
					.orderBy(
						sql`ts_rank(${matchQuery}, to_tsquery('english', ${search})) DESC`,
					);
			}

			dbQuery.leftJoin(progress, eq(user.id, progress.userId)).groupBy(user.id);

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
};
