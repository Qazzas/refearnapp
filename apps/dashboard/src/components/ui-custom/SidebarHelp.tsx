// components/ui-custom/SidebarHelp.tsx
"use client"

import React from "react"
import { MailQuestion } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

interface SidebarHelpProps {
  showLabel?: boolean
}

export const SidebarHelp = ({ showLabel = true }: SidebarHelpProps) => {
  const DOCS_URL = "https://refearnapp.com/docs"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip="Documentation & Help"
          className="h-auto py-2 hover:bg-muted/50 transition-colors group"
        >
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center w-full gap-1"
          >
            <MailQuestion className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
            {showLabel && (
              <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-tighter opacity-60 group-hover:opacity-100">
                Help & Docs
              </span>
            )}
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
