import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const course = pgTable("course", {
	id: serial("id").primaryKey(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	durationMinutes: integer("duration_minutes").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
