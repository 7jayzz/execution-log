import Link from "next/link";
import { PLANS, FEATURE_GROUPS, TRIAL_DAYS } from "@/lib/plans";

const Soon = () => <span className="soon">Coming soon</span>;

// mode: "signup" (links to sign-up) or "checkout" (posts to Stripe Checkout)
export default function PlanCards({ mode = "signup", trial = true, current = null }) {
  return (
    <div className="plans">
      {PLANS.map((p, idx) => {
        const cta = trial && TRIAL_DAYS ? `Start ${TRIAL_DAYS}-day free trial` : `Choose ${p.name}`;
        return (
          <div key={p.id} className={`plan${p.best ? " best" : ""}`}>
            {p.best && <span className="badge">Most popular</span>}
            <span className="label">{p.name}</span>
            <div className="price">{p.price}<small> / {p.per}</small></div>
            <span className="hint">{p.tagline}</span>
            {current === p.id ? (
              <span className="btn block" aria-disabled="true">Your plan</span>
            ) : mode === "checkout" ? (
              <form action="/api/checkout" method="post">
                <input type="hidden" name="plan" value={p.id} />
                <button className={`btn block ${p.best ? "primary" : ""}`} type="submit">{cta}</button>
              </form>
            ) : (
              <Link className={`btn block ${p.best ? "primary" : ""}`} href={`/signup?plan=${p.id}`}>{cta}</Link>
            )}
            {idx > 0 && <span className="plus">Everything in {PLANS[idx - 1].name}, plus:</span>}
            {FEATURE_GROUPS[p.id].map((g) => (
              <div className="fgroup" key={g.title}>
                <span className="label">{g.title}</span>
                {g.benefit && <p className="fbenefit">{g.benefit}</p>}
                <ul className="ticks">
                  {g.items.map(([f, live]) => <li key={f} className={live ? "" : "later"}><span>{f}{!live && <Soon />}</span></li>)}
                </ul>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
