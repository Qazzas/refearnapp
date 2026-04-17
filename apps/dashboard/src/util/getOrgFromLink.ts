import { db } from "@/db/drizzle"
import { affiliateLink } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getLink(linkId: string | null | undefined) {
  if (!linkId) return null
  return db.query.affiliateLink.findFirst({
    where: eq(affiliateLink.id, linkId),
  })
}
