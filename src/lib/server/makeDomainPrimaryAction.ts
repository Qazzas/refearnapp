"use server"
import { and, eq } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { websiteDomain } from "@/db/schema"
export async function makeDomainPrimaryAction({
  orgId,
  domainId,
}: {
  orgId: string
  domainId: string
}): Promise<void> {
  const domain = await db.query.websiteDomain.findFirst({
    where: and(eq(websiteDomain.id, domainId), eq(websiteDomain.orgId, orgId)),
  })

  if (!domain || !domain.isActive) {
    throw { ok: false, toast: "Domain must be active" }
  }

  await db.transaction(async (tx) => {
    // remove old primary
    await tx
      .update(websiteDomain)
      .set({ isPrimary: false, isRedirect: false })
      .where(eq(websiteDomain.orgId, orgId))

    // set new primary
    await tx
      .update(websiteDomain)
      .set({
        isPrimary: true,
        isActive: true,
        isRedirect: false,
      })
      .where(eq(websiteDomain.id, domainId))
  })
}
