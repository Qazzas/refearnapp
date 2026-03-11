import { KeyRound, AlertCircle, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LicenseRequiredProps {
  featureName: string
  requiredTier: "PRO" | "ULTIMATE"
  isExpired?: boolean
  domainName?: string
}

export function LicenseRequiredState({
  featureName,
  requiredTier,
  isExpired = false,
  domainName,
}: LicenseRequiredProps) {
  // Dynamic content based on status
  const title = isExpired ? "License Expired" : "Upgrade Required"
  const message = isExpired
    ? `Your license has expired. Please renew your ${requiredTier} subscription to regain access to ${featureName}.`
    : `You need an active ${requiredTier} license to access ${featureName}.`

  const icon = isExpired ? <AlertCircle size={48} /> : <KeyRound size={48} />
  const buttonText = isExpired ? "Renew License" : "Manage License Key"

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 px-4 animate-in fade-in zoom-in duration-500">
      {/* Icon: Red if expired, Primary if just locked */}
      <div
        className={`p-4 rounded-full ${isExpired ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}
      >
        {icon}
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Upgrade Required</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          You need an active {requiredTier} license to customize
          {domainName ? ` the portal at ${domainName}` : " your affiliate page"}
          .
        </p>
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">{message}</p>
      </div>

      <Button
        size="lg"
        onClick={() => (window.location.href = "/settings/license")}
        variant={isExpired ? "destructive" : "default"}
        className="gap-2"
      >
        {isExpired ? <ShieldCheck size={18} /> : <KeyRound size={18} />}
        {buttonText}
      </Button>
    </div>
  )
}
