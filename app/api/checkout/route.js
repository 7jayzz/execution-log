import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { priceIdFor, TRIAL_DAYS } from "@/lib/plans";
import { isActive } from "@/lib/subscription";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    return await startCheckout(request);
  } catch (e) {
    console.error("Checkout failed", e);
    return NextResponse.redirect(`${SITE_URL}/pricing?error=checkout`, { status: 303 });
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
  if (isActive(existing)) return NextResponse.redirect(`${SITE_URL}/api/billing-portal`, { status: 303 });

  const stripe = getStripe();
  let customer = existing?.stripe_customer_id;
  if (!customer) {
    const c = await stripe.customers.create({ email: user.email, metadata: { user_id: user.id } });
    customer = c.id;
    await admin.from("subscriptions").upsert({ user_id: user.id, stripe_customer_id: customer, status: "incomplete" }, { onConflict: "user_id" });
  }

  // One free trial per person: no trial if they've subscribed before.
  const hadSubscription = !!existing?.stripe_subscription_id;
  const offerTrial = !hadSubscription && TRIAL_DAYS > 0;
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
