import { sql } from "drizzle-orm";
import z from "zod";
import { db } from "../db";
import { user } from "../db/schema/user";
import { protectedProcedure } from "../lib/orpc";

const tags = ["Users"];

function formatTimeSpent(minutes: number): string {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;

	if (hours > 0 && mins > 0) {
		return `${hours}h ${mins}m`;
	}
	if (hours > 0) {
		return `${hours}h`;
	}
	return `${mins}m`;
}

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
				})
				.optional()
				.default({}),
		)
		.handler(async ({ input }) => {
			const { search, limit = 10, offset = 0 } = input;

			const dbQuery = db.select().from(user);

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

			const count = await db.$count(user, whereClause);
			const data = await dbQuery.limit(limit).offset(offset);

			return {
				count,
				items: data.map((u) => ({
					...u,
					progress: Math.floor(Math.random() * 101), // Placeholder for user progress
					timeSpent: formatTimeSpent(Math.floor(Math.random() * 5000)), // Placeholder for time spent in minutes
				})),
			};
		}),
};
