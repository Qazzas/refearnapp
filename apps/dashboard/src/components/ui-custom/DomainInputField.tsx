import { useState, useEffect, useRef } from "react"
import { InputField } from "@/components/Auth/FormFields"
import { parse } from "tldts"
import { generateUniqueSubdomain } from "@/util/GenerateUniqueDomain"

export function DomainInputField({
  control,
  form,
  createMode,
  onDomainTypeChange,
}: {
  control: any
  form: any
  createMode?: boolean
  onDomainTypeChange?: (
    type: "platform" | "custom-main" | "custom-subdomain" | null
  ) => void
}) {
  const baseDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "refearnapp.com"
  const [domainType, setDomainType] = useState<
    "platform" | "custom-main" | "custom-subdomain" | null
  >(null)
  const companyName = form.watch("name")?.trim() || ""
  const domainValue = form.watch("defaultDomain")?.trim() || ""
  const lastGeneratedName = useRef("")

  useEffect(() => {
    if (!createMode) return

    const nameLength = companyName.length
    if (nameLength === 0) {
      form.setValue("defaultDomain", "")
      lastGeneratedName.current = ""
      return
    }

    if (nameLength > 2 && companyName !== lastGeneratedName.current) {
      lastGeneratedName.current = companyName
      const generated = generateUniqueSubdomain(companyName)
      form.setValue("defaultDomain", generated)
    }
  }, [companyName, createMode, form])
  const normalized = domainValue.replace(/^https?:\/\//, "").toLowerCase()

  useEffect(() => {
    const normalized = domainValue.replace(/^https?:\/\//, "").toLowerCase()
    let newType: any = null

    if (!normalized) newType = null
    // Check if it's a platform subdomain (either just 'apple' or 'apple.base.com')
    else if (
      normalized.endsWith(`.${baseDomain}`) ||
      !normalized.includes(".")
    ) {
      newType = "platform"
    } else {
      const parsed = parse(normalized)
      if (parsed.domain) {
        newType = parsed.subdomain ? "custom-subdomain" : "custom-main"
      }
    }

    setDomainType(newType)
    onDomainTypeChange?.(newType)
  }, [domainValue, baseDomain, onDomainTypeChange])
  const displayDomain =
    !domainValue || !normalized
      ? ""
      : domainType === "platform"
        ? normalized.endsWith(`.${baseDomain}`)
          ? normalized
          : `${normalized}.${baseDomain}`
        : normalized
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <InputField
            control={control}
            name="defaultDomain"
            label="Default Domain"
            placeholder="your-subdomain or customdomain.com"
            type="text"
            affiliate={false}
            leading="https://"
          />
        </div>
      </div>

      <p className="text-sm mt-1 text-muted-foreground">
        {!domainValue
          ? "Enter a subdomain or custom domain."
          : domainType === "platform"
            ? `This will be your subdomain: https://${displayDomain}`
            : domainType === "custom-main"
              ? `This will be your custom main domain: https://${displayDomain}`
              : domainType === "custom-subdomain"
                ? `This will be your custom subdomain: https://${displayDomain}`
                : ""}
      </p>
      {/* ⚠️ Add the warning right here */}
      {process.env.NEXT_PUBLIC_SELF_HOSTED === "true" &&
        domainType !== "platform" &&
        domainValue !== "" && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded">
            <p className="text-xs text-blue-700">
              ℹ️ <strong>Self-hosted mode:</strong> You will need to point this
              domain&#39;s A/CNAME record to your VPS IP and add it to your
              proxy (Coolify/Traefik).
            </p>
          </div>
        )}
    </div>
  )
}
