import { LEGAL } from "@/lib/legal";

const d = LEGAL.trialDays;

// Each answer is plain text plus optional links, so it's searchable and easy to keep up to date.
export const HELP = [
  { id: "start", title: "Getting started", items: [
    { q: "What is The Execution Log?", a: "An online trading journal. You log your trades (or import them from MetaTrader), and it shows you your real numbers: win rate, profit factor, which setups and sessions make you money, and which habits cost you. It also tracks your goals and prop firm rules." },
    { q: "Can I look around before setting anything up?", a: "Yes. Right after you create your account, choose \"Show me around first\". You'll get a quick tour using an example account full of made-up trades, goals and notes. You can add it back or remove it any time in Settings → General → Example account." },
    { q: "How do I replay the tutorial?", a: "Open Settings → General and tap \"Replay the tutorial\", or tap Tutorial in the menu." },
    { q: "Does it work on my phone?", a: "Yes. It works in any modern browser on phone, tablet or computer, and your journal syncs between them automatically. On iPhone, open the site in Safari, tap Share → Add to Home Screen, and it opens like an app." },
  ]},
  { id: "trial", title: "Free trial and billing", items: [
    { q: "How does the free trial work?", a: `You get ${d} days free. You add a card to start, but you're not charged until the trial ends. Cancel before then and you pay nothing.` },
    { q: "Why does it need a card for the free trial?", a: "So your plan can carry on without interruption if you decide to keep it, and to stop people taking endless free trials. You won't be charged during the trial." },
    { q: "Can I have another free trial?", a: "Free trials are limited to one per person and one per card. If you or your card have had one before, your plan starts straight away when you subscribe." },
    { q: "What's the difference between monthly and yearly?", a: "Same features. Yearly costs the same as 10 months, so you get 2 months free, paid once a year. Monthly is paid each month and you can stop any time." },
    { q: "How do I cancel?", a: "Go to Settings → Subscription & billing → Manage billing, and cancel there. You keep access until the end of the period you've paid for, and you won't be charged again." },
    { q: "Can I get a refund?", a: "Yes. If you're charged for a new subscription or a yearly renewal and change your mind, email us within 14 days of the payment for a full refund.", link: { href: "/refunds", text: "Read the refund policy" } },
    { q: "What happens if I upgrade or downgrade?", a: "Upgrades start straight away, and you pay the difference for the rest of the current period. Downgrades start at your next renewal, so you keep your current plan until then. Your data is never deleted when you change plan." },
    { q: "Where can I find my invoices or change my card?", a: "Settings → Subscription & billing → Manage billing. You can download invoices, update your card and change plan there." },
  ]},
  { id: "trades", title: "Logging and importing trades", items: [
    { q: "How do I import trades from MetaTrader 5?", a: "In MT5, open the History tab (Toolbox), right-click, choose Report → HTML and save the file. Then in The Execution Log go to Trades → Import, choose the account to import into, and upload that file." },
    { q: "How do I import from MetaTrader 4?", a: "In MT4, open Account History, right-click, choose Save as Detailed Report, and upload the .htm file in Trades → Import." },
    { q: "Can I import a CSV?", a: "Yes. Any CSV with columns like symbol, type, volume, open price, close price, time and profit will work. Files exported from The Execution Log work too." },
    { q: "Will importing the same report twice create duplicates?", a: "No. Trades that are already in the account are recognised and skipped." },
    { q: "What's the difference between Quick and Full entry?", a: "Quick asks only for the essentials (symbol, direction, size, prices, result) so you can log a trade in seconds. Full adds setup, session, grade, emotions, mistakes, notes and screenshots for proper reviews. Switch at the top of the trade form; it remembers your choice." },
    { q: "Why don't my numbers exactly match my broker?", a: "Figures come from what you enter or import, plus each account's currency, exchange rates and commission settings. Check those in the account's settings. Your broker's statement is always the official record." },
    { q: "How are deposits and withdrawals handled?", a: "Log them as cash movements on the account. They change your balance but are kept out of your trading profit and loss, so your stats stay honest." },
  ]},
  { id: "accounts", title: "Accounts, prop firms and goals", items: [
    { q: "Can I track more than one account?", a: "Yes. Basic includes 2 trading accounts; Pro and Elite are unlimited. Each account keeps its own trades, balance, currency and goals, and nothing mixes between them. The example account doesn't count towards your limit." },
    { q: "How do I track an FTMO or other prop firm challenge?", a: "Add an account with the type \"Prop firm evaluation\" or \"Funded prop account\", then open its rules and pick a template (FTMO, The5ers, FundedNext and more). It tracks your daily loss, maximum loss and profit target as you trade." },
    { q: "Are the prop firm templates always up to date?", a: "Each template shows the date we last checked it. Firms change their rules, so always confirm the current rules with your firm. You can edit any value before saving." },
    { q: "How do goals work?", a: "Open Goals → Edit goals to set profit targets, loss limits, performance targets (like win rate or risk-to-reward) and discipline rules. Progress updates as you log trades, and changes to your targets are kept in a goal history." },
  ]},
  { id: "notifications", title: "Notifications and reminders", items: [
    { q: "What reminders can I get?", a: "Reminders to journal trades you haven't reviewed, weekly and monthly reviews, goal and loss-limit warnings, and prop firm rule alerts. Choose which ones you want, when, and your quiet hours in Settings → Notifications." },
    { q: "How do I turn on push notifications?", a: "Go to Settings → Notifications and turn on push, then allow notifications when your browser asks. You can send yourself a test to check it works." },
    { q: "Push notifications don't work on my iPhone", a: "Apple only allows them for websites added to your Home Screen. Open the site in Safari, tap Share → Add to Home Screen, open it from the new icon, then turn push on in Settings → Notifications." },
  ]},
  { id: "privacy", title: "Your data, privacy and security", items: [
    { q: "Who can see my journal?", a: "Only you. Each account can only reach its own data, and this is enforced by the database itself, not just the app. We don't sell your data or use your trades for advertising." },
    { q: "Can I export my data?", a: "Yes, any time. Settings → Data & privacy lets you download your trades as a CSV (opens in Excel or Google Sheets) or everything as a JSON file." },
    { q: "How do I delete my data?", a: "Settings → Data & privacy → Delete all my data. It's permanent, so download a copy first. To close your login completely too, email us.", link: { href: "/privacy", text: "Read the privacy policy" } },
    { q: "Can I lock the journal?", a: "Yes. Settings → Security lets you set auto-lock, and you can lock it any time from the menu." },
    { q: "I forgot my password", a: "On the log-in page tap \"Forgot password?\", enter your account email and we'll send a reset link. Check your spam folder if it doesn't arrive within a few minutes." },
    { q: "Is this financial advice?", a: "No. The Execution Log helps you review your own trading. Nothing in it is a recommendation to trade.", link: { href: "/disclaimer", text: "Read the risk disclaimer" } },
  ]},
];

