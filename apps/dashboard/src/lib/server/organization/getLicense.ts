import { db } from "@/db/drizzle"
import { licenseKeys } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getOrgOwnerId } from "@/lib/server/organization/getOrgOwnerId"
import { handleAction } from "@/lib/handleAction"
// lib/server/organization/getLicense.ts

export async function getLicense(orgId: string) {
  if (process.env.NEXT_PUBLIC_SELF_HOSTED !== "true") return null

  const ownerId = await getOrgOwnerId(orgId)
  if (!ownerId) return null
  // We wrap the internal logic in your handleAction
  return await handleAction("GetLicenseSync", async () => {
    let license = await db.query.licenseKeys.findFirst({
      where: eq(licenseKeys.userId, ownerId),
    })

    if (!license) {
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

    const now = new Date()
    const lastValidated = license.lastValidatedAt || new Date(0)
    const needsSync =
      now.getTime() - lastValidated.getTime() > 24 * 60 * 60 * 1000

    if (needsSync) {
      const res = await fetch(
        "https://origin.refearnapp.com/api/license/validate",
        {
          method: "POST",
          body: JSON.stringify({ userId: ownerId }),
        }
      )

      // If server responds, update DB.
      // If res.ok is false, the error is handled by the sync logic naturally (we just keep stale data).
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
          .where(eq(licenseKeys.userId, ownerId))

        license = await db.query.licenseKeys.findFirst({
          where: eq(licenseKeys.userId, ownerId),
        })
      }
    }

    // Logic: Calculation remains the same
    const expiresAt = new Date(license!.expiresAt)
    const isExpired = expiresAt < now

    return {
      ok: true,
      data: {
        ...license!,
        isCommunity: false,
        isActive: license!.status === "active" && !isExpired,
        isPro: license!.tier === "PRO",
        isUltimate: license!.tier === "ULTIMATE",
      },
    }
  })
}
type GetLicenseReturn = Awaited<ReturnType<typeof getLicense>>
export type UserLicense =
  NonNullable<GetLicenseReturn> extends { data: infer T } ? T : null
