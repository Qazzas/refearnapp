import { db } from "@/db/drizzle"
import { licenseKeys } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getOrgAuthForPlan } from "@/lib/server/organization/getOrgAuthForPlan"

export async function getLicense() {
  if (process.env.NEXT_PUBLIC_SELF_HOSTED !== "true") return null

  // Automatically fetch the user context
  const { userId } = await getOrgAuthForPlan()

  const license = await db.query.licenseKeys.findFirst({
    where: eq(licenseKeys.userId, userId),
  })

  if (!license) return null

  const isExpired = new Date(license.expiresAt) < new Date()

  // TODO: Implement Polar API validation (validateWithPolar(license.key))

  return {
    ...license,
    isActive: license.status === "active" && !isExpired,
    isPro: license.tier === "PRO",
    isUltimate: license.tier === "ULTIMATE",
  }
}
export type UserLicense = Awaited<ReturnType<typeof getLicense>>
