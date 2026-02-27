// app/actions/auth/orgInfo.ts
"use server"
import { OrgData } from "@/lib/types/organization/organization"
import { MutationData } from "@/lib/types/organization/response"
import { getOrgAuth } from "@/lib/server/organization/GetOrgAuth"
import { handleAction } from "@/lib/handleAction"
import { updateSettings } from "@/lib/organizationAction/UpdateSettings"
export async function updateOrgSettings(
  data: Partial<OrgData> & { id: string }
): Promise<MutationData> {
  return handleAction("updateOrgSettings", async () => {
    await getOrgAuth(data.id)
    await updateSettings(data)
    return { ok: true, toast: "Successfully Updated Org Settings" }
  })
}
