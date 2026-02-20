import { getAffiliatesWithStatsAction } from "@/lib/server/affiliate/getAffiliatesWithStats"
import { PayoutSortKeys } from "@/lib/types/organization/PayoutSortKeys"

export async function getAffiliatePayoutAction(
  orgId: string,
  year?: number,
  month?: number,
  orderBy?: PayoutSortKeys,
  orderDir?: "asc" | "desc",
  limit?: number,
  offset?: number,
  email?: string
) {
  return await getAffiliatesWithStatsAction(orgId, year, month, undefined, {
    exclude: ["signupToPaidRate", "clickToSignupRate"],
    orderBy,
    orderDir,
    limit,
    offset,
    email,
  })
}
