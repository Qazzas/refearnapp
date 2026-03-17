"use server"

import { db } from "@/db/drizzle"
import { licenseActivations, licenseKeys } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { CENTRAL_API_URL } from "@/lib/constants/centralDomain"
import { handleAction } from "@/lib/handleAction"
import { getOrgOwnerId } from "@/lib/server/organization/getOrgOwnerId"
import { AppError } from "@/lib/exceptions"

export async function activateLicense(orgId: string, key: string) {
  return await handleAction("ActivateLicense", async () => {
    if (process.env.NEXT_PUBLIC_SELF_HOSTED !== "true") {
      return { ok: true, data: "Not self-hosted, skipping sync" }
    }

    // 1. Resolve ownerId
    const ownerId = await getOrgOwnerId(orgId)
    if (!ownerId) {
      throw new AppError({
        status: 403,
        error: "UNAUTHORIZED",
        toast: "Organization owner not found.",
      })
    }

    // 2. Get existing active keys to send to Central API for revocation
    const existingKeys = await db
      .select()
      .from(licenseKeys)
      .where(
        and(eq(licenseKeys.userId, ownerId), eq(licenseKeys.status, "active"))
      )

    // 3. Remote Sync with Central API
    const response = await fetch(`${CENTRAL_API_URL}/api/license/activate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerId,
        key,
        oldLicenseKey: existingKeys,
      }),
    })

    if (!response.ok) {
      throw new AppError({
        status: 500,
        error: "ACTIVATION_FAILED",
        toast: "Central API activation failed",
      })
    }

    const { data } = await response.json()
    console.log("Activation response from Central API:", data)
    await db.transaction(async (tx) => {
      await tx
        .update(licenseKeys)
        .set({ status: "revoked" })
        .where(eq(licenseKeys.userId, ownerId))

      const [insertedLicense] = await tx
        .insert(licenseKeys)
        .values({
          licenseId: data.licenseKey.id,
          userId: ownerId,
          key: data.licenseKey.key,
          status: "active",
          tier: data.licenseKey.key.startsWith("ULTIMATE") ? "ULTIMATE" : "PRO",
          expiresAt: new Date(data.licenseKey.expiresAt),
          lastValidatedAt: new Date(0),
        })
        .returning({ id: licenseKeys.id })

      await tx.insert(licenseActivations).values({
        licenseId: insertedLicense.id,
        activationId: data.id,
      })
    })

    return {
      ok: true,
      toast: "License activated successfully!",
    }
  })
}
export async function deactivateLicense(orgId: string, activationId: string) {
  return await handleAction("DeactivateLicense", async () => {
    const ownerId = await getOrgOwnerId(orgId)
    if (!ownerId) {
      throw new AppError({
        status: 403,
        error: "UNAUTHORIZED",
        toast: "Organization owner not found.",
      })
    }
    const license = await db.query.licenseKeys.findFirst({
      where: and(
        eq(licenseKeys.userId, ownerId),
        eq(licenseKeys.status, "active")
      ),
    })

    if (!license) {
      throw new AppError({
        status: 404,
        error: "NOT_FOUND",
        toast: "No active license found to deactivate.",
      })
    }
    const res = await fetch(`${CENTRAL_API_URL}/api/license/deactivate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activationId,
        key: license.key, // The actual license key string (e.g., "PRO-XXXX")
      }),
    })

    if (!res.ok) {
      throw new AppError({
        status: res.status || 500,
        error: "DEACTIVATION_FAILED",
        toast: "Remote deactivation failed. Please try again.",
      })
    }

    // 3. Clean up local database
    await db.transaction(async (tx) => {
      await tx
        .delete(licenseActivations)
        .where(eq(licenseActivations.activationId, activationId))
      await tx
        .update(licenseKeys)
        .set({ lastValidatedAt: new Date(0) })
        .where(eq(licenseKeys.id, license.id))
    })

    return { ok: true, toast: "Device deactivated successfully" }
  })
}
