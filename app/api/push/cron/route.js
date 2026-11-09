import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { pushSecrets, sendToUser } from "@/lib/push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Called every hour by a Supabase scheduled job. Sends each trader the reminders that are due
// at their chosen time, in their timezone, only for things they actually traded, and never twice.
const DEFAULT_ON = { journal: true, weekly: true, monthly: true, risk: true, goals: true, psych: true, prop: true, daily: false, product: false };
const on = (n, k) => (typeof n?.[k] === "boolean" ? n[k] : DEFAULT_ON[k]);
const toMins = (s, d) => { const m = /^(\d{1,2}):(\d{2})$/.exec(String(s || "")); return m ? +m[1] * 60 + +m[2] : d; };
const addDays = (iso, n) => { const d = new Date(iso + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

function nowIn(tz) {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23", weekday: "short" }).formatToParts(new Date());
  const g = (k) => p.find((x) => x.type === k)?.value;
  return { date: `${g("year")}-${g("month")}-${g("day")}`, mins: +g("hour") * 60 + +g("minute"), dow: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].indexOf(g("weekday")) };
}
function inQuiet(mins, from, to) {
  if (from === to) return false;
  return from < to ? mins >= from && mins < to : mins >= from || mins < to;
}
const journalled = (x) => !!(String(x.notes || "").trim() || x.grade || x.mood || String(x.setup || "").trim());

async function remindersFor(admin, userId) {
  const { data: sDoc } = await admin.from("journal_docs").select("data").eq("user_id", userId).eq("id", "settings").maybeSingle();
  const settings = sDoc?.data || {};
  const n = settings.notify || {};
  if (n.push !== true) return [];
  let tz = typeof n.tz === "string" && n.tz ? n.tz : "Europe/London";
  let now; try { now = nowIn(tz); } catch { tz = "Europe/London"; now = nowIn(tz); }
  if (inQuiet(now.mins, toMins(n.quietFrom, 22 * 60), toMins(n.quietTo, 7 * 60))) return [];
  if (now.mins < toMins(n.dailyTime, 20 * 60)) return [];

  const today = now.date, from = addDays(today, -40);
  const { data: rows } = await admin.from("journal_docs").select("id,data").eq("user_id", userId).neq("id", "settings").filter("data->>date", "gte", from).limit(2000);
  const accounts = Array.isArray(settings.accounts) ? settings.accounts : [];
  const demoIds = new Set(accounts.filter((a) => a?.demo).map((a) => a.id));
  // Example trades (and the example account) never trigger reminders.
  const trades = (rows || []).map((r) => r.data || {}).filter((x) => x.kind !== "note" && x.date && x.symbol && x.status !== "open" && x.date <= today && !x.example && !demoIds.has(x.accountId));
  const ws = addDays(today, -now.dow), week = trades.filter((x) => x.date >= ws);
  const out = [];

  if (on(n, "journal")) {
    const unj = trades.filter((x) => x.date >= addDays(today, -13) && !journalled(x));
    const todays = unj.filter((x) => x.date === today);
    if (todays.length) out.push({ key: "jday:" + today, title: "Finish today's journal", body: "You haven't finished your trading journal today. Take a few minutes to record your trades." });
    else if (unj.length) out.push({ key: "unj:" + today, title: "Trades waiting to be journalled", body: unj.length === 1 ? "You've got 1 trade waiting to be journalled. Complete it while the details are fresh." : `You've got ${unj.length} trades waiting to be journalled. Complete your entries while the details are fresh.` });
  }
  const weekDay = Number.isInteger(n.weekDay) ? n.weekDay : 4;
  if (on(n, "weekly") && week.length && now.dow >= weekDay && !accounts.some((a) => a?.reviews?.[ws]))
    out.push({ key: "wrev:" + ws, title: "Your weekly review is ready", body: "See your performance, execution and biggest lessons from this week." });
  if (on(n, "monthly") && +today.slice(8, 10) <= 3) {
    const lm = addDays(today.slice(0, 7) + "-01", -1).slice(0, 7);
    if (trades.some((x) => x.date.slice(0, 7) === lm)) {
      const m = new Intl.DateTimeFormat("en-GB", { month: "long", timeZone: "UTC" }).format(new Date(lm + "-15T00:00:00Z"));
      out.push({ key: "mrep:" + lm, title: `Your ${m} report is ready`, body: "See how the month went and what to take into the next one." });
    }
  }
  if (on(n, "psych") && week.length && now.dow >= 3 && !week.some((x) => x.mood))
    out.push({ key: "psy:" + ws, title: "Quick check-in", body: "Have you reviewed your emotional state and trading discipline this week?" });
  if (on(n, "prop")) {
    for (const a of accounts) {
      if (a?.demo) continue;
      const end = a?.rules?.endDate;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(end || "")) continue;
      const d = Math.round((Date.parse(end + "T00:00:00Z") - Date.parse(today + "T00:00:00Z")) / 864e5);
      if ([7, 3, 1, 0].includes(d)) out.push({ key: `prop:${a.id}:${end}:${d}`, title: "Prop firm evaluation", body: d === 0 ? "Your prop firm evaluation ends today." : d === 1 ? "Your prop firm evaluation ends tomorrow." : `Your prop firm evaluation has ${d} days remaining.` });
    }
  }
  const rank = { jday: 0, unj: 0, prop: 1, wrev: 2, mrep: 3, psy: 4 };
  return out.sort((x, y) => (rank[x.key.split(":")[0]] ?? 9) - (rank[y.key.split(":")[0]] ?? 9)).slice(0, 3);
}

export async function POST(request) {
  const admin = createAdminClient();
  const { cronSecret } = await pushSecrets(admin);
  if (!cronSecret || request.headers.get("x-cron-secret") !== cronSecret) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: subs } = await admin.from("push_subscriptions").select("user_id").limit(10000);
  const users = [...new Set((subs || []).map((s) => s.user_id))];
  let sent = 0;
  for (const uid of users) {
    try {
      const due = await remindersFor(admin, uid);
      for (const r of due) {
        // Claim the reminder first so a retry or overlapping run can't send it twice.
        const { error } = await admin.from("push_log").insert({ user_id: uid, key: r.key });
        if (error) continue;
        sent += await sendToUser(admin, uid, { title: r.title, body: r.body, url: "/dashboard", tag: r.key.split(":")[0] });
      }
    } catch (e) { console.error("Push reminders failed for a user", e?.message || e); }
  }
  // Keep the log small.
  await admin.from("push_log").delete().lt("sent_at", new Date(Date.now() - 60 * 864e5).toISOString());
  return NextResponse.json({ users: users.length, sent });
}
