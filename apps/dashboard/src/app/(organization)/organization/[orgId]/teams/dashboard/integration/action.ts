"use server"

import { db } from "@/db/drizzle"
import { organizationPaddleAccount } from "@/db/schema"
import { eq } from "drizzle-orm"
import { MutationData } from "@/lib/types/organization/response"
import { handleAction } from "@/lib/handleAction"
import { saveOrgPaddleWebhookKey } from "@/lib/organizationAction/saveOrgPaddleWebhookKey"
import { getTeamAuthAction } from "@/lib/server/team/getTeamAuthAction"

export async function saveTeamPaddleWebhookKey({
  orgId,
  webhookPublicKey,
}: {
  orgId: string
  webhookPublicKey: string
}): Promise<MutationData> {
  return handleAction("savePaddleWebhookKey", async () => {
    // 🔐 Authorization
    await getTeamAuthAction(orgId)
    await saveOrgPaddleWebhookKey({ orgId, webhookPublicKey })
    return {
      ok: true,
      toast: "✅ Paddle webhook key saved successfully",
    }
  })
}
export async function deleteTeamOrgPaddleAccount(
  orgId: string
): Promise<MutationData> {
  return handleAction("deletePaddleOrgAccount", async () => {
    await getTeamAuthAction(orgId)

    await db
      .delete(organizationPaddleAccount)
      .where(eq(organizationPaddleAccount.orgId, orgId))

    return { ok: true, toast: "deleted paddle account" }
  })
}
