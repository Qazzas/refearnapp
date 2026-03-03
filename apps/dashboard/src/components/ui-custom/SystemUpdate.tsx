// components/ui-custom/SystemUpdate.tsx
import React from "react"
import Link from "next/link"
import { APP_VERSION } from "@/lib/constants/version"

interface SystemUpdateProps {
  variant: "banner" | "badge"
  updateInfo?: { isNewer: boolean; latestVersion: string; url: string } | null
}

export const SystemUpdate = ({ variant, updateInfo }: SystemUpdateProps) => {
  const isNewer = updateInfo?.isNewer
  const latestUrl = updateInfo?.url || "#"

  // 1. Sidebar Badge Variant
  if (variant === "badge") {
    return (
      <Link
        href={latestUrl}
        target={isNewer ? "_blank" : "_self"}
        className="flex flex-col items-center justify-center py-2 px-1 rounded-md hover:bg-muted/50 transition-colors group"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-muted-foreground tracking-tighter uppercase opacity-60">
            v{APP_VERSION}
          </span>
          {isNewer && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          )}
        </div>
        <span className="hidden group-data-[collapsible=icon]:hidden md:block text-[9px] text-muted-foreground mt-1 whitespace-nowrap">
          {isNewer ? "New Version Available" : "System Up to date"}
        </span>
      </Link>
    )
  }

  // 2. Main Content Banner Variant
  if (variant === "banner" && isNewer) {
    return (
      <div className="mb-6 flex items-center justify-between gap-4 p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-900/30 animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
            <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
              Update Available: v{updateInfo.latestVersion}
            </p>
            <p className="text-xs text-indigo-700 dark:text-indigo-300">
              A new version is ready. Click to see what's new.
            </p>
          </div>
        </div>
        <Link
          href={latestUrl}
          target="_blank"
          className="whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-sm"
        >
          View Changelog
        </Link>
      </div>
    )
  }

  return null
}
