"use client"

import React from "react"
import { ArrowRight, XCircle } from "lucide-react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
interface StripeErrorProps {
  message?: string
  orgId: string
}
export default function StripeError({ message, orgId }: StripeErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border border-destructive/20">
          <CardHeader className="text-center space-y-3">
            <div className="flex justify-center">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-semibold text-destructive">
              Stripe Connection Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>
              {message
                ? decodeURIComponent(message)
                : "Something went wrong while connecting to Stripe."}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pt-4">
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link href={`/organization/${orgId}/dashboard/analytics`}>
                Go to Analytics Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
