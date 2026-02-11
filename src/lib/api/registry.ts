// Named imports are much safer for deep type inference
import { GET_AFFILIATE_KPI_PATH } from "@/app/api/affiliate/[orgId]/dashboard/analytics/kpi/route"

import { GET_AFFILIATE_REFERRERS_PATH } from "@/app/api/affiliate/[orgId]/dashboard/analytics/referrers/route"

import { GET_AFFILIATE_TIME_SERIES_PATH } from "@/app/api/affiliate/[orgId]/dashboard/analytics/time-series/route"
import { GET_ACTIVE_DOMAIN_PATH } from "@/app/api/organzation/[orgId]/domain/active/route"
import { ActionResult } from "@/lib/types/organization/response"
import { WebsiteDomain } from "@/lib/types/internal/database"
import {
  AffiliateKpiStats,
  OrganizationKpiStats,
} from "@/lib/types/affiliate/affiliateKpiStats"
import {
  AffiliateKpiTimeSeries,
  OrganizationKpiTimeSeries,
} from "@/lib/types/affiliate/affiliateChartStats"
import {
  AffiliateReferrerStat,
  OrganizationReferrerStat,
} from "@/lib/types/affiliate/affiliateReferrerStat"
import { GET_AFFILIATE_LINKS_PATH } from "@/app/api/affiliate/[orgId]/dashboard/links/route"
import { AffiliateLinkWithStats } from "@/lib/types/affiliate/affiliateLinkWithStats"
import { GET_AFFILIATE_PAYMENT } from "@/app/api/affiliate/[orgId]/dashboard/payment/route"
import { AffiliatePaymentRow } from "@/lib/types/affiliate/affiliatePaymentRow"
import { GET_AFFILIATE_PAYMENT_METHOD_PATH } from "@/app/api/affiliate/[orgId]/dashboard/profile/payment-method/route"
import { GET_ORG_AFFILIATES_STATS_PATH } from "@/app/api/organzation/[orgId]/dashboard/affiliates/route"
import {
  AffiliatePayout,
  AffiliateStats,
} from "@/lib/types/affiliate/affiliateStats"
import { GET_ORG_KPI_PATH } from "@/app/api/organzation/[orgId]/dashboard/analytics/kpi/route"
import { GET_ORG_REFERRERS_PATH } from "@/app/api/organzation/[orgId]/dashboard/analytics/referrers/route"
import { GET_ORG_TIME_SERIES_PATH } from "@/app/api/organzation/[orgId]/dashboard/analytics/time-series/route"
import { GET_ORG_CUSTOMIZATION_ALL_PATH } from "@/app/api/organzation/[orgId]/dashboard/customization/all/route"
import { GET_ORG_CUSTOMIZATION_AUTH_PATH } from "@/app/api/organzation/[orgId]/dashboard/customization/auth/route"
import { GET_ORG_CUSTOMIZATION_DASHBOARD_PATH } from "@/app/api/organzation/[orgId]/dashboard/customization/dashboard/route"
import { AuthCustomization } from "@/customization/Auth/defaultAuthCustomization"
import { DashboardCustomization } from "@/customization/Dashboard/defaultDashboardCustomization"
import { GET_ORG_WEBHOOK_KEY_PATH } from "@/app/api/organzation/[orgId]/dashboard/integration/webhook-key/route"
import { GET_ORG_DOMAIN_MANAGE_PATH } from "@/app/api/organzation/[orgId]/dashboard/manage-domains/route"
import { GET_ORG_TEAM_MEMBERS_PATH } from "@/app/api/organzation/[orgId]/dashboard/teams/route"
import { DomainRow } from "@/lib/types/organization/domainRow"
import { TeamRow } from "@/lib/types/internal/teamsRow"
import { GET_ORG_PAYOUTS_BULK_PATH } from "@/app/api/organzation/[orgId]/dashboard/payout/affiliateBulkPayout/route"
import { GET_ORG_PAYOUTS_PATH } from "@/app/api/organzation/[orgId]/dashboard/payout/affiliatePayout/route"
import { GET_ORG_PAYOUTS_UNPAID_PATH } from "@/app/api/organzation/[orgId]/dashboard/payout/unpaid-months/route"
import { PayoutResult } from "@/lib/types/organization/payoutResult"
import { UnpaidMonth } from "@/lib/types/organization/unpaidMonth"
import { GET_TEAM_REFERRERS_PATH } from "@/app/api/organzation/[orgId]/teams/dashboard/analytics/referrers/route"
import { GET_TEAM_TIME_SERIES_PATH } from "@/app/api/organzation/[orgId]/teams/dashboard/analytics/time-series/route"
import { GET_TEAM_PAYOUTS_BULK_PATH } from "@/app/api/organzation/[orgId]/teams/dashboard/payout/affiliateBulkPayout/route"
import { GET_TEAM_PAYOUTS_PATH } from "@/app/api/organzation/[orgId]/teams/dashboard/payout/affiliatePayout/route"
import { GET_TEAM_PAYOUTS_UNPAID_PATH } from "@/app/api/organzation/[orgId]/teams/dashboard/payout/unpaid-months/route"
import { GET_TEAM_WEBHOOK_KEY_PATH } from "@/app/api/organzation/[orgId]/teams/dashboard/integration/webhook-key/route"
import { GET_TEAM_AFFILIATES_STATS_PATH } from "@/app/api/organzation/[orgId]/teams/dashboard/affiliates/route"
import { GET_TEAM_DOMAIN_MANAGE_PATH } from "@/app/api/organzation/[orgId]/teams/dashboard/manage-domains/route"

export const API_CONFIG = {
  affiliate: {
    dashboard: {
      analytics: {
        kpi: {
          path: GET_AFFILIATE_KPI_PATH,
          response: {} as ActionResult<AffiliateKpiStats[]>,
        },
        referrers: {
          path: GET_AFFILIATE_REFERRERS_PATH,
          response: {} as ActionResult<AffiliateReferrerStat[]>,
        },
        timeSeries: {
          path: GET_AFFILIATE_TIME_SERIES_PATH,
          response: {} as ActionResult<AffiliateKpiTimeSeries[]>,
        },
      },
      links: {
        path: GET_AFFILIATE_LINKS_PATH,
        response: {} as ActionResult<AffiliateLinkWithStats[]>,
      },
      payment: {
        path: GET_AFFILIATE_PAYMENT,
        response: {} as ActionResult<AffiliatePaymentRow[]>,
      },
      profile: {
        paymentMethod: {
          path: GET_AFFILIATE_PAYMENT_METHOD_PATH,
          response: {} as ActionResult<AffiliatePaymentMethod>,
        },
      },
    },
  },
  organization: {
    domain: {
      active: {
        path: GET_ACTIVE_DOMAIN_PATH,
        response: {} as ActionResult<WebsiteDomain | null>,
      },
    },
    dashboard: {
      affiliates: {
        path: GET_ORG_AFFILIATES_STATS_PATH,
        response: {} as ActionResult<{
          rows: AffiliateStats[]
          hasNext: boolean
        }>,
      },
      analytics: {
        kpi: {
          path: GET_ORG_KPI_PATH,
          response: {} as ActionResult<OrganizationKpiStats[]>,
        },
        referrers: {
          path: GET_ORG_REFERRERS_PATH,
          response: {} as ActionResult<OrganizationReferrerStat[]>,
        },
        timeSeries: {
          path: GET_ORG_TIME_SERIES_PATH,
          response: {} as ActionResult<OrganizationKpiTimeSeries[]>,
        },
      },
      customization: {
        all: {
          path: GET_ORG_CUSTOMIZATION_ALL_PATH,
          response: {} as ActionResult<{
            auth: AuthCustomization
            dashboard: DashboardCustomization
          }>,
        },
        auth: {
          path: GET_ORG_CUSTOMIZATION_AUTH_PATH,
          response: {} as ActionResult<AuthCustomization>,
        },
        dashboard: {
          path: GET_ORG_CUSTOMIZATION_DASHBOARD_PATH,
          response: {} as ActionResult<DashboardCustomization>,
        },
      },
      integration: {
        webhookKey: {
          path: GET_ORG_WEBHOOK_KEY_PATH,
          response: {} as ActionResult<{ webhookPublicKey: string | null }>,
        },
      },
      manageDomains: {
        path: GET_ORG_DOMAIN_MANAGE_PATH,
        response: {} as ActionResult<{
          rows: DomainRow[]
          hasNext: boolean
        }>,
      },
      payout: {
        affiliateBulkPayout: {
          path: GET_ORG_PAYOUTS_BULK_PATH,
          response: {} as ActionResult<PayoutResult<AffiliatePayout>>,
        },
        affiliatePayout: {
          path: GET_ORG_PAYOUTS_PATH,
          response: {} as ActionResult<PayoutResult<AffiliatePayout>>,
        },
        unpaidMonths: {
          path: GET_ORG_PAYOUTS_UNPAID_PATH,
          response: {} as ActionResult<UnpaidMonth[]>,
        },
      },
      teams: {
        path: GET_ORG_TEAM_MEMBERS_PATH,
        response: {} as ActionResult<{
          rows: TeamRow[]
          hasNext: boolean
        }>,
      },
    },
    teams: {
      dashboard: {
        affiliates: {
          path: GET_TEAM_AFFILIATES_STATS_PATH,
          response: {} as ActionResult<{
            rows: AffiliateStats[]
            hasNext: boolean
          }>,
        },
        analytics: {
          kpi: {
            path: GET_TEAM_REFERRERS_PATH,
            response: {} as ActionResult<OrganizationKpiStats[]>,
          },
          referrers: {
            path: GET_TEAM_REFERRERS_PATH,
            response: {} as ActionResult<OrganizationReferrerStat[]>,
          },
          timeSeries: {
            path: GET_TEAM_TIME_SERIES_PATH,
            response: {} as ActionResult<OrganizationKpiTimeSeries[]>,
          },
        },
        integration: {
          webhookKey: {
            path: GET_TEAM_WEBHOOK_KEY_PATH,
            response: {} as ActionResult<{ webhookPublicKey: string | null }>,
          },
        },
        manageDomains: {
          path: GET_TEAM_DOMAIN_MANAGE_PATH,
          response: {} as ActionResult<{
            rows: DomainRow[]
            hasNext: boolean
          }>,
        },
        payout: {
          affiliateBulkPayout: {
            path: GET_TEAM_PAYOUTS_BULK_PATH,
            response: {} as ActionResult<PayoutResult<AffiliatePayout>>,
          },
          affiliatePayout: {
            path: GET_TEAM_PAYOUTS_PATH,
            response: {} as ActionResult<PayoutResult<AffiliatePayout>>,
          },
          unpaidMonths: {
            path: GET_TEAM_PAYOUTS_UNPAID_PATH,
            response: {} as ActionResult<UnpaidMonth[]>,
          },
        },
      },
    },
  },
} as const

export type ApiRegistry = typeof API_CONFIG
