import { NextResponse } from "next/server"
import { handleRoute } from "@/lib/handleRoute"
import { getAffiliateOrganization } from "@/lib/server/affiliate/GetAffiliateOrganization"
import { getAffiliateCommissionByMonthAction } from "@/lib/server/affiliate/getAffiliateCommissionByMonth"
import { getOrganization } from "@/lib/server/organization/getOrganization"
import { ExchangeRate } from "@/util/ExchangeRate"
export const GET = handleRoute(
  "Get Affiliate Monthly Commissions",
  async (req, { params }) => {
    const { orgId } = await params
    const { searchParams } = new URL(req.url)

    // 1. Extract and default the Year
    const targetYear = searchParams.get("year")
      ? Number(searchParams.get("year"))
      : new Date().getFullYear()

    // 2. 🔐 Affiliate Authorization
    const decoded = await getAffiliateOrganization(orgId)

    // 3. Fetch Organization details for Currency/Exchange logic
    const org = await getOrganization(decoded.orgId)
    const rate = await ExchangeRate(org.currency)

    // 4. Fetch the raw month-by-month data
    const rows = await getAffiliateCommissionByMonthAction(decoded, targetYear)

    // 5. Convert amounts to Org Currency
    const data = rows.map((row) => ({
      ...row,
      totalCommission: (row.totalCommission ?? 0) * rate,
      paidCommission: (row.paidCommission ?? 0) * rate,
      unpaidCommission: (row.unpaidCommission ?? 0) * rate,
      currency: org.currency,
    }))

    return NextResponse.json({
      ok: true,
      data,
    })
  }
)
