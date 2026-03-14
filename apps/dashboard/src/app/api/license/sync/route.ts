// app/api/license/sync/route.ts
import { NextRequest, NextResponse } from "next/server"
import { handleRoute } from "@/lib/handleRoute"
import { db } from "@/db/drizzle"
import { licenseKeys } from "@/db/schema"
import { lt, eq } from "drizzle-orm"

async function syncLicenseHandler(req: NextRequest) {
  // 1. Verify Secret
  if (req.headers.get("x-internal-secret") !== process.env.INTERNAL_SECRET) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // 2. Get keys stale for more than 24h
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const staleKeys = await db
    .select()
    .from(licenseKeys)
    .where(lt(licenseKeys.lastValidatedAt, oneDayAgo))

  // 3. Loop and Validate
  let updatedCount = 0
  let errorCount = 0
  for (const item of staleKeys) {
    try {
      // Logic: Validate with Polar API here
      const polarStatus = "active"
      const newStatus = polarStatus === "active" ? "active" : "revoked"

      await db
        .update(licenseKeys)
        .set({ status: newStatus, lastValidatedAt: new Date() })
        .where(eq(licenseKeys.id, item.id))

      updatedCount++
    } catch (e) {
      errorCount++
      console.error(`Failed to sync license ${item.key}:`, e)
      // We continue the loop so one bad key doesn't stop the whole sync
    }
  }
  // Optional: Log if some failed but some succeeded
  if (errorCount > 0) {
    console.warn(
      `⚠️ Sync finished with ${errorCount} errors and ${updatedCount} successes.`
    )
  }
  return NextResponse.json({ synced: updatedCount })
}

// Wrap it!
export const POST = handleRoute("license-sync", syncLicenseHandler)
