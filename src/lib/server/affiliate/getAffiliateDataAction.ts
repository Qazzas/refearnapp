import { db } from "@/db/drizzle"
import { eq, and } from "drizzle-orm"
import { affiliate, affiliatePayoutMethod } from "@/db/schema"
import { decodedType } from "@/lib/types/organization/decodedType"
import { getPayoutEmailMethod } from "@/lib/server/organization/getPayoutEmailMethod"
import { AppError } from "@/lib/exceptions"

export const getAffiliateDataAction = async (decoded: decodedType) => {
  const affiliateData = await db.query.affiliate.findFirst({
    where: eq(affiliate.id, decoded.id),
  })

  if (!affiliateData) {
    throw new AppError({
      status: 404,
      error: "User not found",
      toast: "Your account could not be found.",
    })
  }

  // Fetch PayPal payout method (if any)
  const paypalMethod = await getPayoutEmailMethod(decoded)

  return {
    ...affiliateData,
    paypalEmail: paypalMethod?.accountIdentifier ?? null,
  }
}
