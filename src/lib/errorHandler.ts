import { AppError } from "@/lib/exceptions"

interface ErrorResponse {
  ok: false
  status: number
  error: string
  toast?: string // Unified message for client-side display
  fields?: Record<string, string> | null // Optional field errors
  data?: any
}

export function returnError(err: unknown): ErrorResponse {
  console.error("Full error object:", err)

  // 1. Check for our custom AppError class FIRST
  // This ensures status, toast, and error fields are preserved
  if (err instanceof AppError) {
    return {
      ok: false,
      status: err.status,
      error: err.error,
      toast: err.toast,
      fields: err.fields,
      data: err.data,
    }
  }

  // 2. Handle generic objects (like your existing { status: 500, ... } throws)
  if (typeof err === "object" && err !== null) {
    const errorObj = err as Partial<ErrorResponse>
    return {
      ok: false,
      status: errorObj.status || 500,
      error: errorObj.error || "Unknown error",
      toast: errorObj.toast || "Something went wrong",
      fields: errorObj.fields || null,
      data: (errorObj as any).data,
    }
  }

  // 3. Handle standard JavaScript Errors (Real crashes/Database errors)
  if (err instanceof Error) {
    return {
      ok: false,
      status: 500,
      error: err.message,
      toast: "An unexpected system error occurred", // Avoid "Database failed" for everything
      fields: null,
    }
  }

  return {
    ok: false,
    status: 500,
    error: "Internal server error",
    toast: "Something went wrong",
  }
}
