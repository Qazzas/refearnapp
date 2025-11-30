import React from "react"
import ForgotPassword from "@/components/pages/Forgot-password"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { redirectIfAffiliateAuthed } from "@/lib/server/authGuards"
import { Metadata } from "next"
import { getOrganization } from "@/lib/server/getOrganization"
import { getOrgBaseUrl } from "@/lib/server/getOrgBaseUrl"
import { buildMetadata } from "@/util/BuildMetadata"
export async function generateMetadata({
  params,
}: {
  params: { orgId: string }
}): Promise<Metadata> {
  const org = await getOrganization(params.orgId)
  const orgBaseUrl = await getOrgBaseUrl(org.id)
  return buildMetadata({
    title: `${org.name} | Forgot Password Page`,
    description: org.description ?? `Forgot Password Page for ${org.name}`,
    url: `${orgBaseUrl}/forgot-password`,
    indexable: false,
  })
}
const forgetPasswordPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await redirectIfAffiliateAuthed(orgId)
  return (
    <>
      <ForgotPassword orgId={orgId} affiliate />
    </>
  )
}
export default forgetPasswordPage
