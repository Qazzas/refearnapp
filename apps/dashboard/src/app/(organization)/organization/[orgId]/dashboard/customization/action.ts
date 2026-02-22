"use server"

import { db } from "@/db/drizzle"
import {
  organizationAuthCustomization,
  organizationDashboardCustomization,
} from "@/db/schema"

import { eq } from "drizzle-orm"
import {
  AuthCustomization,
  defaultAuthCustomization,
} from "@/customization/Auth/defaultAuthCustomization"
import {
  DashboardCustomization,
  defaultDashboardCustomization,
} from "@/customization/Dashboard/defaultDashboardCustomization"
import { deepMerge } from "@/util/DeepMerge"
import { getOrgAuth } from "@/lib/server/organization/GetOrgAuth"
import { MutationData } from "@/lib/types/organization/response"
import { handleAction } from "@/lib/handleAction"
import { saveOrganizationCustomization } from "@/lib/organizationAction/saveOrganizationCustomization"

export async function saveCustomizationsAction(
  orgId: string,
  data: {
    auth?: Partial<AuthCustomization>
    dashboard?: Partial<DashboardCustomization>
  }
): Promise<MutationData> {
  return handleAction("saveCustomizationsAction", async () => {
    await getOrgAuth(orgId)
    // Quick guard
    await saveOrganizationCustomization(orgId, data)
    return { ok: true, toast: "Customization Saved Successfully" }
  })
}
