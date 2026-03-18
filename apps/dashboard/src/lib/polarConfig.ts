// lib/polar-config.ts
const isProd = process.env.NODE_ENV === "production"

export const polarConfig = {
  server: isProd ? ("production" as const) : ("sandbox" as const),
  customerPortalUrl: isProd
    ? "https://polar.sh/refearnapp-us-one/portal"
    : "https://sandbox.polar.sh/zekariyas-berihun/portal",
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
