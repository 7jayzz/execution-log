export const TRIAL_DAYS = Number(process.env.TRIAL_DAYS || 7);

// Display prices. The amount actually charged comes from the Stripe price IDs.
export const PLANS = [
  { id: "basic", name: "Basic", price: "£12.99", per: "month", tagline: "Complete everyday trading journal.", accounts: 2 },
  { id: "pro", name: "Pro", price: "£24.99", per: "month", tagline: "Advanced analytics and trading performance management.", best: true, accounts: Infinity },
  { id: "elite", name: "Elite", price: "£39.99", per: "month", tagline: "Professional trading intelligence and advanced tools.", accounts: Infinity },
];
export const TIER_RANK = { basic: 1, pro: 2, elite: 3 };

// live: true = in the journal today. false = shown as "Coming soon" (never sell a feature as ready before it is).
const L = true, S = false;
export const FEATURE_GROUPS = {
  basic: [
    { title: "Everyday journal", items: [
      ["Unlimited manual trade logging", L], ["Two active trading accounts", L], ["CSV, MT4 and MT5 imports", L],
      ["Trading dashboard", L], ["Trading calendar", L], ["Equity and balance charts", L],
    ] },
    { title: "Core analytics", items: [
      ["Win rate and profit factor", L], ["Average win and average loss", L], ["R-multiple and expectancy", L],
      ["Daily, weekly and monthly P&L", L], ["Basic strategy tracking", L], ["Basic prop-firm tracking", L],
    ] },
    { title: "Discipline and review", items: [
      ["Financial and performance goals", L], ["Trading discipline tracking", L], ["Psychology tracking", L],
      ["Trade screenshots and attachments", L], ["Trade notes and execution grades", L], ["Notes page with 9 free templates", L], ["Basic risk management", L],
      ["PDF and CSV reports", L], ["Dark and light themes", L], ["Custom accent colours", L],
    ] },
  ],
  pro: [
    { title: "Advanced analytics", items: [
      ["Custom performance dashboards", L], ["Advanced performance statistics", L], ["MAE/MFE analysis", L], ["Entry and exit efficiency", L],
      ["Session performance comparisons", L], ["Timeframe performance comparisons", L], ["Instrument performance comparisons", L],
      ["Advanced drawdown analysis", L], ["Advanced expectancy analysis", L],
    ] },
    { title: "Strategy intelligence", items: [
      ["Unlimited strategy tracking", L], ["Strategy comparison", L], ["Setup-specific performance", L], ["Strategy expectancy", L],
      ["Performance by market conditions", L], ["Advanced strategy filtering", L],
    ] },
    { title: "Prop-firm management", items: [
      ["Unlimited active accounts", L], ["Multiple challenge tracking", L], ["Funded account management", L], ["Advanced drawdown monitoring", L],
      ["RuleGuard warnings", L], ["Challenge performance reports", L], ["Cross-account comparisons", L],
    ] },
    { title: "Execution intelligence", items: [
      ["Automatic trading pattern detection", L], ["Behavioural analysis", L], ["Weekly performance insights", L], ["Discipline trend analysis", L],
      ["Identification of costly trading habits", L], ["Advanced psychology reports", L],
    ] },
    { title: "Additional tools", items: [
      ["Selected broker synchronisation", S], ["Advanced trade imports", L], ["Custom report builder", L], ["Custom trade fields", L],
      ["Advanced chart annotations", L], ["Extended screenshot storage", S], ["Advanced trade tagging", L],
    ] },
  ],
  elite: [
    { title: "AI Trading Coach", items: [
      ["Personal AI trading assistant", L], ["AI trade reviews", L], ["AI-generated weekly reviews", L], ["AI-generated monthly reviews", L],
      ["Personalised improvement plans", L], ["AI behavioural analysis", L], ["AI psychology insights", L], ["Screenshot-based trade analysis", S],
      ["Ask questions about your trading history", L],
    ] },
    { title: "Trade Replay Lab", items: [
      ["Historical trade replay", L], ["Interactive chart replay", L], ["Entry and exit decision reviews", L],
      ["Planned versus actual execution comparisons", L], ["Chart annotations", L], ["Saved replay sessions", S],
    ] },
    { title: "Backtesting Studio", items: [
      ["Historical strategy testing", S], ["Custom trading rules", S], ["Strategy simulations", L], ["Risk-to-reward simulations", L],
      ["Monte Carlo analysis", L], ["Strategy variation comparisons", L], ["Detailed backtesting reports", S],
    ] },
    { title: "Advanced account management", items: [
      ["Expanded broker synchronisation", S], ["Consolidated account analytics", L], ["Portfolio-wide risk monitoring", L],
      ["Cross-account strategy analysis", L], ["Advanced prop-firm RuleGuard", L], ["Advanced account reporting", L],
    ] },
    { title: "Premium", items: [
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
