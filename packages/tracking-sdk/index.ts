// packages/tracking-sdk/index.ts
let baseUrl = "https://refearnapp.com";

export function initRefearnapp(url: string) {
  if (!url) return;

  let cleanedUrl = url.trim().replace(/\/$/, "");

  // 1. Ensure it starts with a protocol
  // If they pass "my-affiliates.com", we turn it into "https://my-affiliates.com"
  if (!/^https?:\/\//i.test(cleanedUrl)) {
    cleanedUrl = `https://${cleanedUrl}`;
  }

  baseUrl = cleanedUrl;
}

export async function trackSignup(email: string) {
  try {
    const res = await fetch(`${baseUrl}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
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