ALTER TABLE "affiliate_click" DROP CONSTRAINT "affiliate_click_affiliate_link_id_affiliate_link_id_fk";
--> statement-breakpoint
ALTER TABLE "affiliate_invoice" DROP CONSTRAINT "affiliate_invoice_affiliate_link_id_affiliate_link_id_fk";
--> statement-breakpoint
ALTER TABLE "referrals" DROP CONSTRAINT "referrals_referral_link_id_affiliate_link_id_fk";
--> statement-breakpoint
ALTER TABLE "affiliate_click" ADD CONSTRAINT "affiliate_click_affiliate_link_id_affiliate_link_id_fk" FOREIGN KEY ("affiliate_link_id") REFERENCES "public"."affiliate_link"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "affiliate_invoice" ADD CONSTRAINT "affiliate_invoice_affiliate_link_id_affiliate_link_id_fk" FOREIGN KEY ("affiliate_link_id") REFERENCES "public"."affiliate_link"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referral_link_id_affiliate_link_id_fk" FOREIGN KEY ("referral_link_id") REFERENCES "public"."affiliate_link"("id") ON DELETE cascade ON UPDATE cascade;