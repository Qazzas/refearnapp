"use client"

import React, { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { OrgHeader } from "@/components/ui-custom/OrgHeader"

export default function ErrorFallback({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Error caught by boundary:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/40 p-6">
      {/* Logo */}
      <OrgHeader affiliate={false} isPreview={false} noRedirect />
      <div className="text-sm font-medium text-muted-foreground truncate max-w-[150px] text-right">
        RefearnApp
      </div>

      {/* Error Card */}
      <Card className="max-w-md w-full shadow-md border border-border/60">
        <CardHeader className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-center">
            Something went wrong
          </h2>
        </CardHeader>

        <CardContent className="text-center text-sm text-muted-foreground space-y-3">
          <p>
            We encountered an unexpected error. You can try reloading this page
            or return to your dashboard.
          </p>
          {error.message && (
            <p className="text-xs bg-muted p-2 rounded-md border border-border/50">
              {error.message}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => location.reload()}>
            Reload Page
          </Button>
          <Button onClick={() => reset()}>Try Again</Button>
        </CardFooter>
      </Card>

      {/* Footer */}
      <p className="mt-6 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} RefearnApp. All rights reserved.
      </p>
    </div>
  )
}
