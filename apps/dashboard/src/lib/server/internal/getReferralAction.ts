// @/lib/server/referrals/getReferralsAction.ts
import { db } from "@/db/drizzle"
import { referrals, affiliate } from "@/db/schema"
import { eq, and, desc } from "drizzle-orm"

export async function getReferralsAction({
  orgId,
  affiliateId,
  limit = 10,
  offset = 0,
}: {
  orgId: string
  affiliateId?: string
  limit?: number
  offset?: number
}) {
  const rows = await db
    .select({
      id: referrals.id,
      signupEmail: referrals.signupEmail,
      signedAt: referrals.signedAt,
      convertedAt: referrals.convertedAt,
      totalRevenue: referrals.totalRevenue,
      commissionEarned: referrals.commissionEarned,
      affiliateName: affiliate.name,
    })
    .from(referrals)
    .leftJoin(affiliate, eq(referrals.affiliateId, affiliate.id))
    .where(
      and(
        eq(referrals.organizationId, orgId),
        affiliateId ? eq(referrals.affiliateId, affiliateId) : undefined
      )
    )
    .orderBy(desc(referrals.signedAt))
    .limit(limit)
    .offset(offset)

  // 🛡️ Privacy Masking (Server-Side)
  return rows.map((row) => {
    const email = row.signupEmail || ""
    const [name, domain] = email.split("@")

    // Masking: "john.doe@gmail.com" -> "j***@gmail.com"
    const maskedEmail =
      name && domain ? `${name[0]}***@${domain}` : "Hidden User"

    return {
      ...row,
      signupEmail: maskedEmail,
    }
  })
}
