import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const targetOrigin = searchParams.get("state") || "*"

  const messagePayload = error
    ? { type: "DISCORD_AUTH_ERROR", error }
    : { type: "DISCORD_AUTH_SUCCESS", code }

  const html = `
    <html lang>
      <body style="...">
        <script>
          if (window.opener) {
            // CHANGE: Replace window.location.origin with targetOrigin
            // This allows the message to cross over to the self-hosted domain
            window.opener.postMessage(${JSON.stringify(messagePayload)}, "${targetOrigin}");
            
            setTimeout(() => window.close(), 1000);
          }
        </script>
        <div>...</div>
      </body>
    </html>
  `
  return new Response(html, { headers: { "Content-Type": "text/html" } })
}
