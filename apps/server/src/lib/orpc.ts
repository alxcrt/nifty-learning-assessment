import { oo } from "@orpc/openapi";
import { ORPCError, os } from "@orpc/server";
import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o.route({
	spec: (spec) => ({
		...spec,
	}),
});

const authMiddleware = oo.spec(
	o.middleware(async ({ context, next }) => {
		if (!context.user) {
			throw new ORPCError("UNAUTHORIZED");
		}

		return next({
			context: {
				...context,
				user: context.user,
			},
		});
	}),
	{
		security: [{ BearerAuth: [] }],
	},
);

export const protectedProcedure = o.use(authMiddleware);
