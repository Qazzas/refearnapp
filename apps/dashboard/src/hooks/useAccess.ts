import { UserLicense } from "@/lib/server/organization/getLicense"

export function useAccess(license: UserLicense | null) {
  const isSelfHosted = process.env.NEXT_PUBLIC_SELF_HOSTED === "true"

  if (!isSelfHosted) {
    return {
      canAccessPro: true,
      canAccessUltimate: true,
      isExpired: false,
    }
  }
  if (!license) {
    return {
      canAccessPro: false,
      canAccessUltimate: false,
      isExpired: true,
    }
  }
  return {
    canAccessPro: license.isActive && (license.isPro || license.isUltimate),
    canAccessUltimate: license.isActive && license.isUltimate,
    isExpired: !license.isActive,
  }
}
