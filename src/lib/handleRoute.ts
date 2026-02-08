// lib/handleRoute.ts
import { NextRequest, NextResponse } from "next/server"
import { returnError } from "@/lib/errorHandler"

/**
 * Next.js 15 compatible Route Wrapper
 * Handles async params and standardized error reporting.
 */
export function handleRoute<T>(
  name: string,
  handler: (req: NextRequest, params: T) => Promise<NextResponse>
) {
  // In Next.js 15, the second argument's 'params' property is a Promise
  return async (req: NextRequest, context: { params: Promise<T> }) => {
    const start = performance.now()
    try {
      // ✅ Await params before passing them to the handler
      const resolvedParams = await context.params

      const response = await handler(req, resolvedParams)

      const end = performance.now()
      console.info(`✅ [API] ${name} completed in ${Math.round(end - start)}ms`)
      return response
    } catch (err) {
      console.error(`❌ [API] ${name} error:`, err)
      const errorData = returnError(err)

      return NextResponse.json(
        {
          error: errorData.error,
          toast: errorData.toast,
          fields: errorData.fields,
        },
        { status: errorData.status }
      )
    }
  }
}
