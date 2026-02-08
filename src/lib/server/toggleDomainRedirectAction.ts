"use server"
import { and, eq } from "drizzle-orm"
import { websiteDomain } from "@/db/schema"
import { db } from "@/db/drizzle"
import { AppError } from "@/lib/exceptions"
export async function toggleDomainRedirectAction({
  orgId,
  domainId,
  nextRedirect,
}: {
  orgId: string
  domainId: string
  nextRedirect: boolean
}): Promise<void> {
  const domain = await db.query.websiteDomain.findFirst({
    where: and(eq(websiteDomain.id, domainId), eq(websiteDomain.orgId, orgId)),
  })
  if (!domain?.isActive || domain.isPrimary) {
    throw new AppError({ ok: false, toast: "Invalid redirect target" })
  }
  await db
    .update(websiteDomain)
    .set({ isRedirect: nextRedirect })
    .where(eq(websiteDomain.id, domainId))
}
