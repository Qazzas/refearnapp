import { ActionResult } from "@/lib/types/organization/response"
import { OrgData } from "@/lib/types/organization/organization"
import { handleAction } from "@/lib/handleAction"
import { getTeamAuthAction } from "@/lib/server/team/getTeamAuthAction"
import { getOrgData } from "@/lib/server/organization/getOrgData"

export const getTeamOrgSettings = async (
  orgId: string
): Promise<ActionResult<OrgData>> => {
  return handleAction("org Team Info", async () => {
    await getTeamAuthAction(orgId)
    return await getOrgData(orgId, true)
  })
}
