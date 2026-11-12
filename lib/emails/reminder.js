import { themeify } from "@/lib/emails/layout";
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// One email that carries every reminder due in this run (at most 3), in the same style as the welcome email.
export function reminderEmail({ items, email, dashboardUrl, settingsUrl, unsubscribeUrl }) {
  const subject = items.length === 1 ? items[0].title : `${items[0].title} (+${items.length - 1} more)`;
  const rows = items.map((r) => `<tr><td style="padding:12px 14px;background:#171d2e;border:1px solid #232a3d;border-radius:10px;font-size:14px;line-height:1.55;color:#b9c0d1;"><strong style="color:#f3f5fa;display:block;margin-bottom:2px;">${esc(r.title)}</strong>${esc(r.body)}</td></tr><tr><td style="height:8px;"></td></tr>`).join("");
  const html = themeify(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#0b0e16;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(items[0].body)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0e16;padding:32px 12px;"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#121726;border:1px solid #232a3d;border-radius:16px;font-family:Arial,Helvetica,sans-serif;color:#f3f5fa;">
<tr><td style="padding:28px 32px 8px;"><table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="width:34px;height:34px;background:#F4B53F;border-radius:8px;text-align:center;font-weight:900;color:#121726;font-size:15px;"><img src="https://www.theexecutionlog.com/icon-192.png" width="34" height="34" alt="EL" style="display:block;border:0;border-radius:8px;"></td>
<td style="padding-left:10px;font-size:18px;font-weight:800;">The Execution <span style="color:#F4B53F;">Log</span></td></tr></table></td></tr>
<tr><td style="padding:16px 32px 8px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:10px 0 22px;"><tr><td style="background:#F4B53F;border-radius:10px;">
<a href="${esc(dashboardUrl)}" style="display:inline-block;padding:14px 26px;font-size:15px;font-weight:700;color:#121726;text-decoration:none;">Open my journal</a></td></tr></table>
</td></tr>
<tr><td style="padding:22px 32px 28px;border-top:1px solid #232a3d;font-size:12px;line-height:1.6;color:#8790a6;">You're getting this because email reminders are on for ${esc(email)}. <a href="${esc(settingsUrl)}" style="color:#b9c0d1;">Choose which reminders you get</a> or <a href="${esc(unsubscribeUrl)}" style="color:#b9c0d1;">turn off email reminders</a>.</td></tr>
</table></td></tr></table></body></html>`);
  const text = `${items.map((r) => `${r.title}\n${r.body}`).join("\n\n")}\n\nOpen your journal: ${dashboardUrl}\n\nTurn off email reminders: ${unsubscribeUrl}`;
  return { subject, html, text };
}
