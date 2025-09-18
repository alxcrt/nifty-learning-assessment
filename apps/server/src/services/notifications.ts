import { and, eq, isNotNull, sql } from "drizzle-orm";
import * as cron from "node-cron";
import { db } from "../db";
import { course } from "../db/schema/course";
import { progress } from "../db/schema/progress";
import { user } from "../db/schema/user";
import { emailService } from "./email";

export class NotificationService {
	private scheduledJobs: Map<string, cron.ScheduledTask> = new Map();

	// Check for overdue courses every day at 9 AM
	scheduleOverdueNotifications() {
		const job = cron.schedule("0 9 * * *", async () => {
			await this.sendOverdueNotifications();
		});

		this.scheduledJobs.set("overdue-course-notifications", job);
		return job;
	}

	async sendOverdueNotifications() {
		try {
			const overdueData = await db
				.select({
					userId: user.id,
					userName: user.name,
					userEmail: user.email,
					courseTitle: course.title,
					dueDate: progress.dueDate,
					status: progress.status,
				})
				.from(progress)
				.innerJoin(user, eq(progress.userId, user.id))
				.innerJoin(course, eq(progress.courseId, course.id))
				.where(
					and(
						isNotNull(progress.dueDate),
						sql`DATE(${progress.dueDate}) < CURRENT_DATE`,
						sql`${progress.status} != 'completed'`,
					),
				);

			// Group by user
			const userOverdueMap = new Map<
				number,
				{
					userName: string;
					userEmail: string;
					courses: {
						title: string;
						dueDate: string;
						daysOverdue: number;
					}[];
				}
			>();

			for (const item of overdueData) {
				if (!item.dueDate) continue;

				const daysOverdue = Math.floor(
					(Date.now() - new Date(item.dueDate).getTime()) /
						(1000 * 60 * 60 * 24),
				);

				if (!userOverdueMap.has(item.userId)) {
					userOverdueMap.set(item.userId, {
						userName: item.userName,
						userEmail: item.userEmail,
						courses: [],
					});
				}

				userOverdueMap.get(item.userId)?.courses.push({
					title: item.courseTitle,
					dueDate: new Date(item.dueDate).toLocaleDateString(),
					daysOverdue,
				});
			}

			for (const [_userId, userData] of userOverdueMap) {
				console.log(
					`Sending overdue notification to ${userData.userEmail} for ${userData.courses.length} courses.`,
				);
				await emailService.sendOverdueNotification(userData);

				// Small delay to avoid spamming the email server
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
		} catch (error) {
			console.error(error);
		}
	}

	start() {
		for (const [name, job] of this.scheduledJobs) {
			console.log(`Starting scheduled job: ${name}`);
			job.start();
		}
	}

	stop() {
		for (const [name, job] of this.scheduledJobs) {
			console.log(`Stopping scheduled job: ${name}`);
			job.stop();
		}
	}
}

export const notificationService = new NotificationService();

// Initialize jobs (but don't start them yet)
notificationService.scheduleOverdueNotifications();
