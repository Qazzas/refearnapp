import { db } from "@/db/drizzle"
import { subscription, purchase, organization } from "@/db/schema"
import { eq } from "drizzle-orm"
import { syncOrgDataToRedisLinks } from "@/lib/server/organization/syncOrgDataToRedisLinks"
import { parseArgs } from "util"

// This script is specifically for GitHub Actions
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
    const userOrg = await db.query.organization.findFirst({
      where: eq(organization.userId, userId),
    })

    if (!userOrg) {
      throw new Error(`❌ No organization found for user ${userId}.`)
    }

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

    await syncOrgDataToRedisLinks(userOrg.id, {
      planType: plan as "FREE" | "PRO" | "ULTIMATE",
      paymentType: paymentType,
      expiresAt: expiresAt ? expiresAt.toISOString() : null,
    })

    console.info(`✅ Successfully set ${type} plan "${plan}" for ${userId}`)
  } catch (error) {
    console.error(`❌ Sync Failed:`, error)
    process.exit(1)
  }
}

async function main() {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    process.env.UPSTASH_REDIS_REST_URL === ""
  ) {
    console.error(
      "❌ ERROR: UPSTASH_REDIS_REST_URL is missing in the environment."
    )
    process.exit(1)
  }
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      userId: { type: "string" },
      plan: { type: "string" },
      type: { type: "string" },
    },
    strict: false,
  })

  // Add type assertions (as string) to satisfy the compiler
  const userId =
    (values.userId as string) || (process.env.TARGET_USER_ID as string)
  const plan = values.plan as "FREE" | "PRO" | "ULTIMATE"
  const type = values.type as "FREE" | "SUBSCRIPTION" | "PURCHASE"

  // Check that they aren't undefined or empty before calling the function
  if (!userId || !plan || !type) {
    console.error("❌ Missing required arguments: --userId, --plan, --type")
    process.exit(1)
  }

  await githubSetUserPlan({ userId, plan, type })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
