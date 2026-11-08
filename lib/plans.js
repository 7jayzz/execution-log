export const TRIAL_DAYS = Number(process.env.TRIAL_DAYS || 7);

// Display prices. The amount actually charged comes from the Stripe price IDs.
export const PLANS = [
  { id: "basic", name: "Basic", price: "£12.99", per: "month", tagline: "Log every trade and finally see your real numbers.", accounts: 2 },
  { id: "pro", name: "Pro", price: "£24.99", per: "month", tagline: "Find out exactly what's making you money, and what's costing you.", best: true, accounts: Infinity },
  { id: "elite", name: "Elite", price: "£39.99", per: "month", tagline: "A personal AI coach, plus tools to test changes before you risk real money.", accounts: Infinity },
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
      ["Trade screenshots and attachments", L], ["Trade notes and execution grades", L], ["Notes page with 9 free templates", L], ["Basic risk management", L],
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
      ["Selected broker synchronisation", S], ["Advanced trade imports", L], ["Custom report builder", L], ["Custom trade fields", L],
      ["Advanced chart annotations", L], ["Extended screenshot storage", S], ["Advanced trade tagging", L],
    ] },
  ],
  elite: [
    { title: "AI Trading Coach", benefit: "A personal coach that reads your journal and tells you exactly what to fix next week.", items: [
      ["Personal AI trading assistant", L], ["AI trade reviews", L], ["AI-generated weekly reviews", L], ["AI-generated monthly reviews", L],
      ["Personalised improvement plans", L], ["AI behavioural analysis", L], ["AI psychology insights", L], ["Screenshot-based trade analysis", S],
      ["Ask questions about your trading history", L],
    ] },
    { title: "Trade Replay Lab", benefit: "Replay your trades candle by candle and see exactly where your entry and exit decisions went wrong.", items: [
      ["Historical trade replay", L], ["Interactive chart replay", L], ["Entry and exit decision reviews", L],
      ["Planned versus actual execution comparisons", L], ["Chart annotations", L], ["Saved replay sessions", S],
    ] },
    { title: "Backtesting Studio", benefit: "Test a change before you risk real money. See how a different stop, target or risk size would have played out.", items: [
      ["Historical strategy testing", S], ["Custom trading rules", S], ["Strategy simulations", L], ["Risk-to-reward simulations", L],
      ["Monte Carlo analysis", L], ["Strategy variation comparisons", L], ["Detailed backtesting reports", S],
    ] },
    { title: "Advanced account management", benefit: "See your total risk and results across every account at once, not one account at a time.", items: [
      ["Expanded broker synchronisation", S], ["Consolidated account analytics", L], ["Portfolio-wide risk monitoring", L],
      ["Cross-account strategy analysis", L], ["Advanced prop-firm RuleGuard", L], ["Advanced account reporting", L],
    ] },
    { title: "Premium", benefit: "One score for how well you execute, polished reports to share, and priority support when you need it.", items: [
      ["Advanced Execution Score", L], ["AI-generated performance reports", L], ["Advanced custom dashboards", S], ["Premium report exports", L],
      ["Higher AI usage allowances", L], ["Expanded data and screenshot storage", S], ["Priority customer support", L],
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
  ["Backtesting Studio", "—", "—", "✓"],
  ["Broker synchronisation", "—", "Selected", "Expanded"],
  ["Custom dashboards", "—", "✓", "✓"],
  ["Advanced reporting", "—", "✓", "✓"],
  ["Priority support", "—", "—", "✓"],
];
// Rows in the comparison table whose paid-tier features aren't built yet.
export const COMPARISON_SOON = new Set(["Broker synchronisation"]);

// Server only: map a plan to its Stripe price, and back.
export function priceIdFor(plan) {
  return { basic: process.env.STRIPE_PRICE_BASIC, pro: process.env.STRIPE_PRICE_PRO, elite: process.env.STRIPE_PRICE_ELITE }[plan] || null;
}
export function planForPrice(priceId) {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_BASIC) return "basic";
  if (priceId === process.env.STRIPE_PRICE_PRO) return "pro";
  if (priceId === process.env.STRIPE_PRICE_ELITE) return "elite";
  return null;
}
