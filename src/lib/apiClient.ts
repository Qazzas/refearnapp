import { API_CONFIG, ApiRegistry } from "@/lib/api/registry"
import { ActionResult } from "@/lib/types/organization/response"
import { NextResponse } from "next/server"

/**
 * 1. HELPER TYPES
 */
type NestedKeys<T> = {
  [K in keyof T & string]: T[K] extends { path: any }
    ? K
    : `${K}.${NestedKeys<T[K]>}`
}[keyof T & string]

type GetRoute<T, K extends string> = K extends `${infer Root}.${infer Rest}`
  ? Root extends keyof T
    ? GetRoute<T[Root], Rest>
    : never
  : K extends keyof T
    ? T[K]
    : never

type UnwrapNextResponse<T> = T extends NextResponse<infer D> ? D : T

type GetResponse<T, K extends string> =
  GetRoute<T, K> extends { response: infer R }
    ? UnwrapNextResponse<Awaited<R>>
    : never

/**
 * 2. THE API CLIENT (The Core Fetcher)
 */
export async function apiClient<K extends NestedKeys<ApiRegistry>>(
  key: K,
  args: Parameters<GetRoute<ApiRegistry, K>["path"]>,
  options?: RequestInit
): Promise<GetResponse<ApiRegistry, K>> {
  const keys = key.split(".")
  let current: any = API_CONFIG
  for (const k of keys) {
    current = current[k]
  }

  const path = current.path(...(args as any[]))

  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  const json = (await res.json().catch(() => ({
    ok: false,
    error: "Network response was not ok",
    status: res.status,
  }))) as ActionResult<any>

  if (!res.ok || !json.ok) {
    throw json
  }

  return json as GetResponse<ApiRegistry, K>
}

/**
 * 3. THE PROXY SDK (The Autocomplete Magic)
 */
type ApiCallable<T> = {
  [K in keyof T]: T[K] extends {
    path: (...args: infer P) => any
    response: infer R
  }
    ? (
        args: P,
        options?: RequestInit
      ) => Promise<UnwrapNextResponse<Awaited<R>>>
    : ApiCallable<T[K]>
}

function createApiProxy(path: string[] = []): any {
  return new Proxy(() => {}, {
    get(_, prop: string) {
      // Prevents the proxy from breaking when accessed by internal JS/TS tools
      if (prop === "then" || prop === "toJSON") return undefined
      return createApiProxy([...path, prop])
    },
    apply(_, __, args: [any[], RequestInit?]) {
      const key = path.join(".")
      // args[0] are the path/query parameters defined in registry
      // args[1] are optional fetch RequestInit options
      return apiClient(key as any, args[0], args[1])
    },
  })
}

// Export the typed proxy
export const api = createApiProxy() as ApiCallable<ApiRegistry>
