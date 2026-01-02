import { redis } from "@/lib/redis"

/**
 * Updates a Redis Hash.
 * Dates are converted to ISO strings, but the object is saved field-by-field.
 */
export async function updateRedisObject(
  key: string,
  updates: Record<string, any>
) {
  // 1️⃣ Prepare the updates
  // We still need to make sure Dates are strings because Redis fields are strings.
  const processedUpdates: Record<string, string | number> = {}

  for (const [k, v] of Object.entries(updates)) {
    if (v instanceof Date) {
      processedUpdates[k] = v.toISOString()
    } else if (typeof v === "object" && v !== null) {
      // If it's a nested object, we still need to stringify that specific field
      processedUpdates[k] = JSON.stringify(v)
    } else {
      processedUpdates[k] = v
    }
  }

  // 2️⃣ Save to Redis using HSET
  // This will add new fields or update existing ones without touching other data!
  await redis.hset(key, processedUpdates)
}
