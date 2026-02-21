// actions/promotion-codes.ts
"use server"

import { handleAction } from "@/lib/handleAction"
import { getOrgAuth } from "@/lib/server/organization/GetOrgAuth"
import { unlinkAffiliateService } from "@/lib/server/organization/unlinkAffiliateAction"
import { MutationData } from "@/lib/types/organization/response"
import { updatePromotionAssignmentService } from "@/lib/server/organization/updatePromotionAssignmentService"
import { getTeamAuthAction } from "@/lib/server/team/getTeamAuthAction"

export async function unlinkTeamAffiliateAction(
  orgId: string,
  codeId: string
): Promise<MutationData> {
  return handleAction("unlinkTeamAffiliateAction", async () => {
    await getTeamAuthAction(orgId)
    await unlinkAffiliateService({ orgId, codeId })
    return { ok: true, toast: "Affiliate unlinked successfully" }
  })
}
export async function updateTeamPromotionAssignmentAction(
  orgId: string,
  codeId: string,
  data: any
): Promise<MutationData> {
  return handleAction("updateTeamPromotionAssignmentAction", async () => {
    await getTeamAuthAction(orgId)
    await updatePromotionAssignmentService({
      orgId,
      codeId,
      data,
    })

    return {
      ok: true,
      toast: "Promotion settings updated successfully.",
    }
  })
}
