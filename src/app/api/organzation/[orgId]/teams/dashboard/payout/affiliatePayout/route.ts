import { NextResponse } from "next/server"
import { handleRoute } from "@/lib/handleRoute"
import { getTeamAuthAction } from "@/lib/server/team/getTeamAuthAction"
import { getAffiliatePayoutData } from "@/lib/server/affiliate/getAffiliatePayoutData"
import { OrderBy, OrderDir } from "@/lib/types/analytics/orderTypes"
import { withQuery } from "@/lib/api/utils"
export const GET_TEAM_PAYOUTS_PATH = (
  orgId: string,
  query: {
    year?: number
    month?: number
    mode?: "TABLE" | "EXPORT"
    offset?: number
    email?: string
    orderBy?: OrderBy
    orderDir?: OrderDir
  }
) =>
  withQuery(
    `/api/organization/${orgId}/teams/dashboard/payout/affiliatePayout`,
    query
  )
export const GET = handleRoute(
  "Get Team Affiliate Payouts",
  async (req, { params }) => {
    const { orgId } = await params
    const { searchParams } = new URL(req.url)

    const mode = (searchParams.get("mode") as "TABLE" | "EXPORT") || "TABLE"
    const year = searchParams.get("year")
      ? Number(searchParams.get("year"))
      : undefined
    const month = searchParams.get("month")
      ? Number(searchParams.get("month"))
      : undefined
    const orderBy = (searchParams.get("orderBy") as OrderBy) || undefined
    const orderDir = (searchParams.get("orderDir") as OrderDir) || undefined
    const offset = searchParams.get("offset")
      ? Number(searchParams.get("offset"))
      : 1
    const email = searchParams.get("email") || undefined

    const org = await getTeamAuthAction(orgId)

    const result = await getAffiliatePayoutData(
      mode,
      org,
      orgId,
      year,
      month,
      orderBy,
      orderDir,
      offset,
      email
    )

    return NextResponse.json(result)
  }
)
