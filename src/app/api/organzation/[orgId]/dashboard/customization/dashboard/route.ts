import { NextResponse } from "next/server"
import { handleRoute } from "@/lib/handleRoute"
import { db } from "@/db/drizzle"
import { organizationDashboardCustomization } from "@/db/schema"
import { eq } from "drizzle-orm"
export const GET_ORG_CUSTOMIZATION_DASHBOARD_PATH = (orgId: string) =>
  `/api/organization/${orgId}/dashboard/customization/dashboard`
export const GET = handleRoute(
  "Get Dashboard Customization",
  async (req, { params }) => {
    const { orgId } = await params

    const [dashboardRow] = await db
      .select({ dashboard: organizationDashboardCustomization.dashboard })
      .from(organizationDashboardCustomization)
      .where(eq(organizationDashboardCustomization.id, orgId))

    return NextResponse.json({
      ok: true,
      data: dashboardRow?.dashboard ?? null,
    })
  }
)
