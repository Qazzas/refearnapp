import { db } from "@/db/drizzle"
import { referrals } from "@/db/schema"
import { eq, and, isNull } from "drizzle-orm"

export async function convertPaddleReferral({
  email,
  affiliateId,
  amount,
  commission,
}: {
  email: string
  affiliateId: string
  amount: string
  commission: number
}) {
  const referralToUpdate = await db.query.referrals.findFirst({
    where: and(
      eq(referrals.signupEmail, email.toLowerCase()),
      eq(referrals.affiliateId, affiliateId),
      isNull(referrals.convertedAt)
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
}
