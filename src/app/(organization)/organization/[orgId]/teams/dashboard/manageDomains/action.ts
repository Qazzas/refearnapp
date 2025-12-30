"use server"
import { handleAction } from "@/lib/handleAction"
import { ActionResult, MutationData } from "@/lib/types/response"
import { DomainRow } from "@/lib/types/domainRow"
import { getDomainsAction } from "@/lib/server/getDomainsAction"
import { getTeamAuthAction } from "@/lib/server/getTeamAuthAction"
import { CreateDomainType } from "@/lib/types/createDomainType"
import { createDomainsAction } from "@/lib/server/createDomainsAction"
export async function getTeamDomains(
  orgId: string,
  offset?: number,
  domain?: string
): Promise<
  ActionResult<{
    rows: DomainRow[]
    hasNext: boolean
  }>
> {
  return handleAction("getTeamDomains", async () => {
    await getTeamAuthAction(orgId)
    return getDomainsAction(orgId, offset, domain)
  })
}
export async function createTeamDomains({
  orgId,
  domain,
  domainType,
}: CreateDomainType): Promise<MutationData> {
  return handleAction("createDomains", async () => {
    await getTeamAuthAction(orgId)

    await createDomainsAction({
      orgId,
      domain,
      domainType,
    })
    return { ok: true, toast: "Domain added successfully" }
  })
}
