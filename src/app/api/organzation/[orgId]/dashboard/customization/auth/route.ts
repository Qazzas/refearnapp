import { NextResponse } from "next/server"
import { handleRoute } from "@/lib/handleRoute"
import { db } from "@/db/drizzle"
import { organizationAuthCustomization } from "@/db/schema"
import { eq } from "drizzle-orm"
export const GET_ORG_CUSTOMIZATION_AUTH_PATH = (orgId: string) =>
  `/api/organization/${orgId}/dashboard/customization/auth`
export const GET = handleRoute(
  "Get Auth Customization",
  async (req, { params }) => {
    const { orgId } = await params

    const [authRow] = await db
      .select({ auth: organizationAuthCustomization.auth })
      .from(organizationAuthCustomization)
      .where(eq(organizationAuthCustomization.id, orgId))

    return NextResponse.json({
      ok: true,
      data: authRow?.auth ?? null,
    })
  }
)
