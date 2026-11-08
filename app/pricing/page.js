import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import BillingTerms from "@/components/BillingTerms";
import PlanCards from "@/components/PlanCards";
import PhoneVerify from "@/components/PhoneVerify";
import { PHONE_VERIFY } from "@/lib/site";
import CompareTable from "@/components/CompareTable";
import { createClient } from "@/lib/supabase/server";
import { getSubscription, isActive } from "@/lib/subscription";
import { planForPrice } from "@/lib/plans";
import { TRIAL_DAYS } from "@/lib/plans";

export const metadata = { title: "Pricing" };
export const dynamic = "force-dynamic";

export default async function Pricing({ searchParams }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const sub = user ? await getSubscription(supabase, user.id) : null;
  const active = isActive(sub);
  const trial = !sub?.stripe_subscription_id;
  const current = active ? planForPrice(sub.price_id) : null;
  const needPhone = PHONE_VERIFY && !!user && trial && !active && !user.phone_confirmed_at;
  return (
    <div className="glow">
      <div className="site" style={{ gap: 40 }}>
        <SiteNav user={user} />
        <section className="section">
          <h1 className="h1" style={{ fontSize: "clamp(44px,7vw,80px)" }}>{active ? <>Change your <em>plan</em></> : <>Pick your <em>plan</em></>}</h1>
          <p className="sub">
            {active
              ? "Move up or down a plan any time from Manage billing. Upgrades start straight away; downgrades start at your next renewal."
              : user
              ? trial && TRIAL_DAYS ? `Your journal is ready. Start your ${TRIAL_DAYS}-day free trial to open it. You won't be charged until the trial ends, and you can cancel any time.` : "Choose a plan to open your journal."
              : `${TRIAL_DAYS ? `Try any plan free for ${TRIAL_DAYS} days. ` : ""}Features marked "Coming soon" unlock on your plan as they launch.`}
          </p>
          {searchParams?.checkout === "cancelled" && <div className="box info">Checkout was cancelled. Pick a plan when you're ready.</div>}
          {searchParams?.error === "checkout" && <div className="box bad">Checkout couldn't start just now. Please try again in a moment.</div>}
          {searchParams?.error === "phone" && <div className="box bad">Please verify your mobile number to start your free trial.</div>}
          {needPhone && <PhoneVerify />}
          {searchParams?.error === "plan" && <div className="box bad">That plan isn't available. Please pick one of the plans below.</div>}
          {active && <div className="ctas"><Link href="/dashboard" className="btn primary big">Open my dashboard</Link><a href="/api/billing-portal" className="btn big">Manage billing</a></div>}
          <PlanCards mode={user ? "checkout" : "signup"} trial={trial && !active} current={current} locked={needPhone} />
          <BillingTerms />
          <CompareTable />
          <p className="hint">Payments are handled securely by Stripe.</p>
        </section>
        <SiteFooter />
      </div>
    </div>
  );
}
