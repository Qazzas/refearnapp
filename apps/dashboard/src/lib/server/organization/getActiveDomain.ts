import { db } from "@/db/drizzle"
import { websiteDomain } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export async function getActiveDomain(orgId: string) {
  const domain = await db.query.websiteDomain.findFirst({
    where: and(
      eq(websiteDomain.orgId, orgId),
      eq(websiteDomain.isActive, true),
      eq(websiteDomain.isPrimary, true)
    ),
  })
  return domain || null
}
