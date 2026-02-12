"use server"

import { db } from "@/db/drizzle"
import { organizationPaddleAccount } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getOrgAuth } from "@/lib/server/organization/GetOrgAuth"
import { MutationData } from "@/lib/types/organization/response"
import { handleAction } from "@/lib/handleAction"
import { saveOrgPaddleWebhookKey } from "@/lib/organizationAction/saveOrgPaddleWebhookKey"

export async function savePaddleWebhookKey({
  orgId,
  webhookPublicKey,
}: {
  orgId: string
  webhookPublicKey: string
}): Promise<MutationData> {
  return handleAction("savePaddleWebhookKey", async () => {
    // 🔐 Authorization
    console.log("Saving webhook key for org:", orgId, webhookPublicKey)
    await getOrgAuth(orgId)
    await saveOrgPaddleWebhookKey({ orgId, webhookPublicKey })
    return {
      ok: true,
      toast: "✅ Paddle webhook key saved successfully",
    }
  })
}
export async function deleteOrgPaddleAccount(
  orgId: string
): Promise<MutationData> {
  return handleAction("deletePaddleOrgAccount", async () => {
    await getOrgAuth(orgId)

    await db
      .delete(organizationPaddleAccount)
      .where(eq(organizationPaddleAccount.orgId, orgId))

    return { ok: true, toast: "deleted paddle account" }
  })
}
