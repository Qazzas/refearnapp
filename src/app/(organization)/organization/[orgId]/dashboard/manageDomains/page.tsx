import React from "react"
import { OrgIdProps } from "@/lib/types/organization/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { requireOrganizationWithOrg } from "@/lib/server/auth/authGuards"
import { Metadata } from "next"
import { buildMetadata } from "@/util/BuildMetadata"
import { ManageDomainsTable } from "@/components/pages/Dashboard/manageDomains/manageDomainsTable"
export async function generateMetadata({
  params,
}: OrgIdProps): Promise<Metadata> {
  const orgId = await getValidatedOrgFromParams({ params })

  return buildMetadata({
    title: "RefearnApp | Manage Domains Page",
    description: "Manage Domains Page",
    url: `https://refearnapp.com/organization/${orgId}/dashboard/manageDomains`,
    indexable: false,
  })
}
const manageDomainsPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireOrganizationWithOrg(orgId)
  return (
    <>
      <ManageDomainsTable affiliate={false} orgId={orgId} />
    </>
  )
}
export default manageDomainsPage
