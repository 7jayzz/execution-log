// Who runs the business, shown in the legal pages.
// Set these in Vercel once you've decided on the details; until then the pages show a highlighted placeholder.
//   NEXT_PUBLIC_LEGAL_NAME     your full legal name (UK law requires it for a sole trader using a business name)
//   NEXT_PUBLIC_LEGAL_ADDRESS  a UK address where you accept post (a virtual office address is fine)
//   NEXT_PUBLIC_SUPPORT_EMAIL  e.g. support@theexecutionlog.com
export const LEGAL = {
  trading: "The Execution Log",
  owner: (process.env.NEXT_PUBLIC_LEGAL_NAME || "").trim(),
  address: (process.env.NEXT_PUBLIC_LEGAL_ADDRESS || "").trim(),
  email: (process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@theexecutionlog.com").trim(),
  // Registered with the Information Commissioner's Office (data protection fee paid).
  ico: "ZC299847",
  updated: "14 November 2026",
  trialDays: Number(process.env.TRIAL_DAYS || 7),
};

export const LEGAL_PAGES = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refunds", label: "Refunds" },
  { href: "/cookies", label: "Cookies" },
  { href: "/disclaimer", label: "Risk disclaimer" },
];
