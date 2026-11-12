import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { priceIdFor, planForPrice, TRIAL_DAYS } from "@/lib/plans";
import { isActive } from "@/lib/subscription";
import { SITE_URL, PHONE_VERIFY } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    return await startCheckout(request);
  } catch (e) {
    console.error("Checkout failed", e);
    // A short, non-secret reference (Stripe's error code and the field it was about) so support can see what went wrong.
    const ref = [e?.code || e?.type, e?.param].filter(Boolean).join(":").replace(/[^\w:.\[\]-]/g, "").slice(0, 60);
    return NextResponse.redirect(`${SITE_URL}/pricing?error=checkout${ref ? `&ref=${encodeURIComponent(ref)}` : ""}`, { status: 303 });
  }
}

async function startCheckout(request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${SITE_URL}/login?next=/pricing`, { status: 303 });

  const form = await request.formData();
  const plan = String(form.get("plan") || "");
  const interval = String(form.get("interval") || "month") === "year" ? "year" : "month";
  const price = priceIdFor(plan, interval);
  if (!price) return NextResponse.redirect(`${SITE_URL}/pricing?error=plan`, { status: 303 });

  const admin = createAdminClient();
  const { data: existing } = await admin.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle();
  if (isActive(existing)) return switchPlan(existing, plan, interval, price);

  const stripe = getStripe();
  let customer = existing?.stripe_customer_id;
  // A customer saved from test mode doesn't exist in live mode (and vice versa): make a fresh one instead of failing.
  if (customer) {
    try { const c = await stripe.customers.retrieve(customer); if (c?.deleted) customer = null; }
    catch (e) { if (e?.code === "resource_missing" || e?.statusCode === 404) customer = null; else throw e; }
  }
  if (!customer) {
    const c = await stripe.customers.create({ email: user.email, metadata: { user_id: user.id } });
    customer = c.id;
    await admin.from("subscriptions").upsert({ user_id: user.id, stripe_customer_id: customer, status: "incomplete" }, { onConflict: "user_id" });
  }

  // One free trial per person: no trial if they've subscribed before.
  const hadSubscription = !!existing?.stripe_subscription_id;
  const offerTrial = !hadSubscription && TRIAL_DAYS > 0;
  // Free trials need a verified mobile number (one number per account; Supabase enforces that).
  if (offerTrial && PHONE_VERIFY && !user.phone_confirmed_at) return NextResponse.redirect(`${SITE_URL}/pricing?error=phone#verify`, { status: 303 });
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer,
    client_reference_id: user.id,
    line_items: [{ price, quantity: 1 }],
    allow_promotion_codes: true,
    subscription_data: {
      metadata: { user_id: user.id },
      ...(offerTrial ? { trial_period_days: TRIAL_DAYS } : {}),
    },
    // Trials need a card: its fingerprint is how we keep it to one free trial per person.
    ...(offerTrial
      ? {
          payment_method_types: ["card"],
          custom_text: {
            submit: {
              message: `Free trials are limited to one per person and per card. If this card has already been used for a free trial, your plan starts today and you'll be charged now. Otherwise you won't be charged until your ${TRIAL_DAYS}-day trial ends.`,
            },
          },
        }
      : {}),
    success_url: `${SITE_URL}/dashboard?checkout=success`,
    cancel_url: `${SITE_URL}/pricing?checkout=cancelled`,
  });
  return NextResponse.redirect(session.url, { status: 303 });
}

// Someone already subscribed picks another plan on the pricing page.
// Upgrades (a higher plan, or monthly -> yearly) happen here and now: the price on their subscription is swapped and
// any difference is charged straight away (nothing during a free trial). If that payment fails, nothing changes.
// Downgrades go to the billing portal, so they take effect at renewal.
const RANK = { basic: 1, pro: 2, elite: 3 };
async function switchPlan(existing, plan, interval, price) {
  const stripe = getStripe();
  if (!existing.stripe_subscription_id) return NextResponse.redirect(`${SITE_URL}/api/billing-portal`, { status: 303 });
  const sub = await stripe.subscriptions.retrieve(existing.stripe_subscription_id);
  const item = sub.items?.data?.[0];
  if (!item) return NextResponse.redirect(`${SITE_URL}/api/billing-portal`, { status: 303 });
  if (item.price?.id === price) return NextResponse.redirect(`${SITE_URL}/dashboard`, { status: 303 });
  const curPlan = planForPrice(item.price?.id), curYear = item.price?.recurring?.interval === "year";
  const up = (RANK[plan] || 0) > (RANK[curPlan] || 0) || (plan === curPlan && interval === "year" && !curYear);
  if (!up) return NextResponse.redirect(`${SITE_URL}/api/billing-portal`, { status: 303 });
  const updated = await stripe.subscriptions.update(sub.id, {
    items: [{ id: item.id, price }],
    proration_behavior: sub.status === "trialing" ? "none" : "always_invoice",
    payment_behavior: "pending_if_incomplete",
    cancel_at_period_end: false,
  });
  if (updated.pending_update) {
    return NextResponse.redirect(`${SITE_URL}/pricing?error=upgrade`, { status: 303 });
  }
  // The webhook will sync this too; update now so the new plan shows straight away.
  const admin = createAdminClient();
  await admin.from("subscriptions").update({ price_id: price, status: updated.status, cancel_at_period_end: false, updated_at: new Date().toISOString() }).eq("user_id", existing.user_id);
  return NextResponse.redirect(`${SITE_URL}/dashboard?upgraded=${encodeURIComponent(plan)}`, { status: 303 });
}
