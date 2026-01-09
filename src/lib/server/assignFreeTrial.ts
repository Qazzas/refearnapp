"use server"
import { db } from "@/db/drizzle"
import { subscription } from "@/db/schema"
import { redis } from "@/lib/redis"

export async function assignFreeTrialSubscription(userId: string) {
  if (!userId) return
  const redisKey = `sub:${userId}`
  const exists = await redis.exists(redisKey)
  if (exists) return
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 14)
  await db.insert(subscription).values({
    userId,
    plan: "FREE",
    billingInterval: "MONTHLY",
    currency: "USD",
    price: "0.00",
    expiresAt,
  })
}
