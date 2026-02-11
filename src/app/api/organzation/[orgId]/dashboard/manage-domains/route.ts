import { NextResponse } from "next/server"
import { handleRoute } from "@/lib/handleRoute"
import { getOrgAuth } from "@/lib/server/organization/GetOrgAuth"
import { getDomainsAction } from "@/lib/server/internal/getDomainsAction"
import { withQuery } from "@/lib/api/utils"
export const GET_ORG_DOMAIN_MANAGE_PATH = (
  orgId: string,
  query: { offset?: number; domain?: string }
) => withQuery(`/api/organization/${orgId}/dashboard/manage-domains`, query)
export const GET = handleRoute(
  "Get Organization Domains",
  async (req, { params }) => {
    const { orgId } = await params
    const { searchParams } = new URL(req.url)

    // 1. Extract Query Parameters
    const offset = searchParams.get("offset")
      ? Number(searchParams.get("offset"))
      : 1
    const domain = searchParams.get("domain") || undefined

    // 2. 🔐 Authorization - Ensure user has access to this organization
    await getOrgAuth(orgId)

    // 3. Fetch Data
    // Note: getDomainsAction already returns { rows: DomainRow[], hasNext: boolean }
    const result = await getDomainsAction(orgId, offset, domain)

    return NextResponse.json({
      ok: true,
      data: result,
    })
  }
)
