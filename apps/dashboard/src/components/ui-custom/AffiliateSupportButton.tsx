"use client"

import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAtomValue } from "jotai"
import { dashboardButtonCustomizationAtom } from "@/store/DashboardCustomizationAtom"

export function AffiliateSupportButton({
  supportEmail,
  orgName,
  affiliateEmail,
}: {
  supportEmail?: string | null
  orgName: string
  affiliateEmail: string
}) {
  const { dashboardButtonBackgroundColor, dashboardButtonTextColor } =
    useAtomValue(dashboardButtonCustomizationAtom)

  if (!supportEmail) return null

  const handleSupportClick = () => {
    const subject = encodeURIComponent(`Support Request - ${orgName} Affiliate`)
    const body = encodeURIComponent(
      `Hi ${orgName} Support,\n\nI need help with...`
    )

    const domain = affiliateEmail.split("@")[1]?.toLowerCase()

    if (domain === "gmail.com" || domain === "googlemail.com") {
      // Direct Gmail Compose
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${supportEmail}&su=${subject}&body=${body}`,
        "_blank"
      )
    } else if (
      domain === "outlook.com" ||
      domain === "hotmail.com" ||
      domain === "live.com"
    ) {
      // Direct Outlook Web Compose
      window.open(
        `https://outlook.live.com/mail/0/deeplink/compose?to=${supportEmail}&subject=${subject}&body=${body}`,
        "_blank"
      )
    } else {
      // System Default (Apple Mail, Desktop Outlook, Yahoo, etc.)
      window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
        style={{
          backgroundColor: dashboardButtonBackgroundColor || undefined,
          color: dashboardButtonTextColor || undefined,
        }}
        onClick={handleSupportClick}
      >
        <Mail className="h-6 w-6" />
      </Button>
    </div>
  )
}
