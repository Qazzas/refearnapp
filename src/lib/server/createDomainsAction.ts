import { mapDomainType } from "@/util/MapDomainType"
import { db } from "@/db/drizzle"
import { websiteDomain } from "@/db/schema"
import { CreateDomainType } from "@/lib/types/createDomainType"

export async function createDomainsAction({
  orgId,
  domain,
  domainType,
}: CreateDomainType): Promise<void> {
  const normalized = domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")

  const mapped = mapDomainType(domainType)

  await db.insert(websiteDomain).values({
    orgId,
    domainName: mapped.finalDomain(normalized),
    type: mapped.type,
    dnsStatus: mapped.dnsStatus,
    isVerified: mapped.isVerified,
    isActive: true,
    isPrimary: false,
    isRedirect: false,
  })
}
