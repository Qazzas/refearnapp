import React from "react"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { OrgIdProps } from "@/lib/types/organization/orgId"
import { Metadata } from "next"
import { buildMetadata } from "@/util/BuildMetadata"
import { getLicense } from "@/lib/server/organization/getLicense"
import { LicenseRequiredState } from "@/components/ui-custom/LicenseRequiredState"

interface AnalyticsLayoutProps {
  children: React.ReactNode
  params: Promise<{ orgId: string }>
  cards: React.ReactNode
  charts: React.ReactNode
  referrers: React.ReactNode
  topAffiliates: React.ReactNode
}
export async function generateMetadata({
  params,
}: OrgIdProps): Promise<Metadata> {
  const orgId = await getValidatedOrgFromParams({ params })

  return buildMetadata({
    title: "RefearnApp | Analytics Page",
    description: "Analytics Page",
    url: `https://refearnapp.com/organization/${orgId}/dashboard/analytics`,
    indexable: false,
  })
}
export default async function AnalyticsLayout({
  children,
  params,
  cards,
  charts,
  referrers,
  topAffiliates,
}: AnalyticsLayoutProps) {
  const orgId = await getValidatedOrgFromParams({ params })
  const licenseResult = await getLicense(orgId)
  if (licenseResult !== null) {
    if (!licenseResult.ok) {
      return (
        <LicenseRequiredState
          featureName="Analytics"
          requiredTier="PRO"
          isExpired={true}
        />
      )
    }

    const license = licenseResult.data
    const hasAccess = license.isActive && (license.isPro || license.isUltimate)

    if (!hasAccess) {
      return (
        <LicenseRequiredState
          featureName="Advanced Analytics"
          requiredTier="PRO"
          isExpired={!license.isActive}
        />
      )
    }
  }
  return (
    <div className="space-y-8">
      {children}
      {cards}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="h-full">{charts}</div>
        <div className="h-full">{referrers}</div>
      </div>
      {topAffiliates}
    </div>
  )
}
