import { db } from "@/db/drizzle"
import { affiliateLink } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { AppError } from "@/lib/exceptions"
import { redis } from "@/lib/redis"

export async function updateAffiliateLinkService(
  affiliateId: string,
  orgId: string,
  oldId: string,
  newSlug: string
) {
  const cleanSlug = newSlug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")

  if (cleanSlug.length < 4) {
    throw new AppError({
      status: 400,
      error: "Validation Error",
      toast: "Slug must be at least 4 characters.",
    })
  }

  const existing = await db.query.affiliateLink.findFirst({
    where: eq(affiliateLink.id, cleanSlug),
  })

  if (existing && existing.id !== oldId) {
    throw new AppError({
      status: 409,
      error: "Conflict",
      toast: "This link name is already taken.",
    })
  }

  const oldRedisKey = `ref:${oldId}`
  const cachedMetadata = await redis.get(oldRedisKey)

  if (!cachedMetadata) {
    console.warn(`Redis key ${oldRedisKey} not found during update.`)
  }
  const [updated] = await db
    .update(affiliateLink)
    .set({ id: cleanSlug, updatedAt: new Date() })
    .where(
      and(
        eq(affiliateLink.id, oldId),
        eq(affiliateLink.affiliateId, affiliateId),
        eq(affiliateLink.organizationId, orgId)
      )
    )
    .returning()

  if (!updated) {
    throw new AppError({
      status: 404,
      error: "Not Found",
      toast: "Link not found or unauthorized.",
    })
  }
  const newRedisKey = `ref:${cleanSlug}`

  if (cachedMetadata) {
    await Promise.all([
      redis.del(oldRedisKey),
      redis.set(newRedisKey, JSON.stringify(cachedMetadata)),
    ])
  }

  return updated
}
