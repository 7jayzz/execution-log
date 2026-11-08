import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const iso = (secs) => (secs ? new Date(secs * 1000).toISOString() : null);

async function saveSubscription(admin, sub) {
  let userId = sub.metadata?.user_id;
  if (!userId) {
    const { data } = await admin.from("subscriptions").select("user_id").eq("stripe_customer_id", sub.customer).maybeSingle();
    userId = data?.user_id;
  }
  if (!userId) {
    console.warn("Webhook: no user for customer", sub.customer);
    return;
  }
  const item = sub.items?.data?.[0];
  const { error } = await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer?.id,
      stripe_subscription_id: sub.id,
      status: sub.status,
      price_id: item?.price?.id || null,
      current_period_end: iso(sub.current_period_end ?? item?.current_period_end),
      trial_end: iso(sub.trial_end),
      cancel_at_period_end: !!sub.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (error) throw error;
}

// One free trial per card. Stripe gives a card the same fingerprint whatever email or account it's used with,
// so a second trial on a card that has already had one is ended straight away and the plan is charged as normal.
async function enforceOneTrial(stripe, admin, sub) {
  if (sub.status !== "trialing") return;
  const pmId = typeof sub.default_payment_method === "string" ? sub.default_payment_method : sub.default_payment_method?.id;
  if (!pmId) return;
  const pm = await stripe.paymentMethods.retrieve(pmId);
  const fp = pm.card?.fingerprint;
  if (!fp) return;
  const userId = sub.metadata?.user_id || null;
  const { data: seen } = await admin.from("trial_cards").select("user_id, stripe_subscription_id").eq("fingerprint", fp).maybeSingle();
  if (seen && seen.stripe_subscription_id !== sub.id && seen.user_id !== userId) {
    const ended = await stripe.subscriptions.update(sub.id, {
      trial_end: "now",
      proration_behavior: "none",
      metadata: { ...sub.metadata, trial_blocked: "card_already_used" },
    });
    await saveSubscription(admin, ended);
    return;
  }
  if (!seen) {
    await admin.from("trial_cards").upsert(
      { fingerprint: fp, user_id: userId, stripe_subscription_id: sub.id },
      { onConflict: "fingerprint", ignoreDuplicates: true }
    );
  }
}

export async function POST(request) {
  const stripe = getStripe();
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  const admin = createAdminClient();
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object;
        if (s.mode === "subscription" && s.subscription) {
          const sub = await stripe.subscriptions.retrieve(s.subscription);
          if (!sub.metadata?.user_id && s.client_reference_id) sub.metadata = { ...sub.metadata, user_id: s.client_reference_id };
          await saveSubscription(admin, sub);
          await enforceOneTrial(stripe, admin, sub);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.paused":
      case "customer.subscription.resumed":
        await saveSubscription(admin, event.data.object);
        break;
      default:
        break;
    }
  } catch (e) {
    console.error("Webhook handling failed", e);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}
