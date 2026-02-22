export type DomainRow = {
  id: string
  domainName: string
  type: "DEFAULT" | "CUSTOM_DOMAIN" | "CUSTOM_SUBDOMAIN"
  isActive: boolean
  isRedirect: boolean
  isVerified: boolean
  isPrimary: boolean
  dnsStatus: "Pending" | "Verified" | "Failed"
}
