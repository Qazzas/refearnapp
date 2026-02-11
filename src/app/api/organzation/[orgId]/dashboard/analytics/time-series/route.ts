import { NextResponse } from "next/server"
import { getOrgAuth } from "@/lib/server/organization/GetOrgAuth"
import { getOrgAffiliateLinks } from "@/lib/server/affiliate/GetOrgAffiliateLinks"
import { getTimeSeriesData } from "@/lib/server/analytics/getTimeSeriesData"
import { ExchangeRate } from "@/util/ExchangeRate"
import { handleRoute } from "@/lib/handleRoute"
import { withQuery } from "@/lib/api/utils"
export const GET_ORG_TIME_SERIES_PATH = (
  orgId: string,
  year?: number,
  month?: number
) =>
  withQuery(`/api/organization/${orgId}/dashboard/analytics/time-series`, {
    year,
    month,
  })
export const GET = handleRoute(
  "Get Org Time Series",
  async (req, { params }) => {
    const { orgId } = await params
    const { searchParams } = new URL(req.url)

    const year = searchParams.get("year")
      ? Number(searchParams.get("year"))
      : undefined
    const month = searchParams.get("month")
      ? Number(searchParams.get("month"))
      : undefined

    const org = await getOrgAuth(orgId)
    const rate = await ExchangeRate(org.currency)
    const { linkIds } = await getOrgAffiliateLinks(org, orgId)

    if (!linkIds.length) return NextResponse.json({ ok: true, data: [] })

    const data = await getTimeSeriesData(linkIds, year, month, false)

    const formattedData = data.map((item: any) => ({
      ...item,
      amount: item.amount * rate,
    }))

    return NextResponse.json({ ok: true, data: formattedData })
  }
)
