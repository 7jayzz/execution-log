import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

async function openPortal() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${SITE_URL}/login?next=/dashboard`, { status: 303 });
  const { data: sub } = await supabase.from("subscriptions").select("stripe_customer_id").eq("user_id", user.id).maybeSingle();
  if (!sub?.stripe_customer_id) return NextResponse.redirect(`${SITE_URL}/pricing`, { status: 303 });
  const session = await getStripe().billingPortal.sessions.create({ customer: sub.stripe_customer_id, return_url: `${SITE_URL}/dashboard` });
  return NextResponse.redirect(session.url, { status: 303 });
}

export const GET = openPortal;
export const POST = openPortal;
