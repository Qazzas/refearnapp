// @/components/pages/Dashboard/Referrals/OrgReferralColumns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { formatCurrency } from "@/util/Formatter"
import { ReferralRow } from "@/lib/types/internal/ReferralRow"

export const OrgReferralColumns: ColumnDef<ReferralRow>[] = [
  {
    accessorKey: "signupEmail",
    header: "User Email",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.signupEmail}</span>
    ),
  },
  {
    accessorKey: "affiliateName",
    header: "Referrer",
    cell: ({ row }) =>
      row.original.affiliateName || (
        <span className="text-muted-foreground italic">Direct</span>
      ),
  },
  {
    accessorKey: "status",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant={row.original.convertedAt ? "default" : "secondary"}>
        {row.original.convertedAt ? "Sale" : "Lead"}
      </Badge>
    ),
  },
  {
    accessorKey: "signedAt",
    header: "Date",
    cell: ({ row }) => format(new Date(row.original.signedAt), "MMM dd, yyyy"),
  },
  {
    accessorKey: "commissionEarned",
    header: "Commission",
    cell: ({ row }) => {
      if (!row.original.convertedAt)
        return <span className="text-muted-foreground">-</span>
      return (
        <span className="font-bold">
          {formatCurrency(
            Number(row.original.commissionEarned),
            row.original.currency
          )}
        </span>
      )
    },
  },
]
