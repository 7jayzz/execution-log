export const TRIAL_DAYS = Number(process.env.TRIAL_DAYS || 7);

// Display prices. The amount actually charged comes from the Stripe price IDs.
// Two plans: Basic and Elite. Older Pro subscriptions still map below and keep their Pro features.
export const PLANS = [
  { id: "basic", name: "Basic", price: "£12.99", per: "month", yearly: "£129.90", yearlyMonthly: "£10.83", yearlySave: "£25.98", tagline: "Log every trade and finally see your real numbers.", accounts: 2 },
  { id: "elite", name: "Elite", price: "£24.99", per: "month", yearly: "£219", yearlyMonthly: "£18.25", yearlySave: "£80.88", tagline: "Everything included: advanced analytics, prop-firm tools, unlimited Trade Replay and Practice trading, and your AI coach.", best: true, accounts: Infinity },
];
export const PRICE_FROM = "£12.99";
export const TIER_RANK = { basic: 1, pro: 2, elite: 3 };

// live: true = in the journal today. false = shown as "Coming soon" (never sell a feature as ready before it is).
const L = true, S = false;
export const FEATURE_GROUPS = {
  basic: [
    { title: "Everyday journal", benefit: "Every trade in one place. Log it in seconds or import straight from MT4 and MT5, and see your whole account on one screen.", items: [
      ["Unlimited trade logging", L], ["Two active trading accounts", L], ["CSV, MT4 and MT5 imports", L],
      ["Trading dashboard", L], ["Trading calendar", L], ["Equity and balance charts", L],
    ] },
    { title: "Core analytics", benefit: "Know your real numbers: whether your wins actually pay for your losses, and what each trade is worth on average.", items: [
      ["Win rate and profit factor", L], ["Average win and average loss", L], ["R-multiple and expectancy", L],
      ["Daily, weekly and monthly P&L", L], ["Basic strategy tracking", L], ["Basic prop-firm tracking", L],
    ] },
    { title: "Discipline and review", benefit: "Catch the moods, mistakes and broken rules that cost you money, and review each day before you trade the next.", items: [
      ["Financial and performance goals", L], ["Trading discipline tracking", L], ["Psychology tracking", L],
      ["Trade screenshots (250 MB storage)", L], ["Trade notes and execution grades", L], ["Notes page with 9 free templates", L],
      ["PDF and CSV reports", L], ["Dark and light themes, custom accent colours", L], ["Trade Replay: 1 trade a week", L], ["Practice trading: 1 session a week", L], ["AI coach: 3 replies a month to try it", L],
    ] },
  ],
  elite: [
    { title: "Everyday journal", benefit: "Every trade in one place. Log it in seconds or import straight from MT4 and MT5, and see your whole account on one screen.", items: [
      ["Unlimited trade logging", L], ["Unlimited trading accounts", L], ["CSV, MT4 and MT5 imports", L],
      ["Trading dashboard and calendar", L], ["Equity and balance charts", L], ["Trade screenshots (10 GB storage)", L],
      ["Trade notes and execution grades", L], ["Notes page with 9 free templates", L], ["PDF and CSV reports", L], ["Dark and light themes, custom accent colours", L],
    ] },
    { title: "Analytics", benefit: "Know your real numbers, and find which sessions, setups and instruments are making you money and which are draining it.", items: [
      ["Win rate, profit factor, R-multiple and expectancy", L], ["Average win and average loss", L], ["Daily, weekly and monthly P&L", L],
      ["Custom performance dashboards", L], ["MAE/MFE and entry and exit efficiency", L], ["Session, timeframe and instrument comparisons", L],
      ["Drawdown and expectancy analysis", L], ["Strategy tracking and comparison", L], ["Performance by market conditions", L],
    ] },
    { title: "Discipline and psychology", benefit: "Catch the moods, mistakes and broken rules that cost you money. Revenge trades, FOMO and overtrading are spotted for you.", items: [
      ["Goals and discipline tracking", L], ["Psychology tracking", L], ["Automatic trading pattern detection", L],
      ["Behavioural analysis and costly-habit reports", L], ["Weekly performance insights", L], ["Advanced Execution Score", L],
    ] },
    { title: "Prop-firm tools", benefit: "Protect your funded accounts. Get warned before you break a daily-loss or drawdown rule, across every challenge.", items: [
      ["Challenge and funded account tracking", L], ["RuleGuard warnings", L], ["Drawdown monitoring", L],
      ["Challenge reports and cross-account comparisons", L], ["Portfolio-wide risk monitoring", L],
    ] },
    { title: "AI Trading Coach", benefit: "A personal coach that reads your journal and helps you work out what to improve next week.", items: [
      ["Ask questions about your trading history", L], ["AI trade reviews and screenshot analysis", L], ["AI weekly and monthly reviews", L],
      ["Personalised improvement plans", L], ["AI behavioural and psychology insights", L], ["100 coach replies a month", L],
    ] },
    { title: "Trade Replay and Practice trading", benefit: "Replay your trades candle by candle, and practise on any past day with the future hidden, before you risk real money.", items: [
      ["Unlimited Trade Replay", L], ["Unlimited practice trading on any past date", L], ["Drawing tools, partial take-profits and draggable stops", L],
      ["Saved replay and practice sessions", L], ["Risk-to-reward simulations and Monte Carlo analysis", L], ["Strategy backtests on your real trades", L],
    ] },
  ],
};

export const COMPARISON = [];
// Rows in the comparison table whose paid-tier features aren't built yet.
export const COMPARISON_SOON = new Set([]);

// Server only: map the plan to its Stripe price, and back.
// Price IDs aren't secret, so both sets live here and the right one is picked from the Stripe key in use
// (sk_live_/rk_live_ = live). This avoids checkout breaking because a price env var was mistyped or left on test.
// The one plan people buy today (internally "elite", so every feature is unlocked).
const CURRENT = {
  live: { month: { basic: "price_1UavhWGssBrlVvAFi1Xfjg7D", elite: "price_1UcugrGssBrlVvAF2Tt1PcWf" }, year: { basic: "price_1UavhWGssBrlVvAFsLSQnyKr", elite: "price_1UcugrGssBrlVvAFJqqhFcYF" } },
  test: { month: { basic: "price_1UZAbVGssBrlVvAFM0fGMlLq", elite: "price_1UcuTDGssBrlVvAFJIOe3kWH" }, year: { basic: "price_1UZUuQGssBrlVvAFpFZavHzv", elite: "price_1UcuTFGssBrlVvAF6GIoGKzN" } },
};
// The £19.99 / £179 test prices from the one-price draft (never sold live).
// The £10.99 / £99 Basic prices (live 17–21 Nov 2026), still recognised as Basic.
const BASIC_1099 = ["price_1UcueRGssBrlVvAFol8YLlKq", "price_1UcueRGssBrlVvAF4xAERdJJ", "price_1UcuTIGssBrlVvAFRRV7xxXJ", "price_1UcuTKGssBrlVvAF9ue6V6Gh"];
const DRAFT = ["price_1UcE9vGssBrlVvAFKtLHhicE", "price_1UcE9xGssBrlVvAFQZhhOOzs"];
// Older Basic / Pro / Elite prices. Never sold any more, but kept so existing subscriptions are still recognised.
const LEGACY = {
  live: {
    month: { basic: "price_1UavhWGssBrlVvAFi1Xfjg7D", pro: "price_1UavhNGssBrlVvAFPf5g55wc", elite: "price_1UavhFGssBrlVvAFXyDg7eIS" },
    year: { basic: "price_1UavhWGssBrlVvAFsLSQnyKr", pro: "price_1UavhNGssBrlVvAF89ifBNg5", elite: "price_1UavhEGssBrlVvAFtJEEVOYm" },
  },
  test: {
    month: { basic: "price_1UZAbVGssBrlVvAFM0fGMlLq", pro: "price_1UZAbVGssBrlVvAF8P6FokFR", elite: "price_1UZAbWGssBrlVvAFz6sVQtaI" },
    year: { basic: "price_1UZUuQGssBrlVvAFpFZavHzv", pro: "price_1UZUuSGssBrlVvAFylk35C6f", elite: "price_1UZUuUGssBrlVvAFNxdEfds2" },
  },
};
export const stripeMode = () => (/^(sk|rk)_live_/.test(String(process.env.STRIPE_SECRET_KEY || "").trim()) ? "live" : "test");
export function priceIdFor(plan, interval = "month") {
  const id = CURRENT[stripeMode()][interval === "year" ? "year" : "month"][plan];
  return /^price_/.test(id || "") ? id : null;
}
export function planForPrice(priceId) {
  if (!priceId) return null;
  for (const mode of Object.values(CURRENT)) for (const byPlan of Object.values(mode)) for (const [plan, id] of Object.entries(byPlan)) if (id === priceId) return plan;
  if (BASIC_1099.includes(priceId)) return "basic";
  if (DRAFT.includes(priceId)) return "elite";
  for (const mode of Object.values(LEGACY)) for (const byPlan of Object.values(mode)) for (const [plan, id] of Object.entries(byPlan)) if (id === priceId) return plan;
  // Older env-var prices, in case any subscription was created with them.
  const env = { basic: [process.env.STRIPE_PRICE_BASIC, process.env.STRIPE_PRICE_BASIC_YEARLY], pro: [process.env.STRIPE_PRICE_PRO, process.env.STRIPE_PRICE_PRO_YEARLY], elite: [process.env.STRIPE_PRICE_ELITE, process.env.STRIPE_PRICE_ELITE_YEARLY] };
  for (const [plan, ids] of Object.entries(env)) if (ids.includes(priceId)) return plan;
  return null;
}
