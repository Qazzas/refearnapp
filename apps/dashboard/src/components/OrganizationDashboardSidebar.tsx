"use client"

import React, { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Form } from "@/components/ui/form"
import {
  BarChart3,
  Link as LinkIcon,
  Users,
  Settings,
  CreditCard,
  Layers,
  User,
  Globe,
  MailQuestion,
  TicketPercent,
  MousePointerClick,
  Lock,
  RefreshCw,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import CreateCompany from "@/components/pages/Create-Company"
import { DropdownInput } from "@/components/ui-custom/DropDownInput"
import { useSwitchOrg } from "@/hooks/useSwitchOrg"
import { OrganizationData } from "@/lib/types/organization/profileTypes"
import { AppDialog } from "@/components/ui-custom/AppDialog"
import { PlanInfo } from "@/lib/types/organization/planInfo"
import { Button } from "@/components/ui/button"
import { usePaddlePortal } from "@/hooks/usePaddlePortal"
import { handlePlanRedirect } from "@/util/HandlePlanRedirect"
import { OrgHeader } from "@/components/ui-custom/OrgHeader"
import { useCloseSidebarOnNavigation } from "@/hooks/useCloseSidebarOnNavigation"
import { SystemUpdate } from "@/components/ui-custom/SystemUpdate"
import { SidebarHelp } from "@/components/ui-custom/SidebarHelp"
import { UserLicense } from "@/lib/server/organization/getLicense"
import { useAccess } from "@/hooks/useAccess"
import { useForm } from "react-hook-form"
import { licenseSchema } from "@/lib/schema/licenseSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAppMutation } from "@/hooks/useAppMutation"
import {
  activateLicense,
  deactivateLicense,
} from "@/app/(organization)/organization/[orgId]/dashboard/action"
import { InputField } from "@/components/Auth/FormFields"
import { polarConfig } from "@/lib/polarConfig"
import { useDiscordSync } from "@/hooks/useDiscordSync"
import { DiscordIcon } from "@/components/ui-custom/DiscordIcon"
import { cn } from "@/lib/utils"

// Menu items for the sidebar

type Props = {
  orgId?: string
  plan: PlanInfo
  orgs: { id: string; name: string }[]
  UserData: OrganizationData | null
  updateInfo?: { isNewer: boolean; latestVersion: string; url: string } | null
  license: UserLicense | null
}
const OrganizationDashboardSidebar = ({
  orgId,
  plan,
  orgs,
  UserData,
  updateInfo,
  license,
}: Props) => {
  const pathname = usePathname()
  const isSelfHosted = process.env.NEXT_PUBLIC_SELF_HOSTED === "true"
  useCloseSidebarOnNavigation()
  const form = useForm<z.infer<typeof licenseSchema>>({
    resolver: zodResolver(licenseSchema),
    defaultValues: { licenseKey: "" },
  })
  const { canAccessPro, canAccessUltimate } = useAccess(license)
  const isLocked = (itemTitle: string) => {
    if (isSelfHosted) {
      if (["Teams", "Coupons"].includes(itemTitle)) return !canAccessUltimate
      if (["Customization", "Dashboard"].includes(itemTitle))
        return !canAccessPro
    }
    return false
  }
  const isPremium = isSelfHosted
    ? (license?.isPro || license?.isUltimate) && !!license?.activationId
    : plan.plan === "PRO" || plan.plan === "ULTIMATE"

  const isUltimate = isSelfHosted
    ? license?.isUltimate
    : plan.plan === "ULTIMATE"
  const discordLabel = isUltimate
    ? "Join Ultimate VIP"
    : isPremium
      ? "Join Pro Discord"
      : "Join Community Discord"
  const { sync, isPending: isSyncingDiscord } = useDiscordSync(orgId!)
  const handleDiscordAction = () => {
    if (isPremium) {
      sync()
    } else {
      window.open("https://discord.gg/fHw9j7P3w9", "_blank")
    }
  }
  const { mutate: switchOrg, isPending } = useSwitchOrg()
  const items = [
    {
      title: "Dashboard",
      url: `/organization/${orgId}/dashboard/analytics`,
      icon: BarChart3,
    },
    {
      title: "Affiliates",
      url: `/organization/${orgId}/dashboard/affiliates`,
      icon: LinkIcon,
    },
    {
      title: "Payout",
      url: `/organization/${orgId}/dashboard/payout`,
      icon: Users,
    },
    {
      title: "Customization",
      url: `/organization/${orgId}/dashboard/customization`,
      icon: CreditCard,
    },
    {
      title: "Integration",
      url: `/organization/${orgId}/dashboard/integration`,
      icon: Layers,
    },
    {
      title: "Referrals",
      url: `/organization/${orgId}/dashboard/referrals`,
      icon: MousePointerClick,
    },
    {
      title: "Coupons",
      url: `/organization/${orgId}/dashboard/coupons`,
      icon: TicketPercent,
    },
    {
      title: "Settings",
      url: `/organization/${orgId}/dashboard/settings`,
      icon: Settings,
    },
    {
      title: "Manage Domains",
      url: `/organization/${orgId}/dashboard/manageDomains`,
      icon: Globe,
    },
    ...(!isSelfHosted
      ? [
          {
            title: "Support Email",
            url: `/organization/${orgId}/dashboard/supportEmail`,
            icon: MailQuestion,
          },
        ]
      : []),
  ]
  if (plan.plan === "PRO" || plan.plan === "ULTIMATE") {
    items.push({
      title: "Teams",
      url: `/organization/${orgId}/dashboard/teams`,
      icon: Users,
    })
  }
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectOpen, setSelectOpen] = useState(false)
  const [licenseModalOpen, setLicenseModalOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<
    "create" | "upgrade" | "expired"
  >("create")
  const router = useRouter()
  const { openPortal } = usePaddlePortal(orgId)
  const activateMutation = useAppMutation(
    (values: z.infer<typeof licenseSchema>) =>
      activateLicense(orgId!, values.licenseKey),
    {
      onSuccess: () => {
        setLicenseModalOpen(false)
        form.reset()
        router.refresh()
      },
    }
  )
  const deactivateMutation = useAppMutation(
    () => {
      if (!license?.activationId) return Promise.reject("No activation ID")
      return deactivateLicense(orgId!, license.activationId)
    },
    {
      onSuccess: () => router.refresh(),
    }
  )
  const handleClick = () => {
    setSelectOpen(false)

    // 🧠 Handle FREE users → show upgrade dialog (not redirect)
    if (plan.plan === "FREE") {
      setDialogMode("upgrade")
      setDialogOpen(true)
      return
    }

    // 🧠 Handle expired subscription users (PRO or ULTIMATE)
    if (
      plan.type === "EXPIRED" &&
      (plan.plan === "PRO" || plan.plan === "ULTIMATE")
    ) {
      setDialogMode("expired")
      setDialogOpen(true)
      return
    }

    // 🧠 Handle users that reached org limit and need upgrade
    if (!canCreate) {
      setDialogMode("upgrade")
      setDialogOpen(true)
      return
    }

    // 🧱 Default: open create company dialog
    setDialogMode("create")
    setDialogOpen(true)
  }

  const getUpgradeText = (plan: PlanInfo) => {
    if (plan.plan === "FREE") return "Upgrade or Purchase"
    if (plan.type === "EXPIRED" && plan.plan === "PRO")
      return "Renew Subscription"
    if (plan.type === "EXPIRED" && plan.plan === "ULTIMATE")
      return "Renew Subscription"
    if (plan.type === "PURCHASE" && plan.plan === "PRO")
      return "Purchase Ultimate Bundle"
    if (plan.type === "SUBSCRIPTION" && plan.plan === "PRO") return "Upgrade"
    return ""
  }
  const currentOrg = orgs?.find((o) => o.id === orgId)
  const canCreate =
    isSelfHosted ||
    plan.plan === "ULTIMATE" ||
    (plan.plan === "PRO" && orgs.length < 1)
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-4">
        <OrgHeader affiliate={false} isPreview={false} noRedirect />
        <div className="flex items-center space-x-2">
          {/* Org dropdown */}
          <DropdownInput
            label=""
            value={currentOrg?.id ?? ""}
            options={orgs.map((org) => ({
              label: org.name,
              value: org.id,
            }))}
            placeholder="No Org"
            width="w-40"
            onChange={(val) => switchOrg(val)}
            disabled={orgs.length === 0 || isPending}
            includeFooter
            onFooterClick={handleClick}
            selectOpen={selectOpen}
            setSelectOpen={(v) => !dialogOpen && setSelectOpen(v)}
          />
          <AppDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            affiliate={false}
            title={
              dialogMode === "upgrade"
                ? "Upgrade Required"
                : dialogMode === "expired"
                  ? "Plan Expired"
                  : undefined
            }
            description={
              dialogMode === "upgrade"
                ? plan.plan === "FREE"
                  ? "You need to upgrade or purchase a plan to create a new organization."
                  : plan.type === "PURCHASE"
                    ? "You need to purchase the Ultimate bundle to create a new company."
                    : "You need to upgrade to Ultimate to create a new company."
                : dialogMode === "expired"
                  ? `Your ${plan.plan} plan has expired. Please renew to continue accessing premium features.`
                  : undefined
            }
            confirmText={
              dialogMode === "upgrade"
                ? getUpgradeText(plan)
                : dialogMode === "expired"
                  ? "Renew Now"
                  : "OK"
            }
            onConfirm={
              dialogMode === "upgrade" || dialogMode === "expired"
                ? () => {
                    setDialogOpen(false)
                    setTimeout(() => handlePlanRedirect(orgId!, router), 150)
                  }
                : undefined
            }
            showFooter={dialogMode === "upgrade" || dialogMode === "expired"}
          >
            {dialogMode === "create" && (
              <div className="h-full overflow-y-auto max-h-[60vh]">
                <CreateCompany mode="add" embed />
              </div>
            )}
          </AppDialog>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const locked = isLocked(item.title)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                        {locked && (
                          <div className="ml-auto">
                            <Lock className="w-3 h-3 text-amber-500" />
                          </div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-2">
        <Button
          onClick={handleDiscordAction}
          disabled={isSyncingDiscord}
          variant="outline"
          className={cn(
            "w-full justify-start gap-3 border-dashed transition-all",
            isUltimate
              ? "border-amber-500/50 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10"
              : isPremium
                ? "border-indigo-500/30 bg-indigo-600/5 text-indigo-500 hover:bg-indigo-600/10"
                : "border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100"
          )}
        >
          {isSyncingDiscord ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <DiscordIcon className="w-4 h-4" />
          )}
          <div className="flex flex-col items-start overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">
              Discord Access
            </span>
            <span className="text-xs font-semibold truncate">
              {isSyncingDiscord ? "Syncing Roles..." : discordLabel}
            </span>
          </div>
        </Button>
        <SidebarHelp />
        <SystemUpdate variant="badge" updateInfo={updateInfo} />
        {/* 🛡️ SELF-HOSTED: Show a "Pro License" badge instead of billing buttons */}
        {isSelfHosted ? (
          <div className="p-4 space-y-3">
            {/* If community/no license, offer to buy/get one */}
            {license?.isCommunity && (
              <>
                <Link
                  href={`/organization/${orgId}/dashboard/pricing`}
                  className="block w-full"
                >
                  <Button className="w-full">Get License Key</Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full text-xs opacity-70 hover:opacity-100 underline-offset-4 hover:underline"
                  onClick={() => setLicenseModalOpen(true)}
                >
                  Already have a key? Activate
                </Button>
              </>
            )}

            {(license?.isPro || license?.isUltimate) && (
              <>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    window.open(polarConfig.customerPortalUrl, "_blank")
                  }
                >
                  Manage Licenses
                </Button>
                {license.activationId ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-2 text-[10px] font-bold uppercase text-green-500">
                      <span>● Device Active</span>
                      <span>{license.tier}</span>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full text-xs"
                      disabled={deactivateMutation.isPending}
                      onClick={() => deactivateMutation.mutate(undefined)}
                    >
                      {deactivateMutation.isPending
                        ? "Deactivating..."
                        : "Deactivate License"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    className="w-full text-xs"
                    onClick={() => setLicenseModalOpen(true)}
                  >
                    Activate License Key
                  </Button>
                )}
              </>
            )}
          </div>
        ) : (
          <>
            {/* 🆓 FREE USERS → Upgrade or Purchase */}
            {plan.plan === "FREE" && (
              <Link
                href={`/organization/${orgId}/dashboard/pricing`}
                scroll={false}
                className="block w-full"
              >
                <Button className="w-full">Upgrade</Button>
              </Link>
            )}

            {/* 💼 PRO PURCHASE USERS → Offer Ultimate purchase */}
            {plan.type === "PURCHASE" && plan.plan === "PRO" && (
              <Link
                href={`/organization/${orgId}/dashboard/pricing`}
                scroll={false}
                className="block w-full"
              >
                <Button className="w-full">Purchase Ultimate Bundle</Button>
              </Link>
            )}

            {/* 🔁 SUBSCRIPTION or EXPIRED → Manage + Purchase */}
            {(plan.type === "SUBSCRIPTION" || plan.type === "EXPIRED") &&
              (plan.plan === "PRO" || plan.plan === "ULTIMATE") && (
                <>
                  {!plan.hasPendingPurchase && (
                    <Button className="w-full" onClick={() => openPortal()}>
                      Manage Subscription
                    </Button>
                  )}
                  <Link
                    href={`/organization/${orgId}/dashboard/pricing`}
                    scroll={false}
                    className="block w-full"
                  >
                    <Button variant="outline" className="w-full">
                      {plan.hasPendingPurchase
                        ? "Purchase One-Time Plan"
                        : "Change Plan"}
                    </Button>
                  </Link>
                </>
              )}
          </>
        )}
        <AppDialog
          open={licenseModalOpen}
          onOpenChange={setLicenseModalOpen}
          title="Activate License"
          description="Enter your license key to activate or update your premium features."
          confirmText={
            activateMutation.isPending ? "Activating..." : "Activate"
          }
          confirmLoading={activateMutation.isPending}
          onConfirm={form.handleSubmit((values) =>
            activateMutation.mutate(values)
          )}
          confirmDisabled={activateMutation.isPending}
          affiliate={false}
        >
          <Form {...form}>
            <form className="space-y-4">
              <InputField
                control={form.control}
                name="licenseKey"
                label="License Key"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                type="text"
                affiliate={false}
              />
            </form>
          </Form>
        </AppDialog>
        <Link href={`/organization/${orgId}/dashboard/profile`}>
          <div className="flex items-center space-x-3 p-2 rounded-md bg-primary/10 hover:bg-primary/15 transition-colors cursor-pointer">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{UserData?.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {UserData?.email}
              </p>
            </div>
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  )
}

export default OrganizationDashboardSidebar
