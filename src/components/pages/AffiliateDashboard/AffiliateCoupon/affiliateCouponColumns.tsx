"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Info, Copy } from "lucide-react"

export type AffiliateCouponData = {
  id: string
  code: string
  discountValue: string
  discountType: "PERCENTAGE" | "FLAT_FEE"
  commissionValue: string
  commissionType: "PERCENTAGE" | "FLAT_FEE"
  durationValue: string
  durationUnit: string
  isNew: boolean
}

export const affiliateCouponColumns = (
  onDetails: (coupon: AffiliateCouponData) => void
): ColumnDef<AffiliateCouponData>[] => [
  {
    accessorKey: "code",
    header: "Coupon Code",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
          {row.original.code}
        </span>
        {row.original.isNew && (
          <Badge
            variant="destructive"
            className="text-[10px] h-5 px-1.5 animate-pulse"
          >
            NEW
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "discount",
    header: "User Discount",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.discountValue}
        {row.original.discountType === "PERCENTAGE" ? "%" : "$"} OFF
      </span>
    ),
  },
  {
    accessorKey: "commission",
    header: "Your Reward",
    cell: ({ row }) => (
      <Badge
        variant="secondary"
        className="bg-green-100 text-green-700 hover:bg-green-100 border-none"
      >
        {row.original.commissionValue}
        {row.original.commissionType === "PERCENTAGE" ? "%" : "$"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => onDetails(row.original)}
      >
        <Info className="h-4 w-4" />
        Details
      </Button>
    ),
  },
]
