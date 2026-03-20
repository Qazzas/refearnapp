import { db } from "@/db/drizzle"
import { systemSettings } from "@/db/schema"
import { APP_VERSION } from "@/lib/constants/version"

async function syncSystemVersion() {
  console.log(`🌱 Syncing database version marker to: ${APP_VERSION}...`)

  await db
    .insert(systemSettings)
    .values({
      id: 1,
      installedVersion: APP_VERSION,
      lastUpdated: new Date(),
    })
    .onConflictDoUpdate({
      target: systemSettings.id,
      set: {
        installedVersion: APP_VERSION,
        lastUpdated: new Date(),
      },
    })
}

try {
  await syncSystemVersion()
  console.log("✅ System version synchronized successfully")
  process.exit(0)
} catch (err) {
  console.error("❌ Error syncing system version:", err)
  process.exit(1)
}
