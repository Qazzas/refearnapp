// index.ts
var baseUrl = "https://refearnapp.com";
function initRefearnapp(url) {
  if (!url) return;
  let cleanedUrl = url.trim().replace(/\/$/, "");
  if (!/^https?:\/\//i.test(cleanedUrl)) {
    cleanedUrl = `https://${cleanedUrl}`;
  }
  baseUrl = cleanedUrl;
}
function getCookie(name) {
  if (typeof document === "undefined") return null;
  const nameLenPlus = name.length + 1;
  return document.cookie.split(";").map((c) => c.trim()).filter((cookie) => cookie.substring(0, nameLenPlus) === `${name}=`).map((cookie) => decodeURIComponent(cookie.substring(nameLenPlus)))[0] || null;
}
async function trackSignup(email) {
  try {
    const cookieData = getCookie("refearnapp_affiliate_cookie");
    const res = await fetch(`${baseUrl}/track-signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        manualCookieData: cookieData
      }),
      credentials: "include"
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
export {
  initRefearnapp,
  trackSignup
};
