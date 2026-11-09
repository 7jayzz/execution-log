import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { trialEndingEmail, paymentFailedEmail, cancelledEmail } from "@/lib/emails/billing";
import { planForPrice } from "@/lib/plans";
import { SITE_URL } from "@/lib/site";

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
  // 23503: the user no longer exists (they deleted their account). Nothing to update, and retrying won't help.
  if (error && error.code === "23503") { console.warn("Webhook: user deleted, skipping", userId); return; }
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

// Finds who a subscription belongs to and sends them a billing email. Never fails the webhook:
// Stripe would retry and the customer could get the same email twice.
async function notify(admin, sub, build) {
  try {
    let userId = sub.metadata?.user_id;
    const customer = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
    if (!userId && customer) {
      const { data } = await admin.from("subscriptions").select("user_id").eq("stripe_customer_id", customer).maybeSingle();
      userId = data?.user_id;
    }
    if (!userId) return;
    const { data: u } = await admin.auth.admin.getUserById(userId);
    const email = u?.user?.email;
    if (!email) return;
    const { data: prof } = await admin.from("profiles").select("full_name").eq("id", userId).maybeSingle();
    const item = sub.items?.data?.[0];
    const price = item?.price;
    const ctx = {
      name: prof?.full_name || u.user.user_metadata?.full_name || "",
      email,
      plan: planForPrice(price?.id),
      interval: price?.recurring?.interval || "month",
      amount: price?.unit_amount ?? 0,
      currency: price?.currency || "gbp",
      billingUrl: `${SITE_URL}/api/billing-portal`,
      dashboardUrl: `${SITE_URL}/dashboard`,
    };
    await sendEmail({ to: email, ...build(ctx) });
  } catch (e) {
    console.error("Billing email failed", e);
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
      case "customer.subscription.trial_will_end": {
        const sub = event.data.object;
        if (sub.status === "trialing" && !sub.cancel_at_period_end) await notify(admin, sub, (c) => trialEndingEmail({ ...c, trialEnd: sub.trial_end }));
        break;
      }
      case "invoice.payment_failed": {
        const inv = event.data.object;
        const subId = inv.subscription || inv.parent?.subscription_details?.subscription;
        if (subId && inv.amount_due > 0) {
          const sub = await stripe.subscriptions.retrieve(subId);
          await notify(admin, sub, (c) => paymentFailedEmail({ ...c, amount: inv.amount_due, currency: inv.currency, nextAttempt: inv.next_payment_attempt }));
        }
        break;
      }
      case "customer.subscription.updated": {
        const sub = event.data.object, prev = event.data.previous_attributes || {};
        await saveSubscription(admin, sub);
        // Only when cancel_at_period_end has just switched on: that's the moment someone cancels in the portal.
        if (sub.cancel_at_period_end && prev.cancel_at_period_end === false) {
          await notify(admin, sub, (c) => cancelledEmail({ ...c, accessUntil: sub.cancel_at || sub.current_period_end || sub.items?.data?.[0]?.current_period_end }));
        }
        break;
      }
      case "customer.subscription.created":
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
