import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { unsubToken } from "@/lib/push";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Turns off email reminders from the link in a reminder email. No login needed; the link is signed.
async function turnOff(u, s) {
  if (!/^[0-9a-f-]{36}$/i.test(u || "") || !s) return false;
  const admin = createAdminClient();
  const want = await unsubToken(admin, u);
  const a = Buffer.from(String(s)), b = Buffer.from(want);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  const { data } = await admin.from("journal_docs").select("data").eq("user_id", u).eq("id", "settings").maybeSingle();
  if (!data) return true;
  const d = data.data || {};
  await admin.from("journal_docs").update({ data: { ...d, notify: { ...(d.notify || {}), email: false } } }).eq("user_id", u).eq("id", "settings");
  return true;
}

const page = (ok) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Email reminders</title></head>
<body style="margin:0;background:#0b0e16;font-family:Arial,Helvetica,sans-serif;color:#f3f5fa;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:20px;">
<div style="max-width:440px;background:#121726;border:1px solid #232a3d;border-radius:16px;padding:28px;">
<h1 style="margin:0 0 10px;font-size:22px;">${ok ? "Email reminders are off" : "This link didn't work"}</h1>
<p style="margin:0 0 18px;color:#b9c0d1;line-height:1.6;">${ok ? "You won't get any more reminder emails. You can turn them back on any time in Settings → Notifications." : "It may be out of date. You can turn email reminders off in Settings → Notifications."}</p>
<a href="${SITE_URL}/dashboard" style="display:inline-block;background:#F4B53F;color:#121726;font-weight:700;padding:12px 22px;border-radius:10px;text-decoration:none;">Open my journal</a></div></body></html>`;

export async function GET(request) {
  const p = new URL(request.url).searchParams;
  let ok = false; try { ok = await turnOff(p.get("u"), p.get("s")); } catch (e) { console.error("Unsubscribe failed", e?.message || e); }
  return new NextResponse(page(ok), { status: ok ? 200 : 400, headers: { "content-type": "text/html; charset=utf-8" } });
}
// One-click unsubscribe from the mail app's own button.
export async function POST(request) {
  const p = new URL(request.url).searchParams;
  let ok = false; try { ok = await turnOff(p.get("u"), p.get("s")); } catch {}
  return NextResponse.json({ ok }, { status: ok ? 200 : 400 });
}
