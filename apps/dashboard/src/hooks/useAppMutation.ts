// hooks/useAppMutation.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast"
import { useRouter } from "next/navigation"

/**
 * The universal response structure returned by your server actions.
 */
export interface AppResponse {
  ok: boolean
  status?: number
  message?: string // success message from backend
  toast?: string // error or success description from backend
  redirectUrl?: string
  data?: any
}

/**
 * 🔁 Global reusable mutation hook (App-wide)
 * - Handles success/error toasts
 * - Handles redirects
 * - Handles application-level error fallback
 * - Keeps code DRY and consistent
 */
export function useAppMutation<TData extends AppResponse, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<
    UseMutationOptions<TData, unknown, TVariables>,
    "mutationFn" | "onSuccess" | "onError"
  > & {
    disableSuccessToast?: boolean
    disableErrorToast?: boolean
    affiliate?: boolean
    redirectUrl?: string
    enableRedirect?: boolean
    onSuccess?: (data: TData, variables: TVariables, context: unknown) => void
  }
) {
  const { showCustomToast } = useCustomToast()
  const router = useRouter()

  return useMutation<TData, unknown, TVariables>({
    mutationFn,
    ...options,

    onSuccess: (res, variables, context) => {
      if (res.ok) {
        // ✅ Success Toast
        if (!options?.disableSuccessToast) {
          showCustomToast({
            type: "success",
            title: "Success",
            description: res.toast || "Action completed successfully.",
            affiliate: options?.affiliate ?? false,
          })
        }

        // 🔁 Handle redirect
        if (res.redirectUrl && (options?.enableRedirect ?? true)) {
          router.push(res.redirectUrl)
        } else if (options?.redirectUrl && (options?.enableRedirect ?? true)) {
          router.push(options.redirectUrl)
        }
      } else {
        // ❌ Error Toast (Backend error)
        if (!options?.disableErrorToast) {
          showCustomToast({
            type: "error",
            title: "Failed",
            description: res.toast || "Something went wrong.",
            affiliate: options?.affiliate ?? false,
          })
        }
      }

      // 🔧 Allow custom onSuccess callback
      options?.onSuccess?.(res, variables, context)
    },

    onError: () => {
      // 💥 Application-level unexpected error handler (network, runtime, etc.)
      showCustomToast({
        type: "error",
        title: "Something went wrong",
        description: "Unexpected error. Please try again.",
        affiliate: options?.affiliate ?? false,
      })
    },
  })
}
