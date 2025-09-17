import { faker } from "@faker-js/faker";
import { db } from "./index";
import { course } from "./schema/course";
import type { progressStatusEnumType } from "./schema/progress";
import { progress } from "./schema/progress";
import { user } from "./schema/user";

async function seedUsers() {
	console.log("🌱 Seeding users...");

	const users = [];

	for (let i = 0; i < 100; i++) {
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();

		users.push({
			name: `${firstName} ${lastName}`,
			email: faker.internet.email({ firstName, lastName }).toLowerCase(),
			password: faker.internet.password({ length: 12 }),
		});
	}

	await db.insert(user).values(users);
	console.log(`✅ Seeded ${users.length} users`);
}

async function seedCourses() {
	console.log("🌱 Seeding courses...");

	const courses = [];

	for (let i = 0; i < 15; i++) {
		courses.push({
			title: faker.helpers.arrayElement([
				"React Fundamentals",
				"Advanced TypeScript",
				"Node.js Development",
				"Database Design",
				"API Development",
				"Testing Strategies",
				"DevOps Essentials",
				"Security Best Practices",
				"Performance Optimization",
				"Data Structures",
				"Algorithm Design",
				"System Architecture",
				"Microservices",
				"GraphQL Mastery",
				"Cloud Computing",
			]),
			description: faker.lorem.paragraph(3),
			durationMinutes:
				faker.number.float({ min: 1, max: 5, fractionDigits: 1 }) * 60, // duration in minutes
		});
	}

	await db.insert(course).values(courses);
	console.log(`✅ Seeded ${courses.length} courses`);
}

async function seedProgress() {
	console.log("🌱 Seeding progress...");

	// Get all users and courses
	const users = await db.select().from(user);
	const courses = await db.select().from(course);

	const progressRecords = [];

	// Create progress for each user on random courses
	for (const u of users) {
		// Each user takes 3-8 courses
		const numCourses = faker.number.int({ min: 3, max: 8 });
		const selectedCourses = faker.helpers.arrayElements(courses, numCourses);

		for (const c of selectedCourses) {
			const completionPercentage = faker.number.int({ min: 0, max: 100 });

			const status: progressStatusEnumType =
				completionPercentage === 100
					? "completed"
					: completionPercentage === 0
						? "not_started"
						: "in_progress";

			const startedAt = completionPercentage > 0 ? faker.date.past() : null;
			const completedAt = status === "completed" ? faker.date.recent() : null;

			const timeSpentMinutes = Math.floor(
				(completionPercentage / 100) * c.durationMinutes,
			);

			// Add due dates for some courses (30% chance)
			const hasDueDate = faker.datatype.boolean({ probability: 0.3 });
			let dueDate = null;

			if (hasDueDate) {
				// Have some dates in the past for "overdue" and some in the future
				const isPastDue =
					faker.datatype.boolean({ probability: 0.3 }) &&
					status !== "completed";

				if (isPastDue) {
					// Past due date (1-30 days ago)
					dueDate = faker.date.recent({ days: 30 });
				} else {
					// Future due date (1-60 days from now)
					dueDate = faker.date.future({ years: 0.2 });
				}
			}

			progressRecords.push({
				userId: u.id,
				courseId: c.id,
				completionPercentage,
				timeSpentMinutes,
				status,
				startedAt,
				completedAt,
				dueDate,
			});
		}
	}

	await db.insert(progress).values(progressRecords);
	console.log(`✅ Seeded ${progressRecords.length} progress records`);
}

async function clearData() {
	console.log("🗑️ Clearing existing data...");

	// Delete in reverse order due to foreign key constraints
	await db.delete(progress);
	await db.delete(course);
	await db.delete(user);

	console.log("✅ Data cleared");
}

async function main() {
	try {
		await clearData();
		await seedUsers();
		await seedCourses();
		await seedProgress();
		console.log("🎉 Seeding completed!");
	} catch (error) {
		console.error("❌ Seeding failed:", error);
		process.exit(1);
	}
}

if (require.main === module) {
	main();
}
