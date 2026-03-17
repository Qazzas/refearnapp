ALTER TABLE "license_keys" ADD COLUMN "polar_id" text;--> statement-breakpoint
ALTER TABLE "license_keys" ADD CONSTRAINT "license_keys_polar_id_unique" UNIQUE("polar_id");