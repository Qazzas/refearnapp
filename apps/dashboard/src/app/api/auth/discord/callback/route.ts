import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  // Determine what message to send back to the main window
  const messagePayload = error
    ? { type: "DISCORD_AUTH_ERROR", error }
    : { type: "DISCORD_AUTH_SUCCESS", code }

  const html = `
    <html lang>
      <body style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; background: #0f172a; color: white; text-align: center;">
        <script>
          if (window.opener) {
            // Send the result (success or error) back to the Sidebar
            window.opener.postMessage(${JSON.stringify(messagePayload)}, window.location.origin);
            
            // Give the user a moment to see the "Success" state then close
            setTimeout(() => window.close(), 1000);
          }
        </script>
        <div>
          <h2 style="margin-bottom: 8px;">${error ? "Authentication Failed" : "Authenticated!"}</h2>
          <p style="opacity: 0.7;">${error ? "You cancelled the request or an error occurred." : "Closing this window..."}</p>
        </div>
      </body>
    </html>
  `

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  })
}
