// Tolerates a missing "https://", spaces or a trailing slash in the setting.
function cleanUrl(v) {
  let u = String(v || "").trim().replace(/\/+$/, "");
  if (!u) return "http://localhost:3000";
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  try { return new URL(u).origin; } catch { return "http://localhost:3000"; }
}
export const SITE_URL = cleanUrl(process.env.NEXT_PUBLIC_SITE_URL);

// Only allow redirects to paths on this site (stops "?next=https://evil.com" tricks).
export function safeNext(next, fallback = "/dashboard") {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
