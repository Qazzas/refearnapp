/**
 * Build Redis-safe updates from a source object using an allow-list
 * - Filters only allowed keys
 * - Converts Dates → ISO
 * - Converts numbers → strings
 * - Ignores undefined / null
 */
export function buildRedisUpdates(
  source: Record<string, any>,
  allowedFields: Set<string>
): Record<string, string> {
  const redisUpdates: Record<string, string> = {}

  for (const [key, value] of Object.entries(source)) {
    if (!allowedFields.has(key)) continue
    if (value === undefined || value === null) continue

    if (value instanceof Date) {
      redisUpdates[key] = value.toISOString()
    } else if (typeof value === "number") {
      redisUpdates[key] = value.toString()
    } else {
      redisUpdates[key] = String(value)
    }
  }

  return redisUpdates
}
