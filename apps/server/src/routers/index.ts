import type { RouterClient } from "@orpc/server";
import { publicProcedure } from "../lib/orpc";
import { analyticsRouter } from "./analytics";
import { authRouter } from "./auth";
import { courseRouter } from "./course";
import { userRouter } from "./user";

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
	user: userRouter,
	analytics: analyticsRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
