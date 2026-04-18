import { db } from "@/db/drizzle"
import { referrals } from "@/db/schema"
import { eq } from "drizzle-orm"
import Stripe from "stripe"

export async function convertReferral(
  session: Stripe.Checkout.Session,
  organizationId: string,
  affiliateId: string,
  affiliateLinkId: string | null,
  amount: string,
  commission: number,
  promotionCodeId?: string | null
) {
  try {
    const refDataRaw = session.metadata?.refearnapp_affiliate_code
    const metaData = refDataRaw ? JSON.parse(refDataRaw) : null

    const referralEmail = (
      metaData?.email ||
      session.customer_details?.email ||
      `${session.customer || session.id}@stripe.com`
    )?.toLowerCase()
    if (!referralEmail) return
    const referralToUpdate = await db.query.referrals.findFirst({
      where: (t, { eq, and, isNull }) =>
        and(
          eq(t.signupEmail, referralEmail),
          eq(t.affiliateId, affiliateId),
          isNull(t.convertedAt)
        ),
    })

    if (referralToUpdate) {
      await db
        .update(referrals)
        .set({
          convertedAt: new Date(),
          affiliateLinkId: referralToUpdate.affiliateLinkId ?? affiliateLinkId,
          promotionCodeId: promotionCodeId ?? referralToUpdate.promotionCodeId,
          totalRevenue: amount,
          commissionEarned: commission.toString(),
          updatedAt: new Date(),
        })
        .where(eq(referrals.id, referralToUpdate.id))
    } else {
      await db.insert(referrals).values({
        organizationId: organizationId,
        affiliateId: affiliateId,
        affiliateLinkId: affiliateLinkId,
        promotionCodeId: promotionCodeId ?? null,
        signupEmail: referralEmail,
        convertedAt: new Date(),
        totalRevenue: amount,
        commissionEarned: commission.toString(),
      })

      console.log(`✨ Direct attribution created for ${referralEmail}`)
    }
  } catch (e) {
    console.error("Failed to convert/insert referral:", e)
  }
}
