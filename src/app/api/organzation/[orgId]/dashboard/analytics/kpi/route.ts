import { NextResponse } from "next/server"
import { getOrgAuth } from "@/lib/server/organization/GetOrgAuth"
import { getOrganizationKpiStatsAction } from "@/lib/server/internal/getOrganizationKpiStats"
import { ExchangeRate } from "@/util/ExchangeRate"
import { handleRoute } from "@/lib/handleRoute"
import { withQuery } from "@/lib/api/utils"
export const GET_ORG_KPI_PATH = (
  orgId: string,
  year?: number,
  month?: number
) =>
  withQuery(`/api/organization/${orgId}/dashboard/analytics/kpi`, {
    year,
    month,
  })
export const GET = handleRoute("Get Org KPI", async (req, { params }) => {
  const { orgId } = await params
  const { searchParams } = new URL(req.url)

  const year = searchParams.get("year")
    ? Number(searchParams.get("year"))
    : undefined
  const month = searchParams.get("month")
    ? Number(searchParams.get("month"))
    : undefined

  // Verification: Ensure user belongs to this organization
  const org = await getOrgAuth(orgId)

  const [row] = await getOrganizationKpiStatsAction(orgId, year, month)
  const rate = await ExchangeRate(org.currency)

  const data = {
    totalAffiliates: row?.totalAffiliates ?? 0,
    totalLinks: row?.totalLinks ?? 0,
    totalVisitors: row?.totalVisitors ?? 0,
    totalSales: row.sales ?? 0,
    totalCommission: (row?.commission ?? 0) * rate,
    totalCommissionPaid: (row?.paid ?? 0) * rate,
    totalCommissionUnpaid: (row?.unpaid ?? 0) * rate,
    totalAmount: (row?.amount ?? 0) * rate,
    currency: org.currency,
  }

  return NextResponse.json({ ok: true, data: [data] })
})
