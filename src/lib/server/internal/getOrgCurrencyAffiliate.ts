import { db } from "@/db/drizzle"
import { eq } from "drizzle-orm"
import { organization } from "@/db/schema"
import { AppError } from "@/lib/exceptions"

export async function getOrgCurrencyAffiliate(orgId: string) {
  const org = await db.query.organization.findFirst({
    where: eq(organization.id, orgId),
    columns: {
      currency: true,
    },
  })
  if (!org) {
    throw new AppError({
      status: 404,
      toast: "Organization not found",
    })
  }
  return org.currency ?? "USD"
}
