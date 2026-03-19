CREATE TABLE "discord_account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"discord_user_id" text NOT NULL,
	"discord_username" text NOT NULL,
	"plan" text NOT NULL,
	"is_self_hosted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "discord_account_owner_id_unique" UNIQUE("owner_id")
);
--> statement-breakpoint
CREATE INDEX "discord_account_discord_user_idx" ON "discord_account" USING btree ("discord_user_id");