import { TRIAL_DAYS } from "@/lib/plans";

// Plain-English billing and free-trial terms, shown under the plans.
export default function BillingTerms() {
  const d = TRIAL_DAYS;
  return (
    <div className="terms-grid">
      <div className="terms-card">
        <h3>How the free trial works</h3>
        <ul className="ticks">
          {d > 0 && <li><span>Every plan, monthly or annual, starts with a <b>{d}-day free trial</b>.</span></li>}
          <li><span>You add a card to start, but <b>you aren't charged until day {d || 1}</b>.</span></li>
          <li><span>Cancel before the trial ends and <b>you pay nothing</b>.</span></li>
          <li><span>One free trial per person. If you've subscribed before, your plan starts straight away.</span></li>
        </ul>
      </div>
      <div className="terms-card">
        <h3>Monthly or annual?</h3>
        <ul className="ticks">
          <li><span><b>Monthly:</b> charged every month on the day your trial ends. Cancel any time.</span></li>
          <li><span><b>Annual:</b> one payment a year and <b>2 months free</b> compared with paying monthly.</span></li>
          <li><span>Switch plans or billing period any time from <b>Manage billing</b>. Stripe works out the difference automatically.</span></li>
          <li><span>If you cancel, you keep access until the end of the period you've paid for.</span></li>
        </ul>
      </div>
    </div>
  );
}
