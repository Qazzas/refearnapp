import { db } from "@/db/drizzle"
import { licenseKeys, licenseActivations } from "@/db/schema"
import { eq } from "drizzle-orm"
import { handleAction } from "@/lib/handleAction"
import { getOrgOwnerId } from "@/lib/server/organization/getOrgOwnerId"
import { CENTRAL_API_URL } from "@/lib/constants/centralDomain"

export async function getLicense(orgId: string) {
  if (process.env.NEXT_PUBLIC_SELF_HOSTED !== "true") return null

  const ownerId = await getOrgOwnerId(orgId)
  if (!ownerId) return null

  return await handleAction("GetLicenseSync", async () => {
    // Perform explicit left join
    const result = await db
      .select()
      .from(licenseKeys)
      .leftJoin(
        licenseActivations,
        eq(licenseKeys.id, licenseActivations.licenseId)
      )
      .where(eq(licenseKeys.userId, ownerId))

    const row = result[0]

    // If no license found
    if (!row) {
      return {
        ok: true,
        data: {
          isCommunity: true,
          isActive: true,
          isPro: false,
          isUltimate: false,
          inGracePeriod: false,
        },
      }
    }

    const license = row.license_keys
    const activation = row.license_activations

    const now = new Date()
    const lastValidated = license.lastValidatedAt || new Date(0)
    const needsSync =
      now.getTime() - lastValidated.getTime() > 24 * 60 * 60 * 1000

    if (needsSync && activation) {
      const res = await fetch(`${CENTRAL_API_URL}/api/license/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: license.key,
          activationId: activation.activationId,
          expectedUserId: ownerId,
        }),
      })

      if (res.ok) {
        const remoteLicense = await res.json()
        await db
          .update(licenseKeys)
          .set({
            status: remoteLicense.status,
            tier: remoteLicense.tier,
            expiresAt: new Date(remoteLicense.expiresAt),
            lastValidatedAt: new Date(),
          })
          .where(eq(licenseKeys.id, license.id))
      }
    }

    const expiresAt = new Date(license.expiresAt)
    const isExpired = expiresAt < now

    return {
      ok: true,
      data: {
        ...license,
        isCommunity: false,
        isActive: license.status === "active" && !isExpired,
        isPro: license.tier === "PRO",
        isUltimate: license.tier === "ULTIMATE",
      },
    }
  })
}
type GetLicenseReturn = Awaited<ReturnType<typeof getLicense>>
export type UserLicense =
  NonNullable<GetLicenseReturn> extends { data: infer T } ? T : null
