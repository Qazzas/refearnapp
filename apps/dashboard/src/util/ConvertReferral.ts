import { db } from "@/db/drizzle"
import { referrals } from "@/db/schema"
import { eq } from "drizzle-orm"
import Stripe from "stripe"

export async function convertReferral(
  session: Stripe.Checkout.Session,
  affiliateLinkId: string,
  amount: string,
  commission: number
) {
  const refDataRaw = session.metadata?.refearnapp_affiliate_code
  if (!refDataRaw) return

  try {
    const metaData = JSON.parse(refDataRaw)
    if (!metaData.email) return

    const referralEmail = metaData.email.toLowerCase()

    const referralToUpdate = await db.query.referrals.findFirst({
      where: (t, { eq, and, isNull }) =>
        and(
          eq(t.signupEmail, referralEmail),
          eq(t.affiliateLinkId, affiliateLinkId),
          isNull(t.convertedAt)
        ),
    })

    if (referralToUpdate) {
      await db
        .update(referrals)
        .set({
          convertedAt: new Date(),
          totalRevenue: amount,
          commissionEarned: commission.toString(),
          updatedAt: new Date(),
        })
        .where(eq(referrals.id, referralToUpdate.id))
    }
  } catch (e) {
    console.error("Failed to convert referral:", e)
  }
}
