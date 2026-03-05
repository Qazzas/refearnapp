let baseUrl = "https://refearnapp.com";

export function initRefearnapp(url: string) {
  if (!url) return;
  let cleanedUrl = url.trim().replace(/\/$/, "");
  if (!/^https?:\/\//i.test(cleanedUrl)) {
    cleanedUrl = `https://${cleanedUrl}`;
  }
  baseUrl = cleanedUrl;
}

// Internal helper to read the cookie
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const nameLenPlus = name.length + 1;
  return (
    document.cookie
      .split(";")
      .map((c) => c.trim())
      .filter((cookie) => cookie.substring(0, nameLenPlus) === `${name}=`)
      .map((cookie) => decodeURIComponent(cookie.substring(nameLenPlus)))[0] || null
  );
}

export async function trackSignup(email: string) {
  try {
    // 1. Grab the affiliate data from the customer's domain
    const cookieData = getCookie("refearnapp_affiliate_cookie");

    // 2. Pass it in the body so the Worker has it even if headers are blocked
    const res = await fetch(`${baseUrl}/track-signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        manualCookieData: cookieData
      }),
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { success: false, status: res.status, ...errorData };
    }

    return await res.json();
  } catch (err) {
    console.error("Refearnapp Tracking Error:", err);
    return { success: false, error: "Network or Configuration Error" };
  }
}