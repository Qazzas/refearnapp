"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationControlsProps {
  offset: number | undefined
  tableDataLength: number
  hasNext: boolean // <-- new prop from backend
  setFilters: (filters: { offset: number }) => void
}

export default function PaginationControls({
  offset,
  tableDataLength,
  hasNext,
  setFilters,
}: PaginationControlsProps) {
  const PAGE_SIZE = 10
  const currentPage = offset ?? 1
  const isNextDisabled = !hasNext

  return (
    <div className="flex flex-col gap-4 py-4 sm:flex-row md:items-center sm:justify-between">
      <div className="text-sm text-muted-foreground text-center md:text-left">
        Showing page {currentPage}{" "}
        {tableDataLength < PAGE_SIZE ? "(Last page)" : ""}
      </div>

      <div className="flex flex-row items-center justify-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilters({ offset: Math.max(1, currentPage - 1) })}
          disabled={!offset || offset <= 1}
          className="gap-1 max-[425px]:px-3"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="max-[425px]:hidden">Previous</span>
        </Button>

        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground ">Page</span>
          <div className="min-w-[32px] h-8 px-2 flex items-center justify-center text-sm font-medium border rounded-md bg-background">
            {currentPage}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilters({ offset: currentPage + 1 })}
          disabled={isNextDisabled}
          className="gap-1 max-[425px]:px-3"
        >
          <span className="max-[425px]:hidden">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
