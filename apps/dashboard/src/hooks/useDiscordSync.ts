// hooks/useDiscordSync.ts
"use client"

import { useEffect, useRef } from "react"
import { useAppMutation } from "@/hooks/useAppMutation"
import { syncDiscordAccess } from "@/app/(organization)/organization/[orgId]/dashboard/action"
import { useRouter } from "next/navigation"
import { DISCORD_CONFIG } from "@/lib/constants/discordConfig"

export function useDiscordSync(orgId: string) {
  const router = useRouter()
  const listenerRef = useRef<((event: MessageEvent) => void) | null>(null)

  const mutation = useAppMutation(
    (code: string) => syncDiscordAccess(orgId, code),
    {
      onSuccess: (res) => {
        if (res.ok) router.refresh()
      },
    }
  )

  const handleSync = () => {
    // No more process.env needed for the ID!
    const REDIRECT_URI = encodeURIComponent(
      `${window.location.origin}/api/auth/discord/callback`
    )
    const SCOPES = encodeURIComponent(DISCORD_CONFIG.scopes)

    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CONFIG.clientId}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES}`

    const width = 500,
      height = 750
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    const popup = window.open(
      authUrl,
      "Discord Auth",
      `width=${width},height=${height},left=${left},top=${top}`
    )

    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data?.type === "DISCORD_AUTH_SUCCESS") {
        mutation.mutate(event.data.code)
        window.removeEventListener("message", messageListener)
        listenerRef.current = null
      }
    }

    listenerRef.current = messageListener
    window.addEventListener("message", messageListener)
  }

  useEffect(() => {
    return () => {
      if (listenerRef.current) {
        window.removeEventListener("message", listenerRef.current)
      }
    }
  }, [])

  return {
    sync: handleSync,
    isPending: mutation.isPending,
  }
}
