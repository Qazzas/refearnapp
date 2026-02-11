// lib/server/getActiveDomain.ts
"use server"

import { db } from "@/db/drizzle"
import { websiteDomain } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { AppError } from "@/lib/exceptions"

export async function getActiveDomain(orgId: string) {
  const domain = await db.query.websiteDomain.findFirst({
    where: and(
      eq(websiteDomain.orgId, orgId),
      eq(websiteDomain.isActive, true),
      eq(websiteDomain.isPrimary, true)
    ),
  })

  if (!domain)
    throw new AppError({ status: 404, error: "Active domain not found" })
  return domain
}
