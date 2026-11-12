// Tolerates a missing "https://", spaces, a trailing slash or a trailing dot in the setting.
function cleanUrl(v) {
  let u = String(v || "").trim().replace(/\/+$/, "");
  if (!u) return "http://localhost:3000";
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  // Also drops a stray dot after the domain ("theexecutionlog.com."), which browsers can't load the site on.
  try { const x = new URL(u); x.hostname = x.hostname.replace(/\.+$/, ""); return x.origin; } catch { return "http://localhost:3000"; }
}
export const SITE_URL = cleanUrl(process.env.NEXT_PUBLIC_SITE_URL);

// Phone verification before a free trial. Turn on with NEXT_PUBLIC_PHONE_VERIFY=on once SMS is set up in Supabase.
export const PHONE_VERIFY = process.env.NEXT_PUBLIC_PHONE_VERIFY === "on";

export const TAGLINE = "Your trades already tell the story. We help you read it.";

// Founder section on the home page. Set these in Vercel when you're ready:
// NEXT_PUBLIC_FOUNDER_TIKTOK = your TikTok profile link, NEXT_PUBLIC_FOUNDER_PHOTO = /founder.jpg (put the photo in /public).
const safeLink = (u) => (/^https:\/\/(www\.)?(tiktok|instagram)\.com\//i.test(String(u || "").trim()) ? String(u).trim() : "");
const safePhoto = (u) => (/^\/[\w./-]+\.(jpe?g|png|webp)$/i.test(String(u || "").trim()) ? String(u).trim() : "");
export const FOUNDER = {
  tiktok: safeLink(process.env.NEXT_PUBLIC_FOUNDER_TIKTOK),
  photo: safePhoto(process.env.NEXT_PUBLIC_FOUNDER_PHOTO),
};

// Only allow redirects to paths on this site (stops "?next=https://evil.com" tricks).
export function safeNext(next, fallback = "/dashboard") {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
