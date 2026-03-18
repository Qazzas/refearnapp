"use server"
import { getAffiliateOrganization } from "@/lib/server/affiliate/GetAffiliateOrganization"
import { MutationData } from "@/lib/types/organization/response"
import { createFullUrl } from "@/lib/server/affiliate/createFullUrl"
import { getBaseUrl } from "@/lib/server/affiliate/getBaseUrl"
import { buildAffiliateUrl } from "@/util/Url"
import { handleAction } from "@/lib/handleAction"
import { revalidatePath } from "next/cache"
import { updateAffiliateLinkService } from "@/lib/server/affiliate/updateAffiliateLinkService"

export const createAffiliateLink = async (
  orgId: string
): Promise<MutationData> => {
  return handleAction("createAffiliateLink", async () => {
    const decoded = await getAffiliateOrganization(orgId)
    const { org, fullUrl } = await createFullUrl(decoded)
    const baseUrl = await getBaseUrl()
    buildAffiliateUrl({
      path: "dashboard/links",
      organizationId: org.id,
      baseUrl,
      partial: true,
    })
    return { ok: true, toast: `Affiliate link created: ${fullUrl}` }
  })
}
export const updateLinkSlug = async (
  orgId: string,
  oldId: string,
  newSlug: string
): Promise<MutationData> => {
  return handleAction("updateLinkSlug", async () => {
    // 1. Auth check
    const decoded = await getAffiliateOrganization(orgId)

    // 2. Call the reusable service
    await updateAffiliateLinkService(decoded.id, orgId, oldId, newSlug)

    // 3. UI Sync
    revalidatePath(`/affiliate/${orgId}/dashboard/links`)

    return {
      ok: true,
      toast: "Link updated successfully!",
    }
  })
}
