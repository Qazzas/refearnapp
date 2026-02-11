import { NextResponse } from "next/server"
import { handleRoute } from "@/lib/handleRoute"
import { getTeamAuthAction } from "@/lib/server/team/getTeamAuthAction"
import { getAffiliatePayoutBulkData } from "@/lib/server/affiliate/getAffiliatePayoutBulkData"
import { OrderBy, OrderDir } from "@/lib/types/analytics/orderTypes"
import { withQuery } from "@/lib/api/utils"
export const GET_TEAM_PAYOUTS_BULK_PATH = (
  orgId: string,
  query: {
    months: { month: number; year: number }[]
    mode?: "TABLE" | "EXPORT"
    offset?: number
    email?: string
    orderBy?: OrderBy
    orderDir?: OrderDir
  }
) =>
  withQuery(
    `/api/organization/${orgId}/teams/dashboard/payout/affiliateBulkPayout`,
    query
  )
export const GET = handleRoute(
  "Get Team Affiliate Bulk Payouts",
  async (req, { params }) => {
    const { orgId } = await params
    const { searchParams } = new URL(req.url)

    const mode = (searchParams.get("mode") as "TABLE" | "EXPORT") || "TABLE"
    const orderBy = (searchParams.get("orderBy") as OrderBy) || undefined
    const orderDir = (searchParams.get("orderDir") as OrderDir) || undefined
    const offset = searchParams.get("offset")
      ? Number(searchParams.get("offset"))
      : 1
    const email = searchParams.get("email") || undefined

    const monthsRaw = searchParams.get("months")
    const months = monthsRaw ? JSON.parse(monthsRaw) : []

    const org = await getTeamAuthAction(orgId)

    const result = await getAffiliatePayoutBulkData(
      mode,
      org,
      orgId,
      months,
      orderBy,
      orderDir,
      offset,
      email
    )

    return NextResponse.json(result)
  }
)
