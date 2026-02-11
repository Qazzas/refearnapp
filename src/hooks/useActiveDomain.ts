"use client"

import { useAppQuery } from "@/hooks/useAppQuery"
import { api } from "@/lib/apiClient"

export function useActiveDomain(orgId: string) {
  const { data, isPending, error } = useAppQuery(
    ["activeDomain", orgId],
    // fetchFn: We pass the apiClient, but bound to its specific key
    (id: string) => api.organization.domain.active([id]),
    // fetchArgs: The arguments passed to the fetchFn
    [orgId],
    { enabled: !!orgId }
  )

  return {
    // 'data' is now properly inferred as WebsiteDomain | null
    domainName: data?.domainName,
    isLoading: isPending,
    errorMsg: error, // This is the toast/error message from your useAppQuery logic
  }
}
