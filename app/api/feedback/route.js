import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSubscription } from "@/lib/subscription";
import { planForPrice } from "@/lib/plans";
import { sendEmail } from "@/lib/email";
import { LEGAL } from "@/lib/legal";
import { feedbackEmail } from "@/lib/emails/feedback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KINDS = { idea: "Idea", bug: "Something's broken", other: "Other" };

// Feedback and feature requests from inside the journal. Stored for the user, and emailed to support.
export async function POST(request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Log in first" }, { status: 401 });
  let body; try { body = await request.json(); } catch { return NextResponse.json({ message: "Bad request" }, { status: 400 }); }
  const kind = KINDS[body?.kind] ? body.kind : "other", message = String(body?.message || "").trim().slice(0, 4000), page = String(body?.page || "").slice(0, 60);
  if (message.length < 3) return NextResponse.json({ message: "Write a few words first" }, { status: 400 });
  const admin = createAdminClient();
  const since = new Date(Date.now() - 864e5).toISOString();
  const { count } = await admin.from("feedback").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", since);
  if ((count || 0) >= 10) return NextResponse.json({ message: "That's a lot of feedback today, thank you! Try again tomorrow." }, { status: 429 });
  const sub = await getSubscription(supabase, user.id).catch(() => null), plan = sub?.price_id ? planForPrice(sub.price_id) || "" : "";
  const { error } = await admin.from("feedback").insert({ user_id: user.id, kind, message, page, plan });
  if (error) { console.error("Feedback insert failed", error.message); return NextResponse.json({ message: "Couldn't send that right now" }, { status: 500 }); }
  try {
    const mail = feedbackEmail({ kind, message, page, plan, email: user.email });
    await sendEmail({ to: LEGAL.email, ...mail, replyTo: user.email });
  } catch (e) { console.error("Feedback email failed", e?.message || e); }
  return NextResponse.json({ ok: true });
}
