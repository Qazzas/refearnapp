"use server"
import { OrgData } from "@/lib/types/organization/organization"
import { MutationData } from "@/lib/types/organization/response"
import { handleAction } from "@/lib/handleAction"
import { updateSettings } from "@/lib/organizationAction/UpdateSettings"
import { getTeamAuthAction } from "@/lib/server/team/getTeamAuthAction"
export async function updateTeamOrgSettings(
  data: Partial<OrgData> & { id: string },
  isTeam: boolean = false
): Promise<MutationData> {
  return handleAction("updateOrgSettings", async () => {
    await getTeamAuthAction(data.id)
    await updateSettings(data, { team: isTeam })
    return { ok: true, toast: "Successfully Updated Org Settings" }
  })
}
