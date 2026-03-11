// lib/server/organization/getOrgOwnerId.ts
import { db } from "@/db/drizzle"
import { organization } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getOrgOwnerId(orgId: string) {
  const org = await db.query.organization.findFirst({
    where: eq(organization.id, orgId),
    columns: { userId: true }, // This is the owner's ID
  })
  return org?.userId || null
}
