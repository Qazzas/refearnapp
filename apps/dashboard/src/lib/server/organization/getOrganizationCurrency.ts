import { db } from "@/db/drizzle"
import { organization } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getOrganizationCurrency(orgId: string): Promise<string> {
  const org = await db.query.organization.findFirst({
    where: eq(organization.id, orgId),
    columns: {
      currency: true,
    },
  })

  return org?.currency ?? "USD"
}
