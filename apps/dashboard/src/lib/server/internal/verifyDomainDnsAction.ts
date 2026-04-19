import { db } from "@/db/drizzle"
import { websiteDomain } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import {
  getVercelDomainConfig,
  verifyDomainOnVercel,
} from "@/lib/server/internal/manageVercelDomain"
import { AppError } from "@/lib/exceptions"

export async function verifyDomainDnsAction({
  orgId,
  domainId,
}: {
  orgId: string
  domainId: string
}) {
  const isSelfHosted = process.env.NEXT_PUBLIC_SELF_HOSTED === "true"
  let isFullyActive = false
  const [domain] = await db
    .select({
      domainName: websiteDomain.domainName,
    })
    .from(websiteDomain)
    .where(and(eq(websiteDomain.id, domainId), eq(websiteDomain.orgId, orgId)))
    .limit(1)

  if (!domain) {
    throw new AppError({ ok: false, toast: "Domain not found" })
  }

  if (isSelfHosted) {
    isFullyActive = true
  } else {
    const verifyData = (await verifyDomainOnVercel(domain.domainName)) as any
    const configData = (await getVercelDomainConfig(domain.domainName)) as any
    isFullyActive = verifyData.verified && !configData.misconfigured
  }
  await db
    .update(websiteDomain)
    .set({
      isVerified: isFullyActive,
      dnsStatus: isFullyActive ? "Verified" : "Pending",
      isActive: isFullyActive,
      updatedAt: new Date(),
    })
    .where(and(eq(websiteDomain.id, domainId), eq(websiteDomain.orgId, orgId)))

  if (!isFullyActive) {
    throw new AppError({
      ok: false,
      toast: "DNS records not yet detected. This can take up to 48 hours.",
    })
  }
}
