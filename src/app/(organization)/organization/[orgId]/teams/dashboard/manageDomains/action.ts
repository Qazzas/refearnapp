"use server"
import { handleAction } from "@/lib/handleAction"
import { ActionResult, MutationData } from "@/lib/types/organization/response"
import { DomainRow } from "@/lib/types/organization/domainRow"
import { getDomainsAction } from "@/lib/server/internal/getDomainsAction"
import { getTeamAuthAction } from "@/lib/server/team/getTeamAuthAction"
import { CreateDomainType } from "@/lib/types/internal/createDomainType"
import { createDomainsAction } from "@/lib/server/internal/createDomainsAction"
import { toggleDomainActiveAction } from "@/lib/server/internal/toggleDomainActiveAction"
import { makeDomainPrimaryAction } from "@/lib/server/internal/makeDomainPrimaryAction"
import { toggleDomainRedirectAction } from "@/lib/server/internal/toggleDomainRedirectAction"
import { deleteDomainAction } from "@/lib/server/organization/deleteDomainAction"
import { verifyDomainDnsAction } from "@/lib/server/internal/verifyDomainDnsAction"
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
export async function toggleTeamDomainActive({
  orgId,
  domainId,
  nextActive,
}: {
  orgId: string
  domainId: string
  nextActive: boolean
}): Promise<MutationData> {
  return handleAction("Toggle domain active", async () => {
    await getTeamAuthAction(orgId)
    await toggleDomainActiveAction({
      orgId,
      domainId,
      nextActive,
    })
    return { ok: true, toast: "Domain status updated" }
  })
}
export async function makeTeamDomainPrimary({
  orgId,
  domainId,
}: {
  orgId: string
  domainId: string
}): Promise<MutationData> {
  return handleAction("Make domain primary", async () => {
    await getTeamAuthAction(orgId)
    await makeDomainPrimaryAction({ orgId, domainId })
    return { ok: true, toast: "Primary domain updated" }
  })
}
export async function toggleTeamDomainRedirect({
  orgId,
  domainId,
  nextRedirect,
}: {
  orgId: string
  domainId: string
  nextRedirect: boolean
}): Promise<MutationData> {
  return handleAction("Toggle redirect", async () => {
    await getTeamAuthAction(orgId)
    await toggleDomainRedirectAction({
      orgId,
      domainId,
      nextRedirect,
    })
    return { ok: true, toast: "Redirect updated" }
  })
}
export async function deleteTeamDomain({
  orgId,
  domainId,
}: {
  orgId: string
  domainId: string
}): Promise<MutationData> {
  return handleAction("Delete domain", async () => {
    await getTeamAuthAction(orgId)
    await deleteDomainAction({ orgId, domainId })
    return { ok: true, toast: "Domain deleted" }
  })
}
export async function verifyTeamDomain({
  orgId,
  domainId,
}: {
  orgId: string
  domainId: string
}): Promise<MutationData> {
  return handleAction("verifyDomain", async () => {
    await getTeamAuthAction(orgId)
    await verifyDomainDnsAction({ orgId, domainId })
    return {
      ok: true,
      toast: "✅ A record is correctly set.",
    }
  })
}
