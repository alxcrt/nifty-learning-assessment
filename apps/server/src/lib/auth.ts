import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "nifty";

export async function hashPassword(password: string): Promise<string> {
	return Bun.password.hash(password, {
		algorithm: "bcrypt",
		cost: 10,
	});
}

export async function verifyPassword(
	password: string,
	hashedPassword: string,
): Promise<boolean> {
	return Bun.password.verify(password, hashedPassword);
}

export interface JWTPayload {
	userId: number;
	email: string;
	name: string;
}

export function generateToken(user: {
	id: number;
	email: string;
	name: string;
}): string {
	const payload: JWTPayload = {
		userId: user.id,
		email: user.email,
		name: user.name,
	};
	return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload {
	return jwt.verify(token, JWT_SECRET) as JWTPayload;
}
