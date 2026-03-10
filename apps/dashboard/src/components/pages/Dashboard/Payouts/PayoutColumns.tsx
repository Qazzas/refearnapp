"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AffiliatePayout } from "@/lib/types/affiliate/affiliateStats"
import { commonAffiliateColumns } from "@/components/ui-custom/CommonColumns"

export const PayoutColumns = (): ColumnDef<AffiliatePayout>[] => {
  return [
    commonAffiliateColumns.email,
    {
      accessorKey: "paypalEmail",
      header: "PayPal Email",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("paypalEmail") || "-"}</div>
      ),
    },
    commonAffiliateColumns.links,
    commonAffiliateColumns.visitors,
    commonAffiliateColumns.sales,
    commonAffiliateColumns.commission,
    commonAffiliateColumns.paid,
    commonAffiliateColumns.unpaid,
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const unpaid = row.original.unpaid
        const totalCommission = row.original.commission

        let status = "paid"
        let colorClass = "bg-green-100 text-green-800"

        if (unpaid > 0) {
          status = "pending"
          colorClass = "bg-yellow-100 text-yellow-800"
        } else if (totalCommission === 0) {
          status = "no earnings"
          colorClass = "bg-gray-100 text-gray-600"
        }

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${colorClass}`}
          >
            {status}
          </span>
        )
      },
    },
  ]
}
