import Link from "next/link";
import { PLANS, FEATURE_GROUPS, TRIAL_DAYS } from "@/lib/plans";
import { OpenOnDesktop } from "@/components/PlanExtras";

const Soon = () => <span className="soon">Coming soon</span>;

// mode: "signup" (links to sign-up) or "checkout" (posts to Stripe Checkout).
// current: the paid plan the visitor has, or null. signedIn: whether they already have a login.
export default function PlanCards({ mode = "signup", trial = true, current = null, locked = false, signedIn = false }) {
  // The date the first payment is taken if someone starts a trial today (UK time).
  const showTrial = (mode === "signup" || trial) && TRIAL_DAYS > 0;
  const chargeDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", timeZone: "Europe/London" }).format(new Date(Date.now() + TRIAL_DAYS * 864e5));
  return (
    <div className="billing-wrap">
    {/* Monthly / annual switch: pure CSS, so it works before any script loads. */}
    <input type="radio" name="billing" id="bill-m" className="bill-in" defaultChecked />
    <input type="radio" name="billing" id="bill-y" className="bill-in" />
    <div className="bill-switch" role="group" aria-label="Billing period">
      <label htmlFor="bill-m">Monthly</label>
      <label htmlFor="bill-y">Annual <span className="bill-save">Save 25%</span></label>
    </div>
    <div className="plans two">
      {PLANS.map((p) => {
        const isCurrent = p.free ? !current : current === p.id;
        const cta = current ? "Switch billing" : trial && TRIAL_DAYS ? `Start ${TRIAL_DAYS}-day free trial` : "Upgrade to Elite";
        return (
          <div key={p.id} className={`plan${p.best ? " best" : ""}${p.free ? " free" : ""}`}>
            {p.best && <span className="badge">Everything included</span>}
            <span className="label">{p.name}</span>
            {p.free ? (
              <div>
                <div className="price">£0<small> forever</small></div>
                <span className="price-note">No card needed.</span>
              </div>
            ) : (
              <>
                <div className="pm">
                  <div className="price">{p.price}<small> / month</small></div>
                  <span className="price-note">Billed monthly. Cancel any time.</span>
                </div>
                <div className="py">
                  <div className="price">{p.yearly}<small> / year</small></div>
                  <span className="price-note">That's {p.yearlyMonthly}/month, billed once a year. <b>Save {p.yearlySave}.</b></span>
                </div>
              </>
            )}
            <span className="hint">{p.tagline}</span>
            {p.free ? (
              signedIn ? (
                isCurrent ? <Link className="btn block" href="/dashboard">Open my journal</Link> : <span className="btn block" aria-disabled="true">Included</span>
              ) : (
                <Link className="btn block" href="/signup">Start free</Link>
              )
            ) : isCurrent ? (
              <span className="btn block" aria-disabled="true">Your plan</span>
            ) : mode === "checkout" ? (
              <form action="/api/checkout" method="post">
                <input type="hidden" name="plan" value={p.id} />
                <button className="btn block pm primary" type="submit" name="interval" value="month" disabled={locked}>{locked ? "Verify your phone first" : cta}</button>
                <button className="btn block py primary" type="submit" name="interval" value="year" disabled={locked}>{locked ? "Verify your phone first" : cta}</button>
              </form>
            ) : (
              <Link className="btn block primary" href={`/signup?plan=${p.id}`}>{cta}</Link>
            )}
            {!p.free && showTrial && !isCurrent && (
              <p className="trial-line">
                <b>£0 today.</b>{" "}
                <span className="pm">Then {p.price}/month from {chargeDate}.</span>
                <span className="py">Then {p.yearly}/year from {chargeDate}.</span>{" "}
                Cancel before then and you pay nothing.
              </p>
            )}
            {FEATURE_GROUPS[p.id].map((g) => (
              <details className="fgroup" key={g.title}>
                <summary>
                  <span className="fg-head"><span className="label">{g.title}</span><span className="fg-count">{g.items.length} features</span></span>
                  {g.benefit && <p className="fbenefit">{g.benefit}</p>}
                </summary>
                <ul className="ticks">
                  {g.items.map(([f, live]) => <li key={f} className={live ? "" : "later"}><span>{f}{!live && <Soon />}</span></li>)}
                </ul>
              </details>
            ))}
          </div>
        );
      })}
    </div>
    <OpenOnDesktop />
    </div>
  );
}
