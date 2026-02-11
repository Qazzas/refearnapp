import { NextResponse } from "next/server"
import { handleRoute } from "@/lib/handleRoute"
import { getAffiliateOrganization } from "@/lib/server/affiliate/GetAffiliateOrganization"
import { getAffiliateLinks } from "@/lib/server/affiliate/getAffiliateLinks"
import { getReferrerStats } from "@/lib/server/analytics/getReferrerStats"
export const GET = handleRoute(
  "Get Affiliate Referrers",
  async (req, { params }) => {
    const { orgId } = await params
    const { searchParams } = new URL(req.url)

    const year = searchParams.get("year")
      ? Number(searchParams.get("year"))
      : undefined
    const month = searchParams.get("month")
      ? Number(searchParams.get("month"))
      : undefined

    const decoded = await getAffiliateOrganization(orgId)
    const { linkIds } = await getAffiliateLinks(decoded)

    if (!linkIds.length) return NextResponse.json({ ok: true, data: [] })

    const data = await getReferrerStats(linkIds, year, month)

    return NextResponse.json({ ok: true, data })
  }
)
