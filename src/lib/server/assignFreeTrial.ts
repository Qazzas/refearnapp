"use server"
import { db } from "@/db/drizzle"
import { subscription } from "@/db/schema"
import { redis } from "@/lib/redis"

export async function assignFreeTrialSubscription(userId: string) {
  if (!userId) return
  const redisKey = `sub:${userId}`
  const exists = await redis.exists(redisKey)
  if (exists) return
  const existingSub = await db.query.subscription.findFirst({
    where: (s, { eq }) => eq(s.userId, userId),
  })

  if (existingSub) {
    if (existingSub.expiresAt) {
      await redis.hset(redisKey, {
        plan: existingSub.plan,
        expiresAt: existingSub.expiresAt.toISOString(),
      })
    }
    return
  }
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  await db.insert(subscription).values({
    userId,
    plan: "FREE",
    billingInterval: "MONTHLY",
    currency: "USD",
    price: "0.00",
    expiresAt,
  })
  await redis.hset(redisKey, {
    plan: "FREE",
    expiresAt: expiresAt.toISOString(),
  })
}
