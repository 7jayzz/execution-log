import { TRIAL_DAYS } from "@/lib/plans";

// Plain-English billing, free-trial and plan-change terms, shown under the plans.
export default function BillingTerms() {
  const d = TRIAL_DAYS;
  return (
    <div className="terms-grid">
      <div className="terms-card">
        <h3>How the free trial works</h3>
        <ul className="ticks">
          {d > 0 && <li><span>Every plan, monthly or annual, starts with a <b>{d}-day free trial</b>.</span></li>}
          <li><span>You add a card to start, but <b>you aren't charged until the trial ends</b>.</span></li>
          <li><span>Cancel before the trial ends and <b>you pay nothing</b>.</span></li>
          <li><span><b>One free trial per person and per card.</b> If you've subscribed before, or your card has already had a free trial, your plan starts straight away.</span></li>
        </ul>
      </div>
      <div className="terms-card">
        <h3>Monthly or annual?</h3>
        <ul className="ticks">
          <li><span><b>Monthly:</b> charged every month from the day your trial ends. Cancel any time.</span></li>
          <li><span><b>Annual:</b> one payment a year and <b>2 months free</b> compared with paying monthly.</span></li>
          <li><span>If you cancel, you keep access until the end of the period you've already paid for.</span></li>
        </ul>
      </div>
      <div className="terms-card">
        <h3>Changing your plan</h3>
        <ul className="ticks">
          <li><span><b>Upgrades start straight away</b>, like Basic to Pro or monthly to annual. You pay the difference for the rest of your current period today, worked out to the day.</span></li>
          <li><span><b>Downgrades start at your next renewal</b>, like Pro to Basic or annual to monthly. You keep your current plan until then, with no charge and no credit.</span></li>
          <li><span><b>During your free trial</b>, change as often as you like. Nothing is charged until the trial ends.</span></li>
          <li><span>Before you confirm a change, your billing page shows <b>when it starts and exactly what you'll pay</b>.</span></li>
        </ul>
      </div>
    </div>
  );
}
