"use server"

import { and, eq } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { websiteDomain } from "@/db/schema"

export async function deleteDomainAction({
  orgId,
  domainId,
}: {
  orgId: string
  domainId: string
}) {
  const [domain] = await db
    .select({
      id: websiteDomain.id,
      orgId: websiteDomain.orgId,
      type: websiteDomain.type,
      isActive: websiteDomain.isActive,
      isPrimary: websiteDomain.isPrimary,
      isVerified: websiteDomain.isVerified,
    })
    .from(websiteDomain)
    .where(and(eq(websiteDomain.id, domainId), eq(websiteDomain.orgId, orgId)))
    .limit(1)

  if (!domain) {
    throw { ok: false, toast: "Domain not found" }
  }
  if (domain.isPrimary) {
    throw { ok: false, toast: "Primary domain cannot be deleted" }
  }

  await db
    .delete(websiteDomain)
    .where(and(eq(websiteDomain.id, domainId), eq(websiteDomain.orgId, orgId)))
}
