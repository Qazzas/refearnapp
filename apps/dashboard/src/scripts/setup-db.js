import { $ } from "bun"
import fs from "fs"
import path from "path"

const envPath = path.resolve(".env")

async function run() {
  console.log("\n🗄️ Database Setup & Sync (Self-Hosted Mode)\n")

  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, "")
  }

  let envContent = fs.readFileSync(envPath, "utf8")

  // --- HELPER FUNCTIONS ---

  // 1. Cleans input by removing surrounding quotes and whitespace
  const cleanInput = (val) => {
    if (!val) return ""
    return val.trim().replace(/^["']|["']$/g, "")
  }

  // 2. Extracts existing values
  const getEnvValue = (key) => {
    const match = envContent.match(new RegExp(`^${key}=["']?(.*?)["']?$`, "m"))
    return match ? match[1] : null
  }

  // --- STEP 1: INPUT COLLECTION ---

  // 1a. DATABASE_URL
  let dbUrl = getEnvValue("DATABASE_URL")
  if (!dbUrl) {
    const inputUrl = prompt("👉 Paste your Database Connection String:")
    if (!inputUrl) process.exit(1)
    dbUrl = cleanInput(inputUrl) // ✨ Cleaned
    envContent += `\nDATABASE_URL="${dbUrl}"`
  }

  // 1b. CURRENCY_API_KEY
  let currencyKey = getEnvValue("CURRENCY_API_KEY")
  if (!currencyKey) {
    console.log("\n💰 Currency API Key is required for live exchange rates.")
    const inputKey = prompt("👉 Paste your CURRENCY_API_KEY:")
    if (inputKey) {
      currencyKey = cleanInput(inputKey) // ✨ Cleaned
      envContent += `\nCURRENCY_API_KEY="${currencyKey}"`
    }
  }

  // 1c. UPSTASH_REDIS_URL
  let redisUrl = getEnvValue("UPSTASH_REDIS_REST_URL")
  if (!redisUrl) {
    const inputUrl = prompt("👉 Paste your UPSTASH_REDIS_REST_URL:")
    if (inputUrl) {
      redisUrl = cleanInput(inputUrl) // ✨ Cleaned
      envContent += `\nUPSTASH_REDIS_REST_URL="${redisUrl}"`
    }
  }

  // 1d. UPSTASH_REDIS_TOKEN
  let redisToken = getEnvValue("UPSTASH_REDIS_REST_TOKEN")
  if (!redisToken) {
    const inputToken = prompt("👉 Paste your UPSTASH_REDIS_REST_TOKEN:")
    if (inputToken) {
      redisToken = cleanInput(inputToken) // ✨ Cleaned
      envContent += `\nUPSTASH_REDIS_REST_TOKEN="${redisToken}"`
    }
  }

  // 1e. SELF_HOSTED FLAG
  if (!envContent.includes("NEXT_PUBLIC_SELF_HOSTED")) {
    envContent += `\nNEXT_PUBLIC_SELF_HOSTED="true"`
  }

  // --- STEP 2: SAVE & EXECUTE ---

  fs.writeFileSync(envPath, envContent.trim() + "\n")
  console.log("✅ .env updated and inputs cleaned.")

  // Proceeding with Migrations...
  console.log("\n🔄 Syncing database...")
  try {
    // We use generate to ensure the local user has the SQL files
    // that match the specific schema code they just downloaded.
    await $`npx drizzle-kit generate`.throws(true)
    await $`npx drizzle-kit migrate`.throws(true)
    console.log("✅ Database schema is synced.")
  } catch (err) {
    console.error("❌ Migration failed. Check your Database URL permissions.")
    process.exit(1)
  }
  // --- STEP 3: SEEDING ---
  console.log("\n🌱 Running system initialization...")
  try {
    await $`bun src/scripts/seedSystem.ts`
    console.log("✅ System version initialized.")
  } catch (err) {
    console.warn("⚠️ System seeding failed.")
  }

  console.log("\n🌱 Running currency seed script...")
  try {
    // This will now have access to the CURRENCY_API_KEY we just saved
    await $`bun src/db/currencySeed.ts`
    console.log("✅ Seeding complete.")
  } catch (err) {
    console.warn("⚠️  Currency seeding failed. Ensure your API key is valid.")
    console.error(err.message)
  }

  console.log("\n✨ ALL DONE! Your database and currency rates are ready.\n")
}

run()
