// lib/server/organization/getUnifiedPlan.ts
import { getLicense } from "@/lib/server/organization/getLicense"
import { getOrgPlan } from "@/lib/server/organization/getUserPlan"

export type UnifiedPlan = "FREE" | "PRO" | "ULTIMATE"

/**
 * Resolves the plan tier for any organization.
 * Hides environment-specific logic (Cloud vs. Self-Hosted) from the caller.
 */
export async function getUnifiedPlan(orgId: string): Promise<UnifiedPlan> {
  const license = await getLicense(orgId)
  if (license) {
    if (license.isUltimate) return "ULTIMATE"
    if (license.isPro) return "PRO"
    return "FREE"
  }
  const planInfo = await getOrgPlan(orgId)
  return planInfo.plan as UnifiedPlan
}
