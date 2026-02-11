// actions/getAffiliateCommissionByMonth.ts
"use server"
import { getAffiliateOrganization } from "@/lib/server/affiliate/GetAffiliateOrganization"
import { AffiliatePaymentRow } from "@/lib/types/affiliate/affiliatePaymentRow"
import { ActionResult } from "@/lib/types/organization/response"
import { getAffiliateCommissionByMonthAction } from "@/lib/server/affiliate/getAffiliateCommissionByMonth"
import { getOrganization } from "@/lib/server/organization/getOrganization"
import { ExchangeRate } from "@/util/ExchangeRate"
import { handleAction } from "@/lib/handleAction"

export const getAffiliateCommissionByMonth = async (
  orgId: string,
  year?: number
): Promise<ActionResult<AffiliatePaymentRow[]>> => {
  return handleAction("getAffiliateCommissionByMonth", async () => {
    const decoded = await getAffiliateOrganization(orgId)
    const targetYear = year ?? new Date().getFullYear()
    const rows = await getAffiliateCommissionByMonthAction(decoded, targetYear)
    const org = await getOrganization(decoded.orgId)
    const rate = await ExchangeRate(org.currency)
    const convertedRows: AffiliatePaymentRow[] = rows.map((row) => ({
      ...row,
      totalCommission: (row.totalCommission ?? 0) * rate,
      paidCommission: (row.paidCommission ?? 0) * rate,
      unpaidCommission: (row.unpaidCommission ?? 0) * rate,
      currency: org.currency,
    }))
    return { ok: true, data: convertedRows }
  })
}
