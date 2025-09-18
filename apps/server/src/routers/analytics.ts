import { eq, sql } from "drizzle-orm";
import { avg } from "drizzle-orm/sql";
import { db } from "../db";
import { progress } from "../db/schema/progress";
import { user } from "../db/schema/user";
import { protectedProcedure } from "../lib/orpc";

const tags = ["Analytics"];

export const analyticsRouter = {
	getOverview: protectedProcedure
		.route({
			spec: (spec) => ({
				...spec,
				tags,
				summary: "Get the overview analytics",
				description:
					"Retrieve analytics overview including user counts and course stats",
			}),
		})

		.handler(async () => {
			const stats = [];

			const userCount = await db.$count(user);
			stats.push({
				title: "Total Learners",
				value: userCount.toString(),
				description: "Active team members",
			});

			const completedCoursesCount = await db.$count(
				progress,
				eq(progress.status, "completed"),
			);
			stats.push({
				title: "Completed Courses",
				value: completedCoursesCount,
				description: "Successfully finished",
			});

			const inProgressCount = await db.$count(
				progress,
				eq(progress.status, "in_progress"),
			);
			stats.push({
				title: "In Progress",
				value: inProgressCount,
				description: "Courses being taken",
			});

			const overdueCount = await db.$count(
				progress,
				sql`DATE(${progress.dueDate}) < CURRENT_DATE AND ${progress.status} != 'completed'`,
			);
			stats.push({
				title: "Overdue",
				value: overdueCount,
				description: "Courses past due date",
			});

			const avgCompletion = (
				await db
					.select({ avg: avg(progress.completionPercentage).mapWith(Number) })
					.from(progress)
			)[0].avg;
			stats.push({
				title: "Avg. Completion",
				value: `${avgCompletion.toFixed(2)}%`,
				description: "Team progress rate",
			});

			return stats;
		}),
};
