import { relations } from "drizzle-orm";
import {
	integer,
	pgEnum,
	pgTable,
	serial,
	timestamp,
} from "drizzle-orm/pg-core";
import { course } from "./course";
import { user } from "./user";

export const progressStatusEnum = pgEnum("progress_status", [
	"not_started",
	"in_progress",
	"completed",
]);

export type progressStatusEnumType =
	(typeof progressStatusEnum.enumValues)[number];

export const progress = pgTable("progress", {
	id: serial("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => user.id),
	courseId: integer("course_id")
		.notNull()
		.references(() => course.id),
	completionPercentage: integer("completion_percentage").notNull().default(0),
	timeSpentMinutes: integer("time_spent_minutes").notNull().default(0),
	status: progressStatusEnum("status").notNull().default("not_started"),
	startedAt: timestamp("started_at"),
	completedAt: timestamp("completed_at"),
	dueDate: timestamp("due_date"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const progressRelations = relations(progress, ({ many }) => ({
	user: many(user),
	course: many(course),
}));
