-- 1. Create Enums if they don't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_type') THEN
CREATE TYPE "public"."account_type" AS ENUM('ORGANIZATION', 'AFFILIATE');
END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_provider') THEN
CREATE TYPE "public"."payment_provider" AS ENUM('stripe', 'paddle');
END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'value_type') THEN
CREATE TYPE "public"."value_type" AS ENUM('PERCENTAGE', 'FLAT_FEE');
END IF;
END $$;

-- 2. Create promotion_codes table
CREATE TABLE IF NOT EXISTS "promotion_codes" (
                                                 "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "code" varchar(255) NOT NULL,
    "external_id" varchar(255) NOT NULL,
    "stripe_coupon_id" varchar(255),
    "provider" "payment_provider" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "discount_type" "value_type" NOT NULL,
    "discount_value" numeric(10, 2) NOT NULL,
    "currency" varchar(3) DEFAULT 'USD' NOT NULL,
    "commission_type" "value_type" DEFAULT 'PERCENTAGE' NOT NULL,
    "commission_value" numeric(10, 2) NOT NULL,
    "total_sales" integer DEFAULT 0 NOT NULL,
    "total_revenue_generated" numeric(15, 2) DEFAULT '0.00' NOT NULL,
    "affiliate_id" uuid,
    "is_seen_by_affiliate" boolean DEFAULT false NOT NULL,
    "organization_id" text NOT NULL,
    "deleted_at" timestamp,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
    );

-- 3. Create referrals table
CREATE TABLE IF NOT EXISTS "referrals" (
                                           "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "affiliate_id" uuid,
    "organization_id" text NOT NULL,
    "signup_email" varchar(255),
    "promotion_code_id" uuid,
    "referral_link_id" text, -- Matches affiliate_link.id (text)
    "signed_at" timestamp DEFAULT now() NOT NULL,
    "converted_at" timestamp,
    "total_revenue" numeric(15, 2) DEFAULT '0.00',
    "commission_earned" numeric(15, 2) DEFAULT '0.00',
    "is_seen_by_affiliate" boolean DEFAULT false NOT NULL,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
    );

-- 4. Add Constraints (Foreign Keys)
ALTER TABLE "promotion_codes"
    ADD CONSTRAINT "promotion_codes_affiliate_id_fk"
        FOREIGN KEY ("affiliate_id") REFERENCES "public"."affiliate"("id") ON DELETE SET NULL;

ALTER TABLE "referrals"
    ADD CONSTRAINT "referrals_affiliate_id_fk"
        FOREIGN KEY ("affiliate_id") REFERENCES "public"."affiliate"("id") ON DELETE CASCADE;

ALTER TABLE "referrals"
    ADD CONSTRAINT "referrals_promotion_code_id_fk"
        FOREIGN KEY ("promotion_code_id") REFERENCES "public"."promotion_codes"("id") ON DELETE NO ACTION;

ALTER TABLE "referrals"
    ADD CONSTRAINT "referrals_link_id_fk"
        FOREIGN KEY ("referral_link_id") REFERENCES "public"."affiliate_link"("id") ON DELETE NO ACTION;

-- 5. Add Indexes for performance
CREATE INDEX IF NOT EXISTS "promotion_codes_org_idx" ON "promotion_codes" ("organization_id");
CREATE INDEX IF NOT EXISTS "referrals_affiliate_idx" ON "referrals" ("affiliate_id");