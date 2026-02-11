import { NextResponse } from "next/server"
import { handleRoute } from "@/lib/handleRoute"
import { getAffiliateOrganization } from "@/lib/server/affiliate/GetAffiliateOrganization"
import { getAffiliateLinksWithStatsAction } from "@/lib/server/affiliate/getAffiliateLinksWithStats"
import { getOrgCurrencyAffiliate } from "@/lib/server/internal/getOrgCurrencyAffiliate"
import { ExchangeRate } from "@/util/ExchangeRate"
export const GET = handleRoute(
  "Get Affiliate Links with Stats",
  async (req, { orgId }: { orgId: string }) => {
    const { searchParams } = new URL(req.url)

    // 1. Extract Date Filters
    const year = searchParams.get("year")
      ? Number(searchParams.get("year"))
      : undefined
    const month = searchParams.get("month")
      ? Number(searchParams.get("month"))
      : undefined

    // 2. 🔐 Affiliate Authorization
    // This ensures the affiliate only sees links belonging to them within this Org
    const decoded = await getAffiliateOrganization(orgId)

    // 3. Currency Logic
    const currency = await getOrgCurrencyAffiliate(orgId)
    const rate = await ExchangeRate(currency)

    // 4. Fetch Data
    const rows = await getAffiliateLinksWithStatsAction(decoded, year, month)

    // 5. Apply Exchange Rate and Format
    const data = rows.map((item) => ({
      ...item,
      commission: item.commission * rate,
    }))

    return NextResponse.json({
      ok: true,
      data,
    })
  }
)
