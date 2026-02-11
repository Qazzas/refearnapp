import { NextResponse } from "next/server"
import { handleRoute } from "@/lib/handleRoute"
import { getOrgAuth } from "@/lib/server/organization/GetOrgAuth"
import { db } from "@/db/drizzle"
import { websiteDomain } from "@/db/schema"
import { eq, and } from "drizzle-orm"

// 1. Export the Path function (No query params needed here)
export const GET_ACTIVE_DOMAIN_PATH = (orgId: string) =>
  `/api/organization/${orgId}/domain/active` as const

export const GET = handleRoute("Get Active Domain", async (_, { params }) => {
  const { orgId } = await params
  await getOrgAuth(orgId)

  const domain = await db.query.websiteDomain.findFirst({
    where: and(
      eq(websiteDomain.orgId, orgId),
      eq(websiteDomain.isActive, true),
      eq(websiteDomain.isPrimary, true)
    ),
  })

  return NextResponse.json({
    ok: true,
    data: domain || null,
  })
})
