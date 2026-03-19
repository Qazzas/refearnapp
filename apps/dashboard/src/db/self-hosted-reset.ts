import { db } from "@/db/drizzle"
import { redis } from "@/lib/redis"
import * as dotenv from "dotenv"

// Load environment variables to ensure we have DB/Redis credentials
dotenv.config({ path: ".env" })

async function selfHostedReset() {
  console.log("\n☢️  CRITICAL: SELF-HOSTED FACTORY RESET ☢️")
  console.log("This will delete the entire database schema and all data.\n")

  // --- STEP 1: THE SAFETY PROMPT ---
  // Using Bun's prompt for a blocking CLI experience
  const confirmation = prompt(
    "👉 Type 'RESET' to permanently wipe your database and cache:"
  )

  if (confirmation !== "RESET") {
    console.log("❌ Reset cancelled. Your data is safe.")
    process.exit(0)
  }

  try {
    console.log("\n🧨 Initializing destructive wipe...")

    // --- STEP 2: DROP SCHEMA (Your preferred logic) ---
    // This removes all tables, types, and constraints to prevent "orphans"
    await db.execute(`DROP SCHEMA IF EXISTS drizzle CASCADE`)
    await db.execute(`DROP SCHEMA IF EXISTS public CASCADE`)
    await db.execute(`CREATE SCHEMA public`)
    console.log("✅ Database schemas wiped and recreated.")

    // --- STEP 3: FLUSH REDIS ---
    if (process.env.UPSTASH_REDIS_REST_URL) {
      console.log("📡 Flushing Upstash Redis cache...")
      await redis.flushdb()
      console.log("✅ Redis cache cleared.")
    }

    console.log("\n✨ FACTORY RESET COMPLETE.")
    console.log("Your instance is now empty.")
    console.log(
      "👉 IMPORTANT: You must run 'pnpm db:setup' now to rebuild your tables.\n"
    )
  } catch (error) {
    console.error("\n❌ Reset failed:", error)
    process.exit(1)
  }
}

selfHostedReset().then(() => process.exit(0))
