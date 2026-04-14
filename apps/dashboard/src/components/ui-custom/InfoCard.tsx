// components/ui/info-card.tsx
import { ReactNode } from "react"
import { Info } from "lucide-react"
import clsx from "clsx"

type InfoCardProps = {
  title?: string
  children: ReactNode
  icon?: ReactNode
  variant?: "info" | "warning" | "success"
  className?: string
}

export function InfoCard({
  title,
  children,
  icon,
  variant = "info",
  className,
}: InfoCardProps) {
  const variants = {
    info: {
      container: "border-slate-200 bg-slate-50 text-slate-700",
      icon: "text-blue-500",
      code: "bg-slate-200 text-slate-800",
      highlight: "text-blue-600",
    },
    warning: {
      container: "border-amber-200 bg-amber-50 text-amber-800",
      icon: "text-amber-500",
      code: "bg-amber-100 text-amber-900",
      highlight: "text-amber-700",
    },
    success: {
      container: "border-green-200 bg-green-50 text-green-800",
      icon: "text-green-500",
      code: "bg-green-100 text-green-900",
      highlight: "text-green-700",
    },
  }

  const styles = variants[variant]

  return (
    <div
      className={clsx(
        "flex flex-col items-start gap-3 rounded-xl border p-4 text-sm shadow-sm sm:flex-row",
        styles.container,
        className
      )}
    >
      <div className={clsx("mt-0.5 shrink-0", styles.icon)}>
        {icon || <Info size={18} />}
      </div>

      <div className="w-full overflow-hidden">
        {title && <p className="mb-1 font-semibold text-slate-900">{title}</p>}

        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  )
}
