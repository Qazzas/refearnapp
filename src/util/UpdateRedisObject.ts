import { redis } from "@/lib/redis"

/**
 * Updates any Redis Hash with type safety.
 * Automatically handles Dates, Nulls, and Objects.
 */
export async function updateRedisObject<T extends Record<string, any>>(
  key: string,
  updates: T
) {
  const processedUpdates: Record<string, string | number> = {}

  for (const [k, v] of Object.entries(updates)) {
    // 1. Handle Nulls (essential for your Cloudflare Worker checks)
    if (v === null) {
      processedUpdates[k] = "null"
    }
    // 2. Handle Dates
    else if (v instanceof Date) {
      processedUpdates[k] = v.toISOString()
    }
    // 3. Handle Objects/Arrays
    else if (typeof v === "object") {
      processedUpdates[k] = JSON.stringify(v)
    }
    // 4. Handle Strings/Numbers
    else {
      processedUpdates[k] = v as string | number
    }
  }

  if (Object.keys(processedUpdates).length > 0) {
    await redis.hset(key, processedUpdates)
  }
}
