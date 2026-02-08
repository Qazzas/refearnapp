import { db } from "@/db/drizzle"
import { AppError } from "@/lib/exceptions"
export const getOrganization = async (orgId: string) => {
  const org = await db.query.organization.findFirst({
    where: (o, { eq }) => eq(o.id, orgId),
  })
  if (!org) {
    throw new AppError({
      status: 500,
      error: "failed to organization data",
      toast: "failed to fetch organization data",
    })
  }
  return org
}
