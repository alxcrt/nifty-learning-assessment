import { describe, expect, test } from "bun:test";
import jwt from "jsonwebtoken";
import { verifyToken } from "../lib/auth";

// Set a consistent secret for testing
const TEST_JWT_SECRET = "test-secret-key";
process.env.JWT_SECRET = TEST_JWT_SECRET;

describe("JWT Authentication", () => {
	const testPayload = {
		userId: 123,
		email: "test@example.com",
		name: "Test User",
	};

	describe("JWT verification", () => {
		test("verifies valid JWT tokens", async () => {
			const token = jwt.sign(testPayload, TEST_JWT_SECRET);

			const decoded = verifyToken(token);
			expect(decoded).toMatchObject({
				userId: testPayload.userId,
				email: testPayload.email,
				name: testPayload.name,
			});
		});

		test("rejects invalid JWT tokens", async () => {
			const invalidToken = "invalid.jwt.token";

			expect(async () => {
				await verifyToken(invalidToken);
			}).toThrow();
		});

		test("rejects expired JWT tokens", async () => {
			const expiredToken = jwt.sign(testPayload, TEST_JWT_SECRET, {
				expiresIn: "0s",
			});

			expect(async () => {
				await verifyToken(expiredToken);
			}).toThrow();
		});

		test("rejects tokens with wrong secret", async () => {
			const wrongSecretToken = jwt.sign(testPayload, "wrong-secret");

			expect(async () => {
				await verifyToken(wrongSecretToken);
			}).toThrow();
		});
	});
});
