import type { RouterClient } from "@orpc/server";
import { publicProcedure } from "../lib/orpc";
import { authRouter } from "./auth";
import { courseRouter } from "./course";

export const appRouter = {
	healthCheck: publicProcedure
		.route({
			spec: (spec) => ({
				...spec,
				tags: ["Health"],
				summary: "Health check",
				description: "Check if the API is running",
			}),
		})
		.handler(() => {
			return "OK";
		}),
	auth: authRouter,
	course: courseRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
