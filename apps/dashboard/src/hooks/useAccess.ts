import { UserLicense } from "@/lib/server/organization/getLicense"

export function useAccess(license: UserLicense) {
  const isSelfHosted = process.env.NEXT_PUBLIC_SELF_HOSTED === "true"

  if (!isSelfHosted) {
    return {
      canAccessPro: true,
      canAccessUltimate: true,
      isExpired: false,
    }
  }

  return {
    canAccessPro: !!license?.isActive && license.isPro,
    canAccessUltimate: !!license?.isActive && license.isUltimate,
    isExpired: !license?.isActive,
  }
}
