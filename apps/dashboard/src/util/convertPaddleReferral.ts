import { db } from "@/db/drizzle"
import { referrals } from "@/db/schema"
import { eq, and, isNull } from "drizzle-orm"

export async function convertPaddleReferral({
  email,
  customerId,
  affiliateId,
  organizationId,
  affiliateLinkId,
  promotionCodeId,
  amount,
  commission,
}: {
  email: string | null | undefined
  customerId: string
  affiliateId: string
  organizationId: string
  affiliateLinkId: string | null
  promotionCodeId: string | null
  amount: string
  commission: number
}) {
  try {
    const finalEmail = (email || `${customerId}@paddle.com`).toLowerCase()

    const referralToUpdate = await db.query.referrals.findFirst({
      where: (t, { eq, and, isNull }) =>
        and(
          eq(t.signupEmail, finalEmail),
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
          promotionCodeId: referralToUpdate.promotionCodeId ?? promotionCodeId,
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
        promotionCodeId: promotionCodeId,
        signupEmail: finalEmail,
        convertedAt: new Date(),
        totalRevenue: amount,
        commissionEarned: commission.toString(),
      })
    }
  } catch (e) {
    console.error("Failed to convert Paddle referral:", e)
  }
}
