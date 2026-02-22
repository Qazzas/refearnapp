import { and, eq } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { websiteDomain } from "@/db/schema"
import { deleteDomainFromVercel } from "@/lib/server/internal/manageVercelDomain"
import { AppError } from "@/lib/exceptions"
import {
  deleteDomainFromCloudflare,
  getCloudflareDomainStatus,
} from "@/lib/server/internal/manageCloudflareDomains"

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
      domainName: websiteDomain.domainName,
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
    throw new AppError({ ok: false, toast: "Domain not found" })
  }

  if (domain.isPrimary) {
    throw new AppError({ ok: false, toast: "Primary domain cannot be deleted" })
  }
  // Inside deleteDomainAction...
  if (domain.type !== "DEFAULT") {
    if (process.env.IS_SELF_HOSTED === "true") {
      const cfData = await getCloudflareDomainStatus(domain.domainName)
      await deleteDomainFromCloudflare(cfData.id)
    } else {
      await deleteDomainFromVercel(domain.domainName)
    }
  }
  await db
    .delete(websiteDomain)
    .where(and(eq(websiteDomain.id, domainId), eq(websiteDomain.orgId, orgId)))
}
