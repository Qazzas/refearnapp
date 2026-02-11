import { NextResponse } from "next/server"
import { getOrgAuth } from "@/lib/server/organization/GetOrgAuth"
import { getOrgAffiliateLinks } from "@/lib/server/affiliate/GetOrgAffiliateLinks"
import { getReferrerStats } from "@/lib/server/analytics/getReferrerStats"
import { handleRoute } from "@/lib/handleRoute"
import { withQuery } from "@/lib/api/utils"
export const GET_ORG_REFERRERS_PATH = (
  orgId: string,
  year?: number,
  month?: number
) =>
  withQuery(`/api/organization/${orgId}/dashboard/analytics/referrers`, {
    year,
    month,
  })
export const GET = handleRoute("Get Org Referrers", async (req, { params }) => {
  const { orgId } = await params
  const { searchParams } = new URL(req.url)

  const year = searchParams.get("year")
    ? Number(searchParams.get("year"))
    : undefined
  const month = searchParams.get("month")
    ? Number(searchParams.get("month"))
    : undefined

  const org = await getOrgAuth(orgId)
  const { linkIds } = await getOrgAffiliateLinks(org, orgId)
  const referrerStats = await getReferrerStats(linkIds, year, month)

  return NextResponse.json({ ok: true, data: referrerStats })
})
