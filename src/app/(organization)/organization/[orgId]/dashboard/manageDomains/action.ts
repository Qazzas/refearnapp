import { handleAction } from "@/lib/handleAction"
import { getOrgAuth } from "@/lib/server/GetOrgAuth"
import { ActionResult, MutationData } from "@/lib/types/response"
import { DomainRow } from "@/lib/types/domainRow"
import { getDomainsAction } from "@/lib/server/getDomainsAction"
import { CreateDomainType } from "@/lib/types/createDomainType"
import { createDomainsAction } from "@/lib/server/createDomainsAction"
export async function getDomains(
  orgId: string,
  offset?: number,
  domain?: string
): Promise<
  ActionResult<{
    rows: DomainRow[]
    hasNext: boolean
  }>
> {
  return handleAction("getDomains", async () => {
    await getOrgAuth(orgId)
    return getDomainsAction(orgId, offset, domain)
  })
}
export async function createDomains({
  orgId,
  domain,
  domainType,
}: CreateDomainType): Promise<MutationData> {
  return handleAction("createDomains", async () => {
    await getOrgAuth(orgId)

    await createDomainsAction({
      orgId,
      domain,
      domainType,
    })
    return { ok: true, toast: "Domain added successfully" }
  })
}
