CREATE TABLE "license_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"key" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"tier" text DEFAULT 'PRO' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"last_validated_at" timestamp with time zone,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "license_keys_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "license_keys" ADD CONSTRAINT "license_keys_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "license_keys_user_id_idx" ON "license_keys" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "license_keys_key_idx" ON "license_keys" USING btree ("key");