import { TRIAL_DAYS } from "@/lib/plans";

// Plain-English billing, free-trial and billing-switch terms, shown under the plan.
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
          <li><span><b>One free trial per person and per card.</b> Not available on prepaid cards. If you've subscribed before, your card has already had a free trial, or you pay with a prepaid card, your plan starts straight away.</span></li>
        </ul>
      </div>
      <div className="terms-card">
        <h3>Monthly or annual?</h3>
        <ul className="ticks">
          <li><span><b>Monthly:</b> charged every month from the day your trial ends. Cancel any time.</span></li>
          <li><span><b>Annual:</b> one payment a year. Basic is £129.90 instead of £155.88 (save £25.98), and Elite is £219 instead of £299.88 (save £80.88).</span></li>
          <li><span>If you cancel, you keep access until the end of the period you've already paid for.</span></li>
        </ul>
      </div>
      <div className="terms-card">
        <h3>Changing your plan</h3>
        <ul className="ticks">
          <li><span><b>Upgrading from Basic to Elite starts straight away.</b> You pay the difference for the rest of your current period today, worked out to the day.</span></li>
          <li><span><b>Moving down from Elite to Basic starts at your next renewal.</b> You keep Elite until then.</span></li>
          <li><span><b>Monthly to annual starts straight away.</b> You pay the difference for the rest of your current month today, worked out to the day.</span></li>
          <li><span><b>Annual to monthly starts at your next renewal.</b> You keep annual billing until then, with no charge and no credit.</span></li>
          <li><span><b>During your free trial</b>, switch as often as you like. Nothing is charged until the trial ends.</span></li>
          <li><span>Before you confirm a switch, your billing page shows <b>when it starts and exactly what you'll pay</b>.</span></li>
        </ul>
      </div>
    </div>
  );
}
