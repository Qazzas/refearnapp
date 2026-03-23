// This forces the page to be server-rendered on every request
export const dynamic = "force-dynamic"

import { headers } from "next/headers"

export default async function DocsPage() {
  // We grab headers to see if our Worker's "x-is-proxy" is actually reaching Vercel
  const headerList = await headers()
  const isProxy = headerList.get("x-is-proxy") || "false"
  const currentHost = headerList.get("host") || "unknown"

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-white">
      <h1 className="text-4xl font-bold">Documentation Test Page</h1>

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <p className="text-sm text-slate-400">Diagnostic Info:</p>
        <ul className="mt-2 space-y-2 font-mono text-sm">
          <li>
            <span className="text-blue-400">x-is-proxy:</span> {isProxy}
          </li>
          <li>
            <span className="text-green-400">Detected Host:</span> {currentHost}
          </li>
        </ul>
      </div>

      {isProxy === "true" ? (
        <p className="text-green-500 animate-pulse">✅ Worker Proxy Active</p>
      ) : (
        <p className="text-red-500">❌ Direct Access (Worker Bypassed)</p>
      )}
    </div>
  )
}
