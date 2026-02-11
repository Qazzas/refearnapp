import { ActionResult } from "@/lib/types/organization/response"
import { OrgData } from "@/lib/types/organization/organization"
import { handleAction } from "@/lib/handleAction"
import { getOrgAuth } from "@/lib/server/organization/GetOrgAuth"
import { getOrgData } from "@/lib/server/organization/getOrgData"

export const getOrgSettings = async (
  orgId: string
): Promise<ActionResult<OrgData>> => {
  return handleAction("orgInfo", async () => {
    await getOrgAuth(orgId)
    return await getOrgData(orgId, false)
  })
}
