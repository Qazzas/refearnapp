"use client"
import { KeyRound, AlertCircle, ShieldCheck, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface LicenseRequiredProps {
  featureName: string
  requiredTier: "PRO" | "ULTIMATE"
  isExpired?: boolean
  needsActivation?: boolean
  domainName?: string
  orgId?: string
}

export function LicenseRequiredState({
  featureName,
  requiredTier,
  isExpired = false,
  needsActivation = false,
  domainName,
  orgId,
}: LicenseRequiredProps) {
  const router = useRouter()

  let title = "Upgrade Required"
  let message = `You need an active ${requiredTier} license to access ${featureName}.`
  let buttonLabel = "Manage License Key"
  let ButtonIcon = KeyRound

  if (isExpired) {
    title = "License Expired"
    message = `Your license has expired. Please renew your ${requiredTier} subscription.`
    buttonLabel = "Renew License"
    ButtonIcon = ShieldCheck
  } else if (needsActivation) {
    title = "Activation Required"
    message = `You have a ${requiredTier} key, but it hasn't been activated for this server yet.`
    buttonLabel = "Activate Now"
    ButtonIcon = Zap
  }

  const Icon = isExpired ? AlertCircle : Sparkles
  const iconBg = isExpired
    ? "bg-destructive/10 text-destructive"
    : "bg-violet-100 text-violet-600"
  const cardGradient = isExpired
    ? "from-rose-50 to-orange-50 border-rose-200"
    : needsActivation
      ? "from-amber-50 to-yellow-50 border-amber-200"
      : "from-indigo-50 to-blue-50 border-indigo-200"

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4 animate-in fade-in zoom-in duration-500">
      <div
        className={`p-8 md:p-12 rounded-3xl border border-dashed bg-gradient-to-br ${cardGradient} shadow-xl w-full max-w-xl`}
      >
        {/* Animated Icon */}
        <div className={`mx-auto mb-6 p-4 rounded-full w-fit ${iconBg}`}>
          <Icon size={48} strokeWidth={1.5} />
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>

          <div className="space-y-2">
            <p className="text-slate-600 font-medium">
              You need an active{" "}
              <span className="font-bold text-indigo-600">{requiredTier}</span>{" "}
              license to customize
              {domainName ? (
                <>
                  {" "}
                  the portal at{" "}
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-mono font-bold shadow-sm">
                    {domainName}
                  </span>
                </>
              ) : (
                " your affiliate page"
              )}
              .
            </p>
            <p className="text-slate-500 text-sm mt-4 italic">{message}</p>
          </div>
        </div>

        <Button
          size="lg"
          onClick={() =>
            router.push(`/organization/${orgId}/dashboard/pricing`)
          }
          className={`gap-2 px-8 rounded-xl shadow-lg transition-all hover:scale-105 ${
            isExpired
              ? "bg-rose-600 hover:bg-rose-700 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          <ButtonIcon size={18} />
          {buttonLabel}
        </Button>
      </div>
    </div>
  )
}
