export function mapDomainType(
  input: "platform" | "custom-main" | "custom-subdomain"
): {
  type: "DEFAULT" | "CUSTOM_DOMAIN" | "CUSTOM_SUBDOMAIN"
  dnsStatus: "Pending" | "Verified"
  isVerified: boolean
  finalDomain: (d: string) => string
} {
  switch (input) {
    case "platform":
      return {
        type: "DEFAULT",
        dnsStatus: "Verified",
        isVerified: true,
        finalDomain: (d) =>
          d.endsWith(".refearnapp.com") ? d : `${d}.refearnapp.com`,
      }

    case "custom-main":
      return {
        type: "CUSTOM_DOMAIN",
        dnsStatus: "Pending",
        isVerified: false,
        finalDomain: (d) => d,
      }

    case "custom-subdomain":
      return {
        type: "CUSTOM_SUBDOMAIN",
        dnsStatus: "Pending",
        isVerified: false,
        finalDomain: (d) => d,
      }
  }
}
