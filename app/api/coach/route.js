import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSubscription, isActive } from "@/lib/subscription";
import { planForPrice } from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// AI Trading Coach. Elite gets a daily allowance; Basic and Pro get a few free replies a month as a taster.
const DAILY_LIMIT = Number(process.env.AI_DAILY_LIMIT || 30);
const FREE_MONTHLY = Number(process.env.AI_FREE_MONTHLY || 3);

// How many coach replies this user has used, and how many they're allowed, for their plan.
async function usage(admin, userId, elite) {
  const now = new Date(), day = now.toISOString().slice(0, 10), month = day.slice(0, 7);
  if (elite) {
    const { data } = await admin.from("ai_usage").select("count").eq("user_id", userId).eq("day", day).maybeSingle();
    return { period: "day", used: data?.count || 0, limit: DAILY_LIMIT, day };
  }
  const { data } = await admin.from("ai_usage").select("count").eq("user_id", userId).gte("day", month + "-01").lte("day", month + "-31");
  const used = (data || []).reduce((q, r) => q + (r.count || 0), 0);
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)).toISOString().slice(0, 10);
  return { period: "month", used, limit: FREE_MONTHLY, day, resets: next };
}

async function who() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ code: "not_granted", message: "Log in first" }, { status: 401 }) };
  const sub = await getSubscription(supabase, user.id);
  if (!isActive(sub)) return { error: NextResponse.json({ code: "upgrade", message: "Start a plan to use the AI coach" }, { status: 403 }) };
  return { user, elite: planForPrice(sub.price_id) === "elite" };
}

export async function GET() {
  const w = await who(); if (w.error) return w.error;
  const u = await usage(createAdminClient(), w.user.id, w.elite);
  return NextResponse.json({ elite: w.elite, ...u, left: Math.max(0, u.limit - u.used) });
}

export async function POST(request) {
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ code: "unavailable", message: "AI coach not configured" }, { status: 503 });
  const w = await who(); if (w.error) return w.error; const { user, elite } = w;

  const { prompt } = await request.json().catch(() => ({}));
  if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 80000) return NextResponse.json({ code: "bad_request", message: "Bad prompt" }, { status: 400 });

  // Allowance: daily on Elite, monthly free replies on other plans.
  const admin = createAdminClient(), u = await usage(admin, user.id, elite), day = u.day;
  if (u.used >= u.limit) return elite
    ? NextResponse.json({ code: "rate_limited", message: "Daily AI limit reached" }, { status: 429 })
    : NextResponse.json({ code: "upgrade", message: "Free coach replies used up", used: u.used, limit: u.limit, resets: u.resets }, { status: 403 });
  const { data: row } = await admin.from("ai_usage").select("count").eq("user_id", user.id).eq("day", day).maybeSingle();
  await admin.from("ai_usage").upsert({ user_id: user.id, day, count: (row?.count || 0) + 1 }, { onConflict: "user_id,day" });

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    // Sonnet 5.5 thinks by default and that thinking counts toward max_tokens, which can leave no room for the answer.
    // "between_tools" turns up-front thinking off, so the whole allowance goes to the reply.
    body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5", max_tokens: 2500, thinking: { type: "between_tools" }, output_config: { effort: "medium" }, messages: [{ role: "user", content: prompt }] }),
  });
  if (!res.ok) { console.error("Anthropic error", res.status, await res.text().catch(() => "")); return NextResponse.json({ code: "unavailable", message: "Coach unavailable" }, { status: 502 }); }
  const data = await res.json();
  const text = (data.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();
  if (!text) { console.error("Coach returned no text", data.stop_reason); return NextResponse.json({ code: "unavailable", message: "Empty reply" }, { status: 502 }); }
  return NextResponse.json({ text, truncated: data.stop_reason === "max_tokens", left: Math.max(0, u.limit - u.used - 1), limit: u.limit, period: u.period });
}
