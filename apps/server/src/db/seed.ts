import { faker } from "@faker-js/faker";
import { db } from "./index";
import { course } from "./schema/course";
import { user } from "./schema/user";

async function seedUsers() {
	console.log("🌱 Seeding users...");

	const users = [];

	for (let i = 0; i < 20; i++) {
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
			duration: faker.number.int({ min: 1, max: 8 }), // hours
		});
	}

	await db.insert(course).values(courses);
	console.log(`✅ Seeded ${courses.length} courses`);
}

async function main() {
	try {
		await seedUsers();
		await seedCourses();
		console.log("🎉 Seeding completed!");
	} catch (error) {
		console.error("❌ Seeding failed:", error);
		process.exit(1);
	}
}

if (require.main === module) {
	main();
}
