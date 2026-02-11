import { NextResponse } from "next/server"
import { handleRoute } from "@/lib/handleRoute"
import { getTeamAuthAction } from "@/lib/server/team/getTeamAuthAction"
import { getWebhookKey } from "@/lib/organizationAction/getWebhookKey"
export const GET = handleRoute(
  "Get Team Org Webhook Key",
  async (_, { params }) => {
    const { orgId } = await params

    // 🔐 Team Authorization - Verify the staff member belongs to this org
    await getTeamAuthAction(orgId)

    const existing = await getWebhookKey(orgId)

    if (existing.length === 0) {
      return NextResponse.json({
        ok: true,
        data: { webhookPublicKey: null },
      })
    }

    return NextResponse.json({
      ok: true,
      data: { webhookPublicKey: existing[0].webhookPublicKey },
    })
  }
)
