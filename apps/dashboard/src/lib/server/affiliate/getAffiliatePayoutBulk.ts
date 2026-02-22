import { getAffiliatesWithStatsAction } from "@/lib/server/affiliate/getAffiliatesWithStats"
import { PayoutSortKeys } from "@/lib/types/organization/PayoutSortKeys"

export async function getAffiliatePayoutBulkAction(
  orgId: string,
  months: { month: number; year: number }[],
  orderBy?: PayoutSortKeys,
  orderDir?: "asc" | "desc",
  limit?: number,
  offset?: number,
  email?: string
) {
  return await getAffiliatesWithStatsAction(
    orgId,
    undefined,
    undefined,
    months,
    {
      exclude: ["signupToPaidRate", "clickToSignupRate"],
      orderBy,
      orderDir,
      limit,
      offset,
      email,
    }
  )
}
