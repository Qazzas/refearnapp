"use server"
import { and, eq } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { websiteDomain } from "@/db/schema"
export async function toggleDomainActiveAction({
  orgId,
  domainId,
  nextActive,
}: {
  orgId: string
  domainId: string
  nextActive: boolean
}): Promise<void> {
  const domain = await db.query.websiteDomain.findFirst({
    where: and(eq(websiteDomain.id, domainId), eq(websiteDomain.orgId, orgId)),
  })

  if (!domain) {
    throw { ok: false, toast: "Domain not found" }
  }

  if (domain.isPrimary && !nextActive) {
    throw { ok: false, toast: "Primary domain cannot be deactivated" }
  }

  await db
    .update(websiteDomain)
    .set({
      isActive: nextActive,
      isRedirect: nextActive ? domain.isRedirect : false,
      updatedAt: new Date(),
    })
    .where(eq(websiteDomain.id, domainId))
}
