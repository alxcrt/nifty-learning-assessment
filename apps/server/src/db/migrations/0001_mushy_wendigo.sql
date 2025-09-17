CREATE INDEX "user_name_fts_idx" ON "user" USING gin (to_tsvector('english', "name"));--> statement-breakpoint
CREATE INDEX "user_email_fts_idx" ON "user" USING gin (to_tsvector('english', "email"));