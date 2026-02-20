"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AffiliateStats } from "@/lib/types/affiliate/affiliateStats"
import { commonAffiliateColumns } from "@/components/ui-custom/CommonColumns"

export const AffiliatesColumns = (): ColumnDef<AffiliateStats>[] => {
  return [
    commonAffiliateColumns.email,
    commonAffiliateColumns.links,
    commonAffiliateColumns.visitors,
    commonAffiliateColumns.sales,
    {
      accessorKey: "signups",
      header: "Signups",
      cell: ({ row }) => <div>{row.original.signups ?? 0}</div>,
    },
    {
      accessorKey: "clickToSignupRate",
      header: "C2S Rate",
      cell: ({ row }) => {
        const rate = parseFloat(row.getValue("clickToSignupRate"))
        return <div>{isNaN(rate) ? "0.00%" : `${rate.toFixed(2)}%`}</div>
      },
    },
    {
      accessorKey: "signupToPaidRate",
      header: "S2P Rate",
      cell: ({ row }) => {
        const rate = parseFloat(row.getValue("signupToPaidRate"))
        return <div>{isNaN(rate) ? "0.00%" : `${rate.toFixed(2)}%`}</div>
      },
    },
    commonAffiliateColumns.commission,
    commonAffiliateColumns.paid,
    commonAffiliateColumns.unpaid,
  ]
}
