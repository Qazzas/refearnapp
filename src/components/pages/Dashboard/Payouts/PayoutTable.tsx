"use client"

import * as React from "react"
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  createAffiliatePayouts,
  getAffiliatePayouts,
  getAffiliatePayoutsBulk,
  getExportAffiliatePayouts,
  getExportAffiliatePayoutsBulk,
  getUnpaidMonths,
} from "@/app/(organization)/organization/[orgId]/dashboard/payout/action"
import { useEffect, useState } from "react"
import MonthSelect from "@/components/ui-custom/MonthSelect"
import { UnpaidMonth } from "@/lib/types/unpaidMonth"
import UnpaidSelect from "@/components/ui-custom/UnpaidPicker"
import { TableTop } from "@/components/ui-custom/TableTop"
import { PayoutColumns } from "@/components/pages/Dashboard/Payouts/PayoutColumns"
import { useQueryFilter } from "@/hooks/useQueryFilter"
import PaginationControls from "@/components/ui-custom/PaginationControls"
import { AppDialog } from "@/components/ui-custom/AppDialog"
import CsvUploadPopover from "@/components/ui-custom/CsvUpload"
import { getNormalizedMonths } from "@/util/Months"
import { ExchangeRate } from "@/util/ExchangeRate"
import { useAppQuery } from "@/hooks/useAppQuery"
import { TableView } from "@/components/ui-custom/TableView"
import {
  createTeamAffiliatePayouts,
  getTeamAffiliatePayouts,
  getTeamAffiliatePayoutsBulk,
  getTeamExportAffiliatePayouts,
  getTeamExportAffiliatePayoutsBulk,
  getTeamUnpaidMonths,
} from "@/app/(organization)/organization/[orgId]/teams/dashboard/payout/action"
import { useVerifyTeamSession } from "@/hooks/useVerifyTeamSession"
import { useAppMutation } from "@/hooks/useAppMutation"
import { InsertedRef } from "@/lib/types/insertedRef"
import { ActionResult } from "@/lib/types/response"

interface AffiliatesTablePayoutProps {
  orgId: string
  affiliate: boolean
  isTeam?: boolean
}
export default function PayoutTable({
  orgId,
  affiliate = false,
  isTeam = false,
}: AffiliatesTablePayoutProps) {
  useVerifyTeamSession(orgId, isTeam)
  const [, setMonthYear] = useState<{
    month?: number
    year?: number
  }>({})
  const [unpaidMonths, setUnpaidMonths] = useState<UnpaidMonth[]>([])
  const [selectedMonths, setSelectedMonths] = useState<UnpaidMonth[]>([])
  const [isUnpaidMode, setIsUnpaidMode] = useState(false)
  const { filters, setFilters } = useQueryFilter()
  const [unpaidOpen, setUnpaidOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const fetchPayouts = isTeam ? getTeamAffiliatePayouts : getAffiliatePayouts
  const fetchPayoutsBulk = isTeam
    ? getTeamAffiliatePayoutsBulk
    : getAffiliatePayoutsBulk
  const fetchUnpaidMonths = isTeam ? getTeamUnpaidMonths : getUnpaidMonths
  const createPayouts = isTeam
    ? createTeamAffiliatePayouts
    : createAffiliatePayouts
  const normalizedMonths = getNormalizedMonths(
    isUnpaidMode,
    selectedMonths,
    filters
  )
  const createPayoutMutation = useAppMutation<
    ActionResult<InsertedRef[]>,
    {
      orgId: string
      affiliateIds: string[]
      isUnpaid: boolean
      months: { year: number; month: number }[]
    }
  >(createPayouts, {
    affiliate,
    disableSuccessToast: true,
  })
  const {
    data: unpaidPayouts,
    error: isErrorUnpaid,
    isPending: isPendingUnpaid,
  } = useAppQuery(
    [
      "unpaid-payouts",
      orgId,
      selectedMonths,
      filters.orderBy,
      filters.orderDir,
      filters.offset,
      filters.email,
    ],
    fetchPayoutsBulk,
    [
      "TABLE",
      orgId,
      selectedMonths,
      filters.orderBy,
      filters.orderDir,
      filters.offset,
      filters.email,
    ],
    {
      enabled: !!(
        !affiliate &&
        isUnpaidMode &&
        (selectedMonths.length > 0 ||
          filters.year ||
          filters.month ||
          filters.orderBy ||
          filters.orderDir ||
          filters.offset ||
          filters.email)
      ),
    }
  )
  const exportQuery = isUnpaidMode
    ? useAppQuery(
        [
          "export-payouts-bulk",
          orgId,
          normalizedMonths,
          filters.orderBy,
          filters.orderDir,
          filters.email,
        ],
        isTeam
          ? getTeamExportAffiliatePayoutsBulk
          : getExportAffiliatePayoutsBulk,
        [
          orgId,
          normalizedMonths.map((m) => ({
            year: m.year,
            month: m.month ?? 0,
          })),
          filters.orderBy,
          filters.orderDir,
          filters.email,
        ],
        { enabled: false }
      )
    : useAppQuery(
        [
          "export-payouts",
          orgId,
          filters.year,
          filters.month,
          filters.orderBy,
          filters.orderDir,
          filters.email,
        ],
        isTeam ? getTeamExportAffiliatePayouts : getExportAffiliatePayouts,
        [
          orgId,
          filters.year,
          filters.month,
          filters.orderBy,
          filters.orderDir,
          filters.email,
        ],
        { enabled: false }
      )
  async function generateCSV(tableData: any[]) {
    const header = "PayPal Email,Amount,Currency,Note\n"

    const rows = await Promise.all(
      tableData
        .filter((r) => r.unpaid > 0 && r.paypalEmail)
        .map(async (r) => {
          const rate = await ExchangeRate(r.currency)
          const amountUSD = r.unpaid / rate
          return `${r.paypalEmail},${amountUSD.toFixed(2)},USD,${r.refId ?? ""}`
        })
    )

    return header + rows.join("\n")
  }
  const handleExport = async () => {
    // 1️⃣ Fetch export data (non-paginated, validated)
    const res = await exportQuery.refetch()

    if (!res.data?.data) return

    const exportRows = res.data.data.rows
    exportRows.map((r) => r.id)

    // 2️⃣ Create payouts (refs)
    type MonthFilter = { year: number; month: number }

    let months: MonthFilter[] = []
    if (isUnpaidMode) {
      months = normalizedMonths.map((m) => ({
        year: m.year,
        month: m.month ?? 0,
      }))
    } else if (filters.year) {
      months = [{ year: filters.year, month: filters.month ?? 0 }]
    }

    createPayoutMutation.mutate(
      {
        orgId,
        affiliateIds: exportRows.map((r) => r.id),
        isUnpaid: isUnpaidMode,
        months,
      },
      {
        onSuccess: async (mutationRes) => {
          if (!mutationRes.ok || !mutationRes.data) return

          // 3️⃣ Attach refs
          const refMap = Object.fromEntries(
            mutationRes.data.map((r) => [r.affiliateId, r.refId])
          )

          const enrichedRows = exportRows.map((row) => ({
            ...row,
            refId: refMap[row.id] ?? null,
          }))

          // 4️⃣ Generate & download CSV
          const csv = await generateCSV(enrichedRows)
          downloadCSV(csv)
        },
      }
    )
  }

  const handleMassPayout = () => {
    const isDev = process.env.NODE_ENV === "development"
    const baseUrl = isDev
      ? "https://www.sandbox.paypal.com/mep/payoutsweb"
      : "https://www.paypal.com/mep/payoutsweb"

    window.open(baseUrl, "_blank")
  }
  const {
    data: regularPayouts,
    error: regularError,
    isPending: isPendingRegular,
  } = useAppQuery(
    [
      "regular-payouts",
      orgId,
      filters.year,
      filters.month,
      filters.orderBy,
      filters.orderDir,
      filters.offset,
      filters.email,
    ],
    fetchPayouts,
    [
      "TABLE",
      orgId,
      filters.year,
      filters.month,
      filters.orderBy,
      filters.orderDir,
      filters.offset,
      filters.email,
    ],
    {
      enabled: !!(!affiliate && orgId) && !isUnpaidMode,
    }
  )
  const {
    data: unpaidMonthData,
    error: pendingMonthError,
    isPending: pendingMonth,
  } = useAppQuery(["unpaid-months", orgId], fetchUnpaidMonths, [orgId], {
    enabled: !affiliate && unpaidOpen,
  })
  const applyUnpaidMonths = () => {
    if (selectedMonths.length > 0) {
      setIsUnpaidMode(true)
      setMonthYear({})
    }
  }
  const clearUnpaidMonths = () => {
    setSelectedMonths([])
    setIsUnpaidMode(false)
    setMonthYear({})
  }
  const isPending = isUnpaidMode ? isPendingUnpaid : isPendingRegular
  const isError = isUnpaidMode ? isErrorUnpaid : regularError
  useEffect(() => {
    if (unpaidMonthData) {
      setUnpaidMonths(unpaidMonthData)
    }
  }, [unpaidMonthData])
  const payoutData = isUnpaidMode ? unpaidPayouts : regularPayouts
  const tableData = payoutData?.mode === "TABLE" ? payoutData.rows : []
  const hasNext = payoutData?.mode === "TABLE" ? payoutData.hasNext : false
  const downloadCSV = (csv: string) => {
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url

    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, "0")
    const dd = String(today.getDate()).padStart(2, "0")
    const hh = String(today.getHours()).padStart(2, "0")
    const min = String(today.getMinutes()).padStart(2, "0")
    const ss = String(today.getSeconds()).padStart(2, "0")

    a.download = `paypal_payouts_${yyyy}-${mm}-${dd}_${hh}${min}${ss}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const columns = PayoutColumns()
  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-3xl font-bold">Payments</h1>
            <p className="text-muted-foreground">Manage your payment records</p>
          </div>
        </div>
      </div>
      <AppDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={() => setDialogOpen(false)}
        title="Action not available"
        description="At least one affiliate must have unpaid commission and a PayPal email."
        affiliate={false}
        hideCloseIcon={true}
      />
      {/* Table Card */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 md:justify-between">
          <CardTitle>Payment Records</CardTitle>
          <MonthSelect
            value={{ year: filters.year, month: filters.month }}
            onChange={(year, month) => setFilters({ year, month })}
            disabled={isUnpaidMode && selectedMonths.length > 0}
            affiliate={false}
          />
        </CardHeader>
        <CardContent>
          <TableTop
            filters={{
              orderBy: filters.orderBy,
              orderDir: filters.orderDir,
              email: filters.email,
            }}
            onOrderChange={(orderBy, orderDir) =>
              setFilters({ orderBy, orderDir })
            }
            onEmailChange={(email) => setFilters({ email: email || undefined })}
            affiliate={false}
            table={table}
          />
          <div className="flex flex-col gap-4 mb-4 lg:flex-row lg:justify-between lg:items-center">
            {/* LEFT SIDE → badge + unpaid select */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              {isUnpaidMode && selectedMonths.length > 0 && (
                <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm w-fit">
                  <span>Unpaid Months Selected</span>
                  <button
                    onClick={clearUnpaidMonths}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
              )}

              <UnpaidSelect
                months={unpaidMonths}
                selection={selectedMonths}
                setSelection={setSelectedMonths}
                loading={pendingMonth}
                error={pendingMonthError}
                onApply={applyUnpaidMonths}
                disabled={isUnpaidMode}
                open={unpaidOpen}
                setOpen={setUnpaidOpen}
              />
            </div>

            {/* RIGHT SIDE → Upload + Export + Mass payout */}
            <div className="flex flex-col gap-3 lg:flex-row lg:gap-2 lg:items-center">
              <CsvUploadPopover orgId={orgId} />
              <Button
                variant="outline"
                onClick={handleExport}
                className="w-full sm:w-auto"
                disabled={
                  exportQuery.isPending || createPayoutMutation.isPending
                }
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={handleMassPayout} className="w-full sm:w-auto">
                Mass Payout
              </Button>
            </div>
          </div>
          {isUnpaidMode ? (
            <TableView
              table={table}
              error={pendingMonthError || isError}
              affiliate={affiliate}
              columns={columns}
              isPending={pendingMonth || isPending}
              tableEmptyText=" No Affiliates found."
            />
          ) : (
            <TableView
              isPending={isPending}
              error={isError}
              table={table}
              columns={columns}
              affiliate={affiliate}
              tableEmptyText=" No Affiliates found."
            />
          )}

          <PaginationControls
            offset={filters.offset}
            hasNext={hasNext}
            tableDataLength={tableData.length}
            setFilters={setFilters}
          />
        </CardContent>
      </Card>
    </div>
  )
}
