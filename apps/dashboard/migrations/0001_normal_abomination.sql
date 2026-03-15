CREATE TABLE "license_activations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"license_id" uuid NOT NULL,
	"activation_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_license_activation" UNIQUE("license_id","activation_id")
);
--> statement-breakpoint
ALTER TABLE "license_activations" ADD CONSTRAINT "license_activations_license_id_license_keys_id_fk" FOREIGN KEY ("license_id") REFERENCES "public"."license_keys"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "license_activations_license_id_idx" ON "license_activations" USING btree ("license_id");