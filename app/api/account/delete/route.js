import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Permanently deletes the signed-in user's account:
// 1. cancels any Stripe subscription straight away (so they're never charged again),
// 2. removes their screenshots from storage,
// 3. deletes the login, which also deletes their profile, journal, subscription record and push devices (ON DELETE CASCADE).
// Stripe keeps its own invoice records, which we need for tax. The free-trial card fingerprint is kept without the user link.
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  if (body.confirm !== "DELETE") return NextResponse.json({ error: "Type DELETE to confirm." }, { status: 400 });

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in again." }, { status: 401 });

  const admin = createAdminClient();

  // 1) Stop billing first. If this fails, stop here so we never delete someone who'd still be charged.
  const { data: sub } = await admin.from("subscriptions").select("stripe_subscription_id,status").eq("user_id", user.id).maybeSingle();
  if (sub?.stripe_subscription_id && !["canceled", "incomplete_expired"].includes(sub.status)) {
    try {
      await getStripe().subscriptions.cancel(sub.stripe_subscription_id);
    } catch (e) {
      if (e?.code !== "resource_missing" && !/canceled/i.test(e?.message || "")) {
        console.error("Account delete: Stripe cancel failed", e);
        return NextResponse.json({ error: "We couldn't cancel your subscription just now, so nothing was deleted. Please try again, or email us." }, { status: 502 });
      }
    }
  }

  // 2) Screenshots live in storage under the user's id, which a database cascade doesn't reach.
  try {
    for (let i = 0; i < 50; i++) {
      const { data: files } = await admin.storage.from("shots").list(user.id, { limit: 1000 });
      if (!files?.length) break;
      await admin.storage.from("shots").remove(files.map((f) => `${user.id}/${f.name}`));
      if (files.length < 1000) break;
    }
  } catch (e) {
    console.error("Account delete: screenshot cleanup failed", e);
  }

  // 3) Delete the login. Everything in public.* that references it goes with it.
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    console.error("Account delete: deleteUser failed", error);
    return NextResponse.json({ error: "Your subscription was cancelled, but we couldn't finish deleting your account. Please email us and we'll do it straight away." }, { status: 500 });
  }

  try { await supabase.auth.signOut(); } catch {}
  return NextResponse.json({ deleted: true });
}
