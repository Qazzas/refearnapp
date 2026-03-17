ALTER TABLE "license_keys" ADD COLUMN "license_id" text;--> statement-breakpoint
ALTER TABLE "license_keys" ADD CONSTRAINT "license_keys_license_id_unique" UNIQUE("license_id");