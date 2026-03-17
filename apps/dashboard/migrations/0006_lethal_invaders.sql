ALTER TABLE "license_keys" RENAME COLUMN "license_id" TO "polar_id";--> statement-breakpoint
ALTER TABLE "license_keys" DROP CONSTRAINT "license_keys_license_id_unique";--> statement-breakpoint
ALTER TABLE "license_keys" ADD CONSTRAINT "license_keys_polar_id_unique" UNIQUE("polar_id");