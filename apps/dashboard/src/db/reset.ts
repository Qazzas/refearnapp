import { db } from "@/db/drizzle"
import { redis } from "@/lib/redis"
import { eq, inArray } from "drizzle-orm"
import {
  organization,
  affiliateLink,
  affiliateInvoice,
  subscriptionExpiration,
  user,
  organizationAuthCustomization,
  organizationDashboardCustomization,
} from "@/db/schema"

async function smartReset() {
  const isProd = process.env.MODE === "prod"
  const TEST_USER_ID = "29022934-eb52-49af-aca4-b6ed553c89dd"

  try {
    if (isProd) {
      console.log("🛡️ PRODUCTION MODE: Selective Cleanup...")

      // 1. Find the Organization ID for this user first
      const orgs = await db
        .select({ id: organization.id })
        .from(organization)
        .where(eq(organization.userId, TEST_USER_ID))

      if (orgs.length === 0) {
        console.log("⚠️ No organization found for this user. Skipping...")
      } else {
        const actualOrgId = orgs[0].id
        console.log(`Found Org ID: ${actualOrgId}. Cleaning up dependencies...`)

        // 2. Delete Customizations using the ACTUAL ID found in DB
        await db
          .delete(organizationAuthCustomization)
          .where(eq(organizationAuthCustomization.id, actualOrgId))
        await db
          .delete(organizationDashboardCustomization)
          .where(eq(organizationDashboardCustomization.id, actualOrgId))

        // 3. Delete Referrals & Promo Codes (They might not have cascade delete)
        // Add any tables here that gave you "Payment Provider" errors earlier

        // 4. Delete the Organization
        await db.delete(organization).where(eq(organization.id, actualOrgId))
      }

      // 5. Delete the User (Cascades to accounts/subs)
      await db.delete(user).where(eq(user.id, TEST_USER_ID))

      console.log("✅ Production selective reset complete")
    } else {
      console.log("🧨 DEVELOPMENT MODE: Full Destructive Reset...")

      // Complete wipe for Dev
      await db.execute(`DROP SCHEMA IF EXISTS drizzle CASCADE`)
      await db.execute(`DROP SCHEMA IF EXISTS public CASCADE`)
      await db.execute(`CREATE SCHEMA public`)

      await redis.flushdb()
      console.log("✅ Full Dev reset complete")
    }
  } catch (error) {
    console.error("❌ Reset failed:", error)
    process.exit(1)
  }
}

smartReset().then(() => process.exit(0))
