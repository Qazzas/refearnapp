// lib/polar-config.ts
const isProd = process.env.NODE_ENV === "production"

export const polarConfig = {
  server: isProd ? ("production" as const) : ("sandbox" as const),
  customerPortalUrl: isProd
    ? process.env.NEXT_PUBLIC_POLAR_CUSTOMER_PORTAL_URL_PRODUCTION!
    : process.env.NEXT_PUBLIC_POLAR_CUSTOMER_PORTAL_URL_SANDBOX!,
  accessToken: isProd
    ? process.env.POLAR_ACCESS_TOKEN_PRODUCTION!
    : process.env.POLAR_ACCESS_TOKEN_SANDBOX!,

  productIds: {
    PRO: isProd
      ? process.env.POLAR_PRO_PRODUCT_ID_PRODUCTION!
      : process.env.POLAR_PRO_PRODUCT_ID_SANDBOX!,

    ULTIMATE: isProd
      ? process.env.POLAR_ULTIMATE_PRODUCT_ID_PRODUCTION!
      : process.env.POLAR_ULTIMATE_PRODUCT_ID_SANDBOX!,

    ULTIMATE_UPGRADE: isProd
      ? process.env.POLAR_ULTIMATE_UPGRADE_PRODUCT_ID_PRODUCTION!
      : process.env.POLAR_ULTIMATE_UPGRADE_PRODUCT_ID_SANDBOX!,
  },
}
