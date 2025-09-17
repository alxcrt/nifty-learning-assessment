DROP INDEX "user_name_fts_idx";--> statement-breakpoint
DROP INDEX "user_email_fts_idx";--> statement-breakpoint
CREATE INDEX "user_search_idx" ON "user" USING gin ((
          setweight(to_tsvector('english', "name"), 'A') ||
          setweight(to_tsvector('english', "email"), 'B')
      ));