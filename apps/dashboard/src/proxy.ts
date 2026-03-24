import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/drizzle"
import { websiteDomain } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { isReservedDomain } from "@/lib/constants/domains"

export async function proxy(req: NextRequest) {
  const host = req.headers.get("host")
  if (!host) return NextResponse.next()

  // 🚫 Skip platform / dev / vercel
  if (
    isReservedDomain(host) ||
    host.endsWith(".vercel.app") ||
    host.startsWith("localhost:3000") ||
    host.startsWith("127.0.0.1")
  ) {
    return NextResponse.next()
  }

  // 🔍 Find domain
  const [domain] = await db
    .select({
      orgId: websiteDomain.orgId,
      isActive: websiteDomain.isActive,
      isRedirect: websiteDomain.isRedirect,
      isPrimary: websiteDomain.isPrimary,
    })
    .from(websiteDomain)
    .where(eq(websiteDomain.domainName, host))
    .limit(1)

  // ❌ Unknown domain
  if (!domain) {
    return NextResponse.rewrite(new URL("/404", req.url))
  }

  /**
   * 🔁 Redirect case
   * inactive + redirect = true
   */
  if (domain.isRedirect && !domain.isPrimary) {
    const [primary] = await db
      .select({ domainName: websiteDomain.domainName })
      .from(websiteDomain)
      .where(
        and(
          eq(websiteDomain.orgId, domain.orgId),
          eq(websiteDomain.isPrimary, true)
        )
      )
      .limit(1)

    if (!primary) {
      // ⚠️ Data corruption fallback
      return NextResponse.rewrite(new URL("/404", req.url))
    }

    return NextResponse.redirect(
      new URL(
        req.nextUrl.pathname + req.nextUrl.search,
        `https://${primary.domainName}`
      ),
      308
    )
  }

  /**
   * ❌ Inactive and no redirect
   */
  if (!domain.isActive) {
    return NextResponse.rewrite(new URL("/404", req.url))
  }

  /**
   * 🟢 Active domain → rewrite
   */
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url), 307)
  }
  const rewriteUrl = new URL(
    `/affiliate/${domain.orgId}${req.nextUrl.pathname}${req.nextUrl.search}`,
    req.url
  )

  const response = NextResponse.rewrite(rewriteUrl)
  response.headers.set("x-current-host", host)

  return addCorsHeaders(response, req)
}
function addCorsHeaders(res: NextResponse, req: NextRequest) {
  const origin = req.headers.get("origin") || "*"

  res.headers.set("Access-Control-Allow-Origin", origin)
  res.headers.set("Access-Control-Allow-Credentials", "true")
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  )
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, rsc, next-router-state-tree, next-router-prefetch, next-url, accept, x-nextjs-data"
  )

  return res
}
export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}
