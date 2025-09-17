import { db } from "../db";
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

			// Placeholder values since actual calculations aren't implemented
			stats.push({
				title: "Completed Courses",
				value: Math.floor(Math.random() * 100).toString(),
				description: "Successfully finished",
			});

			stats.push({
				title: "In Progress",
				value: Math.floor(Math.random() * 50).toString(),
				description: "Currently learning",
			});

			stats.push({
				title: "Avg. Completion",
				value: `${Math.floor(Math.random() * 100)}%`,
				description: "Team progress rate",
			});

			return stats;
		}),
};
