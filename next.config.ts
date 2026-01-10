import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  trailingSlash: false,
  experimental: {
    serverActions: {
      allowedOrigins: [
        "refearnapp.com",
        "www.refearnapp.com",
        "origin.refearnapp.com",
      ],
    },
  },
}

export default nextConfig
