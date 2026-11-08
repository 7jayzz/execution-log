// Tolerates a missing "https://", spaces or a trailing slash in the setting.
function cleanUrl(v) {
  let u = String(v || "").trim().replace(/\/+$/, "");
  if (!u) return "http://localhost:3000";
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  try { return new URL(u).origin; } catch { return "http://localhost:3000"; }
}
export const SITE_URL = cleanUrl(process.env.NEXT_PUBLIC_SITE_URL);

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
