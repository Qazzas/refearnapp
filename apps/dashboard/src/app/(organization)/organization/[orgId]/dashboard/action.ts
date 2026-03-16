"use server"

import { db } from "@/db/drizzle"
import { licenseKeys } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { CENTRAL_API_URL } from "@/lib/constants/centralDomain"
import { handleAction } from "@/lib/handleAction"
import { getOrgOwnerId } from "@/lib/server/organization/getOrgOwnerId"

export async function activateLicense(orgId: string, key: string) {
  if (process.env.NEXT_PUBLIC_SELF_HOSTED !== "true") {
    return { ok: true, data: "Not self-hosted, skipping sync" }
  }

  // 1. Resolve the ownerId for local database operations
  const ownerId = await getOrgOwnerId(orgId)
  if (!ownerId) {
    return {
      ok: false,
      status: 403,
      error: "Unauthorized: Org owner not found",
    }
  }

  return await handleAction("ActivateLicense", async () => {
    // 2. Local State Retrieval (using ownerId)
    const existingKeys = await db
      .select()
      .from(licenseKeys)
      .where(
        and(eq(licenseKeys.userId, ownerId), eq(licenseKeys.status, "active"))
      )

    // 3. Remote Sync (send orgId to Central API as it's the organization context)
    const response = await fetch(`${CENTRAL_API_URL}/api/licenses/activate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orgId,
        key,
        oldLicenseKey: existingKeys,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Central API activation failed")
    }

    const { data } = await response.json()

    // 4. Local Database Persistence (using ownerId)
    await db.transaction(async (tx) => {
      await tx
        .update(licenseKeys)
        .set({ status: "revoked" })
        .where(eq(licenseKeys.userId, ownerId))

      await tx.insert(licenseKeys).values({
        userId: ownerId, // Correctly using ownerId here
        key: data.licenseKey.key,
        status: "active",
        tier: data.licenseKey.key.startsWith("ULTIMATE") ? "ULTIMATE" : "PRO",
        expiresAt: new Date(data.licenseKey.expiresAt),
      })
    })

    return {
      ok: true,
      toast: "License activated successfully!",
    }
  })
}
