import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: serial("id").primaryKey(),
	email: varchar("email", { length: 255 }).unique().notNull(),
	password: text("password").notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
