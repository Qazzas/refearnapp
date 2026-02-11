import { NextResponse } from "next/server"
import { handleRoute } from "@/lib/handleRoute"
import { getOrgAuth } from "@/lib/server/organization/GetOrgAuth"
import { db } from "@/db/drizzle"
import { websiteDomain } from "@/db/schema"
import { eq, and } from "drizzle-orm"

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
