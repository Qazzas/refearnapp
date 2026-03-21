// components/ui-custom/Sidebar/SidebarDiscord.tsx
"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { DiscordIcon } from "@/components/ui-custom/DiscordIcon"
import { cn } from "@/lib/utils"
import { useDiscordSync } from "@/hooks/useDiscordSync"

interface SidebarDiscordProps {
  orgId: string
  isPremium: boolean
  isUltimate: boolean
}

export const SidebarDiscord = ({
  orgId,
  isPremium,
  isUltimate,
}: SidebarDiscordProps) => {
  const { sync, isPending } = useDiscordSync(orgId)

  const discordLabel = isUltimate
    ? "Join Ultimate VIP"
    : isPremium
      ? "Join Pro Discord"
      : "Join Community Discord"

  const handleAction = () => {
    if (isPremium) {
      sync()
    } else {
      window.open("https://discord.gg/fHw9j7P3w9", "_blank")
    }
  }

  return (
    <Button
      onClick={handleAction}
      disabled={isPending}
      variant="outline"
      className={cn(
        "w-full justify-start h-10 gap-3 border-dashed transition-all px-3",
        isUltimate
          ? "border-amber-500/50 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10"
          : isPremium
            ? "border-indigo-500/30 bg-indigo-600/5 text-indigo-500 hover:bg-indigo-600/10"
            : "border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100"
      )}
    >
      {isPending ? (
        <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        <DiscordIcon className="w-4 h-4 shrink-0" />
      )}
      <div className="flex flex-col items-start overflow-hidden leading-tight">
        <span className="text-[9px] font-bold uppercase tracking-tighter opacity-60">
          Discord
        </span>
        <span className="text-[11px] font-semibold truncate">
          {isPending ? "Syncing..." : discordLabel}
        </span>
      </div>
    </Button>
  )
}
