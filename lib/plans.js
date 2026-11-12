export const TRIAL_DAYS = Number(process.env.TRIAL_DAYS || 7);

// Display prices. The amount actually charged comes from the Stripe price IDs.
export const PLANS = [
  { id: "basic", name: "Basic", price: "£12.99", per: "month", yearly: "£129.90", yearlyMonthly: "£10.83", yearlySave: "£25.98", tagline: "Log every trade and finally see your real numbers.", accounts: 2 },
  { id: "pro", name: "Pro", price: "£24.99", per: "month", yearly: "£249.90", yearlyMonthly: "£20.83", yearlySave: "£49.98", pick: "The best fit for most traders.", tagline: "See what's making you money, and what's costing you.", best: true, accounts: Infinity },
  { id: "elite", name: "Elite", price: "£39.99", per: "month", yearly: "£399.90", yearlyMonthly: "£33.33", yearlySave: "£79.98", tagline: "A personal AI coach, plus tools to test changes before you risk real money.", accounts: Infinity },
];
export const TIER_RANK = { basic: 1, pro: 2, elite: 3 };

// live: true = in the journal today. false = shown as "Coming soon" (never sell a feature as ready before it is).
const L = true, S = false;
export const FEATURE_GROUPS = {
  basic: [
    { title: "Everyday journal", benefit: "Every trade in one place. Log it in seconds or import straight from MT4 and MT5, and see your whole account on one screen.", items: [
      ["Unlimited manual trade logging", L], ["Two active trading accounts", L], ["CSV, MT4 and MT5 imports", L],
      ["Trading dashboard", L], ["Trading calendar", L], ["Equity and balance charts", L],
    ] },
    { title: "Core analytics", benefit: "Know your real numbers: whether your wins actually pay for your losses, and what each trade is worth on average.", items: [
      ["Win rate and profit factor", L], ["Average win and average loss", L], ["R-multiple and expectancy", L],
      ["Daily, weekly and monthly P&L", L], ["Basic strategy tracking", L], ["Basic prop-firm tracking", L],
    ] },
    { title: "Discipline and review", benefit: "Catch the moods, mistakes and broken rules that cost you money, and review each day before you trade the next.", items: [
      ["Financial and performance goals", L], ["Trading discipline tracking", L], ["Psychology tracking", L],
      ["Trade screenshots (250 MB storage)", L], ["Trade notes and execution grades", L], ["Notes page with 9 free templates", L], ["Basic risk management", L],
      ["PDF and CSV reports", L], ["Dark and light themes", L], ["Custom accent colours", L],
    ] },
  ],
  pro: [
    { title: "Advanced analytics", benefit: "Discover which sessions, setups and instruments are actually making you money, and which are quietly draining it.", items: [
      ["Custom performance dashboards", L], ["Advanced performance statistics", L], ["MAE/MFE analysis", L], ["Entry and exit efficiency", L],
      ["Session performance comparisons", L], ["Timeframe performance comparisons", L], ["Instrument performance comparisons", L],
      ["Advanced drawdown analysis", L], ["Advanced expectancy analysis", L],
    ] },
    { title: "Strategy intelligence", benefit: "Find out which strategy really has an edge, so you trade more of what works and drop what doesn't.", items: [
      ["Unlimited strategy tracking", L], ["Strategy comparison", L], ["Setup-specific performance", L], ["Strategy expectancy", L],
      ["Performance by market conditions", L], ["Advanced strategy filtering", L],
      ["Custom strategy backtesting (5 tests a week)", L], ["Backtest costs, breakevens, trailing stops and partials", L],
    ] },
    { title: "Prop-firm management", benefit: "Protect your funded accounts. Get warned before you break a daily-loss or drawdown rule, across every challenge.", items: [
      ["Unlimited active accounts", L], ["Multiple challenge tracking", L], ["Funded account management", L], ["Advanced drawdown monitoring", L],
      ["RuleGuard warnings", L], ["Challenge performance reports", L], ["Cross-account comparisons", L],
    ] },
    { title: "Execution intelligence", benefit: "See the habits costing you money, like revenge trades, FOMO entries and overtrading, spotted for you automatically.", items: [
      ["Automatic trading pattern detection", L], ["Behavioural analysis", L], ["Weekly performance insights", L], ["Discipline trend analysis", L],
      ["Identification of costly trading habits", L], ["Advanced psychology reports", L],
    ] },
    { title: "Additional tools", benefit: "Make the journal fit how you trade, with your own fields, tags, chart notes and reports you can share.", items: [
      ["Advanced trade imports", L], ["Custom report builder", L], ["Custom trade fields", L],
      ["Advanced chart annotations", L], ["Extended screenshot storage (2 GB)", L], ["Advanced trade tagging", L],
    ] },
  ],
  elite: [
    { title: "AI Trading Coach", benefit: "A personal coach that reads your journal and helps you identify what to improve next week.", items: [
      ["Personal AI trading assistant", L], ["AI trade reviews", L], ["AI-generated weekly reviews", L], ["AI-generated monthly reviews", L],
      ["Personalised improvement plans", L], ["AI behavioural analysis", L], ["AI psychology insights", L], ["Screenshot-based trade analysis", L],
      ["Ask questions about your trading history", L],
    ] },
    { title: "Trade Replay Lab", benefit: "Replay your trades candle by candle and see where your entry and exit decisions could improve.", items: [
      ["Historical trade replay", L], ["Interactive chart replay", L], ["Entry and exit decision reviews", L],
      ["Planned versus actual execution comparisons", L], ["Chart annotations", L], ["Saved replay sessions", L],
    ] },
    { title: "Backtesting Studio", benefit: "Test a strategy before you risk real money: automatically on months of data, or by hand, trading any past day candle by candle.", items: [
      ["Unlimited historical strategy testing", L], ["Custom trading rules with 20+ indicators", L], ["Higher-timeframe filters", L], ["Strategy optimiser with unseen-data check", L],
      ["Practice trading on any past date", L], ["Strategy simulations", L], ["Risk-to-reward simulations", L],
      ["Monte Carlo analysis", L], ["Strategy variation comparisons", L], ["Detailed backtesting reports", L],
    ] },
    { title: "Advanced account management", benefit: "See your total risk and results across every account at once, not one account at a time.", items: [
      ["Consolidated account analytics", L], ["Portfolio-wide risk monitoring", L],
      ["Cross-account strategy analysis", L], ["Advanced prop-firm RuleGuard", L], ["Advanced account reporting", L],
    ] },
    { title: "Premium", benefit: "One score for how well you execute, polished reports to share, and priority support when you need it.", items: [
      ["Advanced Execution Score", L], ["AI-generated performance reports", L], ["Advanced custom dashboards (saved layouts)", L], ["Premium report exports", L],
      ["Higher AI usage allowances", L], ["Expanded screenshot storage (10 GB)", L], ["Priority customer support", L],
    ] },
  ],
};

export const COMPARISON = [
  ["Trade journal", "✓", "✓", "✓"],
  ["Core analytics", "✓", "✓", "✓"],
  ["Active trading accounts", "2", "Unlimited", "Unlimited"],
  ["Strategy tracking", "Basic", "Advanced", "Advanced"],
  ["Psychology tracking", "✓", "✓", "✓"],
  ["Prop-firm tracking", "Basic", "Advanced", "Advanced"],
  ["Execution Intelligence", "—", "✓", "Advanced"],
  ["AI Trading Coach", "—", "—", "✓"],
  ["Trade Replay", "—", "—", "✓"],
  ["Strategy backtester", "—", "5 tests a week", "Unlimited"],
  ["Practice trading and optimiser", "—", "—", "✓"],
  ["Custom dashboards", "—", "✓", "✓"],
  ["Screenshot storage", "250 MB", "2 GB", "10 GB"],
  ["Advanced reporting", "—", "✓", "✓"],
  ["Priority support", "—", "—", "✓"],
];
// Rows in the comparison table whose paid-tier features aren't built yet.
export const COMPARISON_SOON = new Set([]);

// Server only: map a plan to its Stripe price, and back.
// Price IDs aren't secret, so both sets live here and the right one is picked from the Stripe key in use
// (sk_live_/rk_live_ = live). This avoids checkout breaking because a price env var was mistyped or left on test.
const PRICES = {
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
  return PRICES[stripeMode()][interval === "year" ? "year" : "month"][plan] || null;
}
export function planForPrice(priceId) {
  if (!priceId) return null;
  for (const mode of Object.values(PRICES)) for (const byPlan of Object.values(mode)) for (const [plan, id] of Object.entries(byPlan)) if (id === priceId) return plan;
  // Older env-var prices, in case any subscription was created with them.
  const env = { basic: [process.env.STRIPE_PRICE_BASIC, process.env.STRIPE_PRICE_BASIC_YEARLY], pro: [process.env.STRIPE_PRICE_PRO, process.env.STRIPE_PRICE_PRO_YEARLY], elite: [process.env.STRIPE_PRICE_ELITE, process.env.STRIPE_PRICE_ELITE_YEARLY] };
  for (const [plan, ids] of Object.entries(env)) if (ids.includes(priceId)) return plan;
  return null;
}
