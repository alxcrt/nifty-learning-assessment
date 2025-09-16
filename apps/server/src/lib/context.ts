import type { Request } from "express";
import { verifyToken } from "./auth";

export async function createContext(opts: { req: Request }) {
	const authHeader = opts.req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return {
			user: null,
		};
	}

	try {
		const token = authHeader.split(" ")[1];
		const payload = verifyToken(token);

		return {
			user: {
				id: payload.userId,
				email: payload.email,
				name: payload.name,
			},
		};
	} catch {
		return {
			user: null,
		};
	}
}

export type Context = Awaited<ReturnType<typeof createContext>>;
