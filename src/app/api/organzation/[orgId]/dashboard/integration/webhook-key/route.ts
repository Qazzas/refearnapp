import { NextResponse } from "next/server"
import { handleRoute } from "@/lib/handleRoute"
import { getOrgAuth } from "@/lib/server/organization/GetOrgAuth"
import { getWebhookKey } from "@/lib/organizationAction/getWebhookKey"
export const GET_ORG_WEBHOOK_KEY_PATH = (orgId: string) =>
  `/api/organization/${orgId}/dashboard/integration/webhook-key`
export const GET = handleRoute("Get Org Webhook Key", async (_, { params }) => {
  const { orgId } = await params

  // 🔐 Secure Authorization - Only admins can see the webhook key
  await getOrgAuth(orgId)

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
})
