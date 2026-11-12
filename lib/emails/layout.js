// Shared look for every email: dark card, logo, one button, plain footer.
// Inline styles and tables only, so it renders the same in Gmail, Outlook and Apple Mail.
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export const firstName = (name) => (String(name || "").trim().split(/\s+/)[0] || "trader");

export function money(minor, currency = "gbp") {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: currency.toUpperCase() }).format((minor || 0) / 100);
}

export function longDate(secs) {
  return secs ? new Date(secs * 1000).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" }) : "";
}

export const p = (html) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#b9c0d1;">${html}</p>`;
export const small = (html) => `<p style="margin:0 0 12px;font-size:13px;line-height:1.6;color:#8790a6;">${html}</p>`;
export const strong = (t) => `<strong style="color:#e8ecf5;">${t}</strong>`;

export function facts(rows) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 18px;background:#171d2e;border:1px solid #232a3d;border-radius:10px;">${rows
    .map(([k, v], i) => `<tr><td style="padding:11px 14px;font-size:13px;color:#8790a6;${i ? "border-top:1px solid #232a3d;" : ""}">${esc(k)}</td><td align="right" style="padding:11px 14px;font-size:14px;font-weight:700;color:#e8ecf5;${i ? "border-top:1px solid #232a3d;" : ""}">${esc(v)}</td></tr>`)
    .join("")}</table>`;
}

export function button(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 20px;"><tr><td style="background:#F4B53F;border-radius:10px;"><a href="${esc(href)}" style="display:inline-block;padding:14px 26px;font-size:15px;font-weight:700;color:#121726;text-decoration:none;">${esc(label)}</a></td></tr></table>`;
}


// Light by default; switches back to the dark design in mail apps that support dark mode (Apple Mail, iOS Mail,
// Outlook). Gmail ignores dark-mode CSS, so it always shows the light version.
// Emails are written with the dark palette; themeify() swaps each inline colour for its light version and tags the
// element with a class, and the dark-mode CSS puts the original colour back.
const THEME = [
  ["background:#0b0e16", "background:#EEF0F5", "b0"],
  ["background:#121726", "background:#FFFFFF", "b1"],
  ["background:#171d2e", "background:#F5F7FB", "b2"],
  ["solid #232a3d", "solid #E1E5EE", "bd"],
  ["color:#e8ecf5", "color:#121726", "t1"],
  ["color:#f3f5fa", "color:#121726", "t1"],
  ["color:#b9c0d1", "color:#4A5370", "t2"],
  ["color:#8790a6", "color:#6B7490", "t3"],
  ["color:#6b7490", "color:#8A92A8", "t4"],
  ["color:#F4B53F", "color:#B97A00", "ta"],
];
const DARK = { b0: "background-color:#0b0e16", b1: "background-color:#121726", b2: "background-color:#171d2e", bd: "border-color:#232a3d", t1: "color:#e8ecf5", t2: "color:#b9c0d1", t3: "color:#8790a6", t4: "color:#6b7490", ta: "color:#F4B53F" };
const darkCss = (sel) => Object.entries(DARK).map(([k, v]) => sel(k) + `{${v.replace(/;/g, " !important;")} !important}`).join("");
const STYLE = `<style>:root{color-scheme:light dark;supported-color-schemes:light dark}
@media (prefers-color-scheme: dark){${darkCss((k) => `.el-${k}`)}}
${darkCss((k) => `[data-ogsc] .el-${k},[data-ogsb] .el-${k}`)}</style>`;
export function themeify(html) {
  let out = html.replace(/<([a-z]+)([^>]*?)\sstyle="([^"]*)"/gi, (m, tag, pre, style) => {
    const cls = [];
    let st = style;
    for (const [dark, light, k] of THEME) {
      // "color:" must not match inside "background-color:"/"border-color:"
      const re = new RegExp((dark.startsWith("color:") ? "(^|[;\\s])" : "()") + dark.replace(/[#]/g, "\\#"), "gi");
      if (re.test(st)) { st = st.replace(re, (mm, lead) => lead + light); if (!cls.includes(k)) cls.push(k); }
    }
    if (!cls.length) return m;
    const c = cls.map((k) => "el-" + k).join(" ");
    return /\sclass="/i.test(pre) ? `<${tag}${pre.replace(/\sclass="([^"]*)"/i, ` class="$1 ${c}"`)} style="${st}"` : `<${tag}${pre} class="${c}" style="${st}"`;
  });
  out = out.replace(/<meta name="color-scheme" content="[^"]*">/i, '<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">');
  return out.replace("</head>", STYLE + "</head>");
}

export function layout({ title, preheader, heading, body, footer }) {
  return themeify(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#0b0e16;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0e16;padding:32px 12px;"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#121726;border:1px solid #232a3d;border-radius:16px;font-family:Arial,Helvetica,sans-serif;color:#e8ecf5;">
<tr><td style="padding:28px 32px 8px;"><table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="width:34px;height:34px;background:#F4B53F;border-radius:8px;text-align:center;font-weight:900;color:#121726;font-size:15px;"><img src="https://www.theexecutionlog.com/icon-192.png" width="34" height="34" alt="EL" style="display:block;border:0;border-radius:8px;"></td>
<td style="padding-left:10px;font-size:18px;font-weight:800;">The Execution <span style="color:#F4B53F;">Log</span></td></tr></table></td></tr>
<tr><td style="padding:16px 32px 8px;">
<h1 style="margin:0 0 14px;font-size:26px;line-height:1.15;text-transform:uppercase;">${heading}</h1>
${body}
</td></tr>
<tr><td style="padding:24px 32px 30px;border-top:1px solid #232a3d;font-size:12px;line-height:1.7;color:#8790a6;">${footer ? `<div style="margin:0 0 14px;">${footer}</div>` : ""}<div style="color:#6b7490;">© ${new Date().getFullYear()} The Execution Log · Every trade. Every lesson.</div></td></tr>
</table></td></tr></table></body></html>`);
}
