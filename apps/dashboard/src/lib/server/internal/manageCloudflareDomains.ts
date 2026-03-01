import { AppError } from "@/lib/exceptions"

const CLOUDFLARE_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN

export async function addDomainToCloudflare(domain: string) {
  if (!CLOUDFLARE_ZONE_ID || !CLOUDFLARE_API_TOKEN) {
    throw new AppError({
      status: 500,
      toast:
        "Cloudflare configuration is missing. Please check CLOUDFLARE_ZONE_ID and CLOUDFLARE_API_TOKEN in your environment variables.",
      error: "MISSING_CF_CONFIG",
    })
  }
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/custom_hostnames`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hostname: domain,
        ssl: {
          method: "http",
          type: "dv",
        },
      }),
    }
  )

  const data = (await res.json()) as any

  if (!res.ok) {
    throw new AppError({
      status: res.status,
      toast: data.errors?.[0]?.message ?? "Failed to add domain to Cloudflare",
    })
  }

  return data
}

export async function deleteDomainFromCloudflare(hostnameId: string) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/custom_hostnames/${hostnameId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
      },
    }
  )

  if (!res.ok) {
    const data = (await res.json()) as any
    throw new AppError({
      status: res.status,
      toast: data.errors?.[0]?.message ?? "Failed to delete domain",
    })
  }
}
export async function getCloudflareDomainStatus(hostname: string) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/custom_hostnames?hostname=${hostname}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  )

  const data = (await res.json()) as any

  if (!res.ok || !data.result || data.result.length === 0) {
    throw new AppError({
      status: res.status,
      toast: "Domain not found on Cloudflare",
    })
  }

  const record = data.result[0]

  return {
    id: record.id,
    hostname: record.hostname,
    status: record.status,
    sslStatus: record.ssl.status,
    verificationRecord: record.ownership_verification,
    sslValidationRecords: record.ssl.validation_records,
  }
}

export async function refreshCloudflareVerification(hostnameId: string) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/custom_hostnames/${hostnameId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ssl: { method: "http", type: "dv" },
      }),
    }
  )

  if (!res.ok) {
    throw new AppError({
      status: res.status,
      toast: "Failed to trigger domain re-verification",
    })
  }

  return await res.json()
}
