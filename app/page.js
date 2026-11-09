import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import BillingTerms from "@/components/BillingTerms";
import { FOUNDER } from "@/lib/site";
import { StickyPlansBar } from "@/components/PlanExtras";
import PlanCards from "@/components/PlanCards";
import CompareTable from "@/components/CompareTable";
import { createClient } from "@/lib/supabase/server";
import { TRIAL_DAYS } from "@/lib/plans";

const FEATURES = [
  ["Never over-risk a trade again", "Enter your balance and risk %, and get the exact lot size for gold, indices, forex and crypto.", <path key="a" d="M4 20V10M10 20V4M16 20v-7M22 20H2" />],
  ["Numbers you can trust", "Commission, swaps and broker profit are included, so your P&L matches your MT5 account.", <path key="b" d="M4 7h16M4 12h16M4 17h10" />],
  ["See your month at a glance", "Every day's P&L on one calendar. Tap a day to see what went right, or what went wrong.", <g key="c"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></g>],
  ["Stop breaking your own rules", "Profit targets and loss limits that warn you in time, plus checks that flag FOMO and revenge trades.", <g key="d"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></g>],
  ["Manage live trades calmly", "See a running trade's floating P&L and exactly how far it is from your stop and your target.", <g key="e"><path d="M3 17l5-5 4 4 8-8" /><path d="M15 8h5v5" /></g>],
  ["Walk into every session with a plan", "Pre-market plans, checklists, and daily and weekly reviews that fill in your real numbers for you.", <g key="f"><path d="M6 3h9l4 4v14H6z" /><path d="M14 3v5h5M9 12h7M9 16h7" /></g>],
];

function Preview() {
  const pts = [8, 14, 11, 19, 17, 26, 23, 31, 28, 37, 35, 44, 41, 52];
  const W = 300, H = 110;
  const d = pts.map((v, i) => `${i ? "L" : "M"}${((i / (pts.length - 1)) * W).toFixed(1)},${(H - (v / 56) * H).toFixed(1)}`).join(" ");
  const days = [1, 1, -1, 0, 1, 1, 0, -1, 1, 1, 0, 1, -1, 1];
  return (
    <div className="prev" aria-hidden="true">
      <span className="tag">Example</span>
      <div className="prev-top">
        <div><span className="label">Balance</span><b className="num">£10,850.40</b><span className="num pos">+8.50%</span></div>
        <div className="prev-stats">
          <div><span className="label">Win rate</span><b className="num" style={{ display: "block" }}>62%</b></div>
          <div><span className="label">Avg R</span><b className="num pos" style={{ display: "block" }}>+0.84R</b></div>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="curve"><path className="ar" d={`${d} L${W},${H} L0,${H} Z`} /><path className="ln" d={d} /></svg>
      <div className="tape"><span className="dot" /><b>XAUUSD</b><span className="pill pos">BUY</span><span className="num muted">0.50 lots</span><b className="num pos" style={{ marginLeft: "auto" }}>+£472.50</b></div>
      <div className="cal">{days.map((v, i) => <i key={i} className={v > 0 ? "w" : v < 0 ? "l" : ""} />)}</div>
    </div>
  );
}

export default async function Home({ searchParams }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <div className="glow">
      <div className="site">
        <SiteNav user={user} />
        {searchParams?.deleted === "1" && !user && (
          <div className="box good" role="status">Your account and all your data have been deleted, and your subscription is cancelled. Thanks for trying The Execution Log.</div>
        )}
        <section className="hero">
          <div className="hero-copy">
            <span className="kicker">The trading journal for prop and retail traders</span>
            <h1 className="h1">Every trade.<br /><em>Every lesson.</em></h1>
            <p className="sub">Log trades with real lot sizes and MT5-matched costs, find where your edge is, and hold yourself to the rules that keep your account alive.</p>
            <div className="ctas">
              {user ? (
                <Link href="/dashboard" className="btn primary big">Open my dashboard</Link>
              ) : (
                <>
                  <Link href="/signup" className="btn primary big">Start your journal</Link>
                  <Link href="/login" className="btn big">Log in</Link>
                </>
              )}
            </div>
            {!user && TRIAL_DAYS > 0 && <span className="trial-note">{TRIAL_DAYS}-day free trial. Cancel any time.</span>}
          </div>
          <Preview />
        </section>
        <section className="why" aria-labelledby="why-title">
          <div className="why-lead">
            <span className="kicker">Why The Execution Log exists</span>
            <h2 className="h2" id="why-title">Trading isn't just about making money. It's about understanding <em>how you make decisions.</em></h2>
          </div>
          <div className="why-body">
            <p>Every entry, every exit, every mistake and every winning trade tells a story. Most traders never get to read it, because the lessons end up scattered across screenshots, spreadsheets and memory.</p>
            <p>The Execution Log brings those details together in one place, so you can spot the patterns behind your results, improve your execution and become a more disciplined trader.</p>
            <ol className="why-steps">
              <li><b>Record</b><span>Every trade, with the context behind it: your plan, your mood, your mistakes.</span></li>
              <li><b>Recognise</b><span>The patterns in your decisions that you can't see one trade at a time.</span></li>
              <li><b>Refine</b><span>Turn what you've learned into better trading habits.</span></li>
            </ol>
            <p className="why-close">Your trades already tell the story. We help you read it.</p>
          </div>
        </section>
        <section className="section">
          <h2 className="h2">Built for how you actually trade</h2>
          <div className="grid3">
            {FEATURES.map(([title, text, icon]) => (
              <article className="card" key={title}>
                <svg viewBox="0 0 24 24" className="ic">{icon}</svg>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="founder" aria-labelledby="founder-title">
          <div className="founder-media">
            {FOUNDER.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={FOUNDER.photo} alt="The founder of The Execution Log" width="240" height="240" />
            ) : (
              <svg viewBox="0 0 40 40" aria-hidden="true"><rect x="1" y="1" width="38" height="38" rx="9" fill="#F4B53F" /><line x1="13" y1="8" x2="13" y2="31" stroke="#1A1204" strokeWidth="2" /><rect x="9" y="14" width="8" height="11" rx="1.5" fill="#1A1204" /><line x1="27" y1="10" x2="27" y2="33" stroke="#1A1204" strokeWidth="2" /><rect x="23" y="17" width="8" height="10" rx="1.5" fill="#F4B53F" stroke="#1A1204" strokeWidth="2" /></svg>
            )}
          </div>
          <div className="founder-copy">
            <span className="kicker">The founder</span>
            <h2 className="h2" id="founder-title">Built by a trader. <em>Designed for traders.</em></h2>
            <p>The Execution Log was created from a simple belief: improving as a trader starts with understanding your own decisions.</p>
            <p>It's built by a trader documenting the journey, for traders committed to improving theirs.</p>
            {FOUNDER.tiktok && (
              <a className="btn" href={FOUNDER.tiktok} target="_blank" rel="noopener noreferrer">Follow the journey on TikTok →</a>
            )}
          </div>
        </section>
        <section className="section" id="pricing">
          <h2 className="h2">Pick your plan</h2>
          <p className="sub">Every plan starts with a {TRIAL_DAYS}-day free trial. Features marked "Coming soon" are on the way and unlock on your plan as they launch.</p>
          <PlanCards mode={user ? "checkout" : "signup"} />
          <BillingTerms />
          <CompareTable />
        </section>
        <section className="band">
          <h2 className="h2">Your next 100 trades deserve a record.</h2>
          <Link href={user ? "/dashboard" : "/signup"} className="btn primary big">{user ? "Open my dashboard" : "Start your journal"}</Link>
        </section>
        <StickyPlansBar from="£12.99" trialDays={TRIAL_DAYS} />
        <SiteFooter />
      </div>
    </div>
  );
}
