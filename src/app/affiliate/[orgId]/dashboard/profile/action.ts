// app/actions/auth/getUser.ts
"use server"
import { ActionResult } from "@/lib/types/organization/response"
import { revalidatePath } from "next/cache"
import { getAffiliateOrganization } from "@/lib/server/affiliate/GetAffiliateOrganization"
import { updateAffiliatePasswordAction } from "@/lib/server/affiliate/updateAffiliatePassword"
import { validateAffiliatePasswordAction } from "@/lib/server/affiliate/validateAffiliatePassword"
import { updateAffiliateProfileAction } from "@/lib/server/affiliate/updateAffiliateProfile"
import { getPayoutEmailMethod } from "@/lib/server/organization/getPayoutEmailMethod"
import { getAffiliateAuthCapabilities } from "@/lib/server/affiliate/getAffiliateAuthCapabilities"
import { getBaseUrl } from "@/lib/server/affiliate/getBaseUrl"
import { buildAffiliateUrl } from "@/util/Url"
import { handleAction } from "@/lib/handleAction"
import { AppError } from "@/lib/exceptions"

export const getAffiliatePaymentMethod = async (
  orgId: string
): Promise<ActionResult<AffiliatePaymentMethod>> => {
  return handleAction("getAffiliatePaymentMethod", async () => {
    const decoded = await getAffiliateOrganization(orgId)
    const paypalMethod = await getPayoutEmailMethod(decoded)
    return {
      ok: true,
      data: { paypalEmail: paypalMethod?.accountIdentifier ?? null },
    }
  })
}
export async function updateAffiliateProfile(
  orgId: string,
  data: {
    name?: string
    paypalEmail?: string
  }
) {
  return handleAction("updateAffiliateProfile", async () => {
    const decoded = await getAffiliateOrganization(orgId)
    await updateAffiliateProfileAction(decoded, data)
    const baseUrl = await getBaseUrl()
    const revalidationPath = buildAffiliateUrl({
      path: "dashboard/profile",
      organizationId: orgId,
      baseUrl,
      partial: true,
    })
    revalidatePath(revalidationPath)
    return { ok: true }
  })
}

export async function validateCurrentPassword(
  orgId: string,
  currentPassword: string
) {
  return handleAction("Validate Current Password", async () => {
    const decoded = await getAffiliateOrganization(orgId)
    await validateAffiliatePasswordAction(decoded, currentPassword)
    return { ok: true }
  })
}
export async function updateAffiliatePassword(
  orgId: string,
  newPassword: string
) {
  return handleAction("updateAffiliatePassword", async () => {
    const decoded = await getAffiliateOrganization(orgId)
    const { canChangePassword } = await getAffiliateAuthCapabilities(orgId)
    if (!canChangePassword) {
      throw new AppError({
        status: 403,
        toast: "This account cannot change password",
      })
    }
    await updateAffiliatePasswordAction(decoded, newPassword)

    return { ok: true }
  })
}
