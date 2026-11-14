import { layout, esc, facts, button, small } from "@/lib/emails/layout";

// The email support@ gets when a trader sends feedback from inside the journal.
const TYPES = {
  idea: { label: "Idea", icon: "💡", bg: "#123a2c", fg: "#3fd69a", line: "#3fd69a" },
  bug: { label: "Something's broken", icon: "🛠", bg: "#3d1a1f", fg: "#ff6b7a", line: "#ff6b7a" },
  other: { label: "Other", icon: "💬", bg: "#1d2a45", fg: "#7fa8ff", line: "#7fa8ff" },
};
const PLANS = { elite: "Elite", pro: "Pro", basic: "Basic" };

const badge = (text, bg, fg) =>
  `<td style="padding:0 6px 0 0;"><span style="display:inline-block;padding:5px 11px;border-radius:999px;background-color:${bg};color:${fg};font-size:12px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;">${text}</span></td>`;

export function feedbackEmail({ kind, message, page, plan, email }) {
  const t = TYPES[kind] || TYPES.other, planName = PLANS[plan] || "No plan", elite = plan === "elite";
  const sent = new Date().toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });
  const preview = message.replace(/\s+/g, " ").slice(0, 60) + (message.length > 60 ? "…" : "");
  const replyHref = `mailto:${email}?subject=${encodeURIComponent(`Re: your ${t.label.toLowerCase()} on The Execution Log`)}`;

  const badges = `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 14px;"><tr>${badge(`${t.icon} ${esc(t.label)}`, t.bg, t.fg)}${elite ? badge("★ Priority · Elite", "#3a2c0c", "#F4B53F") : ""}</tr></table>`;
  const quote = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 18px;"><tr>
<td style="width:4px;background-color:${t.line};border-radius:4px 0 0 4px;"></td>
<td style="padding:16px 18px;background:#171d2e;border:1px solid #232a3d;border-left:0;border-radius:0 10px 10px 0;font-size:15px;line-height:1.6;color:#e8ecf5;white-space:pre-wrap;">${esc(message)}</td>
</tr></table>`;

  const html = layout({
    title: `New ${t.label.toLowerCase()} from ${email}`,
    preheader: preview,
    heading: kind === "bug" ? "Bug report" : kind === "idea" ? "New idea" : "New message",
    body: `${badges}${quote}${facts([["From", email], ["Plan", planName], ["Page", page || "Unknown"], ["Sent", sent]])}${button(replyHref, `Reply to ${email.split("@")[0]}`)}${small(elite ? "Elite member, so aim to reply within 24 hours." : "Hitting reply in your mail app goes straight to them too.")}`,
    footer: "Sent from the Feedback button inside the journal. A copy is saved in the feedback table in Supabase.",
  });
  const text = `${t.label}${elite ? " (PRIORITY · Elite)" : ""}\n\n${message}\n\nFrom: ${email}\nPlan: ${planName}\nPage: ${page || "Unknown"}\nSent: ${sent}`;
  const subject = `${elite ? "★ Elite · " : ""}${t.icon} ${t.label}: ${preview}`;
  return { subject, html, text };
}
