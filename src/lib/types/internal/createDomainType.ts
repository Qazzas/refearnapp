export interface CreateDomainType {
  orgId: string
  domain: string
  domainType: "platform" | "custom-main" | "custom-subdomain"
}
export type DomainInputType = "platform" | "custom-main" | "custom-subdomain"
