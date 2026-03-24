import { parseArgs } from "util"

// 🚨 TOP-LEVEL LOGS FOR GITHUB ACTIONS DEBUGGING
console.log("--- DEBUGGING ENV VARIABLES ---")
console.log(
  "TARGET_USER_ID:",
  process.env.TARGET_USER_ID ? "✅ Present" : "❌ Missing"
)
console.log(
  "DATABASE_URL:",
  process.env.DATABASE_URL ? "✅ Present" : "❌ Missing"
)
console.log(
  "REDIS_URL:",
  process.env.UPSTASH_REDIS_REST_URL
    ? `✅ Starts with: ${process.env.UPSTASH_REDIS_REST_URL.substring(0, 8)}...`
    : "❌ Missing"
)
console.log(
  "REDIS_TOKEN:",
  process.env.UPSTASH_REDIS_REST_TOKEN ? "✅ Present" : "❌ Missing"
)
console.log("-------------------------------")

async function githubSetUserPlan({
  userId,
  plan,
  type,
}: {
  userId: string
  plan: "FREE" | "PRO" | "ULTIMATE"
  type: "FREE" | "SUBSCRIPTION" | "PURCHASE"
}) {
  try {
    // DYNAMIC IMPORTS to prevent early connection initialization
    const { db } = await import("@/db/drizzle")
    const { subscription, purchase, organization } = await import("@/db/schema")
    const { eq } = await import("drizzle-orm")
    const { syncOrgDataToRedisLinks } =
      await import("@/lib/server/organization/syncOrgDataToRedisLinks")

    const userOrg = await db.query.organization.findFirst({
      where: eq(organization.userId, userId),
    })

    if (!userOrg) {
      throw new Error(`❌ No organization found for user ${userId}.`)
    }

    // 🧹 Clean existing records
    await db.delete(subscription).where(eq(subscription.userId, userId))
    await db.delete(purchase).where(eq(purchase.userId, userId))

    let expiresAt: Date | null = null
    let paymentType: "SUBSCRIPTION" | "ONE-TIME" = "SUBSCRIPTION"

    if (type === "SUBSCRIPTION") {
      expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      paymentType = "SUBSCRIPTION"
      await db.insert(subscription).values({
        userId,
        plan: plan === "ULTIMATE" ? "ULTIMATE" : "PRO",
        billingInterval: "MONTHLY",
        currency: "USD",
        price: plan === "ULTIMATE" ? "4000" : "2500",
        expiresAt,
      })
    } else if (type === "PURCHASE") {
      paymentType = "ONE-TIME"
      await db.insert(purchase).values({
        userId,
        tier: plan as "PRO" | "ULTIMATE",
        price: plan === "PRO" ? "19900" : "29900",
        currency: "USD",
      })
    } else {
      paymentType = "SUBSCRIPTION"
      expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      await db.insert(subscription).values({
        userId,
        plan: "FREE",
        billingInterval: "MONTHLY",
        currency: "USD",
        price: "0",
        expiresAt,
      })
    }

    // 🔥 Sync to Redis
    await syncOrgDataToRedisLinks(userOrg.id, {
      planType: plan as "FREE" | "PRO" | "ULTIMATE",
      paymentType: paymentType,
      expiresAt: expiresAt ? expiresAt.toISOString() : null,
    })

    console.info(`✅ Successfully set ${type} plan "${plan}" for ${userId}`)
  } catch (error) {
    console.error(`❌ Operation Failed:`, error)
    process.exit(1) // Exit with error code
  }
}

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      userId: { type: "string" },
      plan: { type: "string" },
      type: { type: "string" },
    },
    strict: false,
  })

  const userId =
    (values.userId as string) || (process.env.TARGET_USER_ID as string)
  const plan = values.plan as any
  const type = values.type as any

  if (!userId || !plan || !type) {
    console.error("❌ Missing required arguments: --userId, --plan, --type")
    process.exit(1)
  }

  await githubSetUserPlan({ userId, plan, type })

  // ✅ FORCE SHUTDOWN: Closes DB/Redis dangling connections
  console.log("👋 Closing process...")
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
