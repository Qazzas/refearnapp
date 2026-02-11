"use server"
import { handleAction } from "@/lib/handleAction"
import { cookies } from "next/headers"
import { getBaseUrl } from "@/lib/server/affiliate/getBaseUrl"
import { buildAffiliateUrl } from "@/util/Url"

export async function logoutAction({
  affiliate,
  isTeam,
  orgId,
}: {
  affiliate?: boolean
  isTeam?: boolean
  orgId?: string
}) {
  return handleAction("logoutAction", async () => {
    const cookieStore = await cookies()

    if (affiliate && orgId) {
      cookieStore.delete(`affiliateToken-${orgId}`)
      const baseUrl = await getBaseUrl()
      const redirectUrl = buildAffiliateUrl({
        path: "login",
        organizationId: orgId,
        baseUrl,
        partial: true,
      })
      console.log("redirect url", redirectUrl)
      return { ok: true, redirectTo: redirectUrl }
    }

    if (isTeam && orgId) {
      cookieStore.delete(`teamToken-${orgId}`)
      return { ok: true, redirectTo: `/organization/${orgId}/teams/login` }
    }

    cookieStore.delete("organizationToken")
    return { ok: true, redirectTo: "/login" }
  })
}
