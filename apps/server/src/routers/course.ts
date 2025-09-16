import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "../db";
import { course } from "../db/schema/course";
import { protectedProcedure } from "../lib/orpc";

const tags = ["Courses"];

export const courseRouter = {
	getAll: protectedProcedure
		.route({
			spec: (spec) => ({
				...spec,
				tags,
				summary: "Get all courses",
				description: "Retrieve all courses",
			}),
		})
		.handler(async () => {
			return await db.select().from(course);
		}),

	create: protectedProcedure
		.route({
			spec: (spec) => ({
				...spec,
				tags,
				summary: "Create course",
				description: "Create a new course",
			}),
		})
		.input(
			z.object({
				title: z.string().min(1),
				description: z.string().min(1),
				duration: z.number().min(1),
			}),
		)
		.handler(async ({ input }) => {
			const result = await db
				.insert(course)
				.values({
					title: input.title,
					description: input.description,
					duration: input.duration,
				})
				.returning();
			return result[0];
		}),

	delete: protectedProcedure
		.route({
			spec: (spec) => ({
				...spec,
				tags,
				summary: "Delete course",
				description: "Delete a course by ID",
			}),
		})
		.input(z.object({ id: z.number() }))
		.handler(async ({ input }) => {
			const result = await db
				.delete(course)
				.where(eq(course.id, input.id))
				.returning();
			return result[0];
		}),
};
