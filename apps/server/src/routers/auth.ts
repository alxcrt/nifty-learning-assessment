import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "../db";
import { user } from "../db/schema/user";
import { generateToken, hashPassword, verifyPassword } from "../lib/auth";
import { publicProcedure } from "../lib/orpc";

const tags = ["Authentication"];

export const authRouter = {
	register: publicProcedure
		.route({
			spec: (spec) => ({
				...spec,
				tags,
				summary: "Register a new user",
				description: "Create a new user account with email and password",
			}),
		})
		.input(
			z.object({
				email: z.email(),
				password: z.string().min(6),
				name: z.string().min(1),
			}),
		)
		.handler(async ({ input }) => {
			const existingUser = await db
				.select()
				.from(user)
				.where(eq(user.email, input.email))
				.limit(1);

			if (existingUser.length > 0) {
				throw new ORPCError("User with this email already exists");
			}

			const hashedPassword = await hashPassword(input.password);

			const newUser = await db
				.insert(user)
				.values({
					email: input.email,
					password: hashedPassword,
					name: input.name,
				})
				.returning();

			const token = generateToken(newUser[0]);

			return {
				user: {
					id: newUser[0].id,
					email: newUser[0].email,
					name: newUser[0].name,
				},
				token,
			};
		}),

	login: publicProcedure
		.route({
			spec: (spec) => ({
				...spec,
				tags,
				summary: "Login user",
				description:
					"Authenticate user with email and password to get JWT token",
			}),
		})
		.input(
			z.object({
				email: z.string().email(),
				password: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			const foundUser = await db
				.select()
				.from(user)
				.where(eq(user.email, input.email))
				.limit(1);

			if (foundUser.length === 0) {
				throw new ORPCError("Invalid credentials");
			}

			const isValidPassword = await verifyPassword(
				input.password,
				foundUser[0].password,
			);

			if (!isValidPassword) {
				throw new ORPCError("Invalid credentials");
			}

			const token = generateToken(foundUser[0]);

			return {
				user: {
					id: foundUser[0].id,
					email: foundUser[0].email,
					name: foundUser[0].name,
				},
				token,
			};
		}),

	me: publicProcedure
		.route({
			spec: (spec) => ({
				...spec,
				tags,
				summary: "Get current user",
				description: "Get current user information from JWT token",
			}),
		})
		.handler(async ({ context }) => {
			if (!context.user) {
				return { user: null };
			}

			return {
				user: {
					id: context.user.id,
					email: context.user.email,
					name: context.user.name,
				},
			};
		}),
};
