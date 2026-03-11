import { db } from "@/db/drizzle"
import { licenseKeys } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getOrgOwnerId } from "@/lib/server/organization/getOrgOwnerId"

// lib/server/organization/getLicense.ts

export async function getLicense(orgId: string) {
  if (process.env.NEXT_PUBLIC_SELF_HOSTED !== "true") return null

  const ownerId = await getOrgOwnerId(orgId)
  if (!ownerId) return null

  const license = await db.query.licenseKeys.findFirst({
    where: eq(licenseKeys.userId, ownerId),
  })
  if (!license) {
    return {
      isCommunity: true,
      isActive: true,
      isPro: false,
      isUltimate: false,
    }
  }

  const isExpired = new Date(license.expiresAt) < new Date()

  return {
    ...license,
    isCommunity: false,
    isActive: license.status === "active" && !isExpired,
    isPro: license.tier === "PRO",
    isUltimate: license.tier === "ULTIMATE",
  }
}
export type UserLicense = Awaited<ReturnType<typeof getLicense>>
