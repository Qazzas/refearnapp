// @/components/pages/Dashboard/Referrals/OrgReferralsTable.tsx
"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { TableView } from "@/components/ui-custom/TableView"
import { useQueryFilter } from "@/hooks/useQueryFilter"
import { useAppQuery } from "@/hooks/useAppQuery"
import { api } from "@/lib/apiClient"
import PaginationControls from "@/components/ui-custom/PaginationControls"
import { useAppTable } from "@/hooks/useAppTable"
import { useVerifyTeamSession } from "@/hooks/useVerifyTeamSession"
import { OrgReferralColumns } from "@/components/pages/Dashboard/Referrals/OrgReferralColumns"

export default function OrgReferralsTable({
  orgId,
  isTeam = false,
}: {
  orgId: string
  isTeam?: boolean
}) {
  // 1. Verify session if it's a team member
  useVerifyTeamSession(orgId, isTeam)

  const { filters, setFilters } = useQueryFilter({})
  const { data, isPending, error } = useAppQuery(
    [isTeam ? "team-referrals" : "org-referrals", orgId, filters.offset],
    (id, query) =>
      isTeam
        ? api.organization.teams.dashboard.referrals([id, query])
        : api.organization.dashboard.referrals([id, query]),
    [orgId, { offset: filters.offset }] as const,
    { enabled: !!orgId }
  )

  // Admin/Team view sees the extra "Affiliate Name" column
  const columns = OrgReferralColumns
  const tableData = data?.rows ?? []
  const hasNext = data?.hasNext ?? false

  const { table } = useAppTable({
    data: tableData,
    columns,
    manualPagination: true,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referrals & Conversions</CardTitle>
        <p className="text-sm text-muted-foreground">
          A complete list of users who signed up and their conversion status.
        </p>
      </CardHeader>
      <CardContent>
        <TableView
          isPending={isPending}
          error={error}
          table={table}
          affiliate={false}
          columns={columns}
          tableEmptyText="No referrals found for this organization."
        />
        <PaginationControls
          offset={filters.offset}
          tableDataLength={tableData.length}
          hasNext={hasNext}
          setFilters={setFilters}
        />
      </CardContent>
    </Card>
  )
}
