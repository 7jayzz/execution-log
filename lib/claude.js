import { sendEmail } from "@/lib/email";
import { LEGAL } from "@/lib/legal";

// One place that talks to Claude for the AI coach, built so a blip never reaches the trader:
// - retries short-lived failures (overloaded, rate limited, server errors, dropped connections)
// - if the main model still fails, answers with a backup model
// - emails support when something needs fixing (no credit, bad key), at most once an hour.
const MAIN = () => process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
const BACKUP = () => process.env.ANTHROPIC_FALLBACK_MODEL || "claude-haiku-5-5";
const RETRY = new Set([408, 409, 429, 500, 502, 503, 504, 529]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function call(model, content, maxTokens, main, timeoutMs) {
  // The main model thinks by default; turning up-front thinking off leaves the whole allowance for the reply.
  const extra = main ? { thinking: { type: "between_tools" }, output_config: { effort: "medium" } } : {};
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model, max_tokens: maxTokens, ...extra, messages: [{ role: "user", content }] }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    let type = ""; try { type = JSON.parse(detail)?.error?.type || ""; } catch {}
    const err = new Error(`Claude ${res.status} ${type}`.trim()); err.status = res.status; err.type = type; err.detail = detail.slice(0, 500); throw err;
  }
  const data = await res.json();
  const text = (data.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();
  if (!text) { const err = new Error("Claude empty reply " + (data.stop_reason || "")); err.status = 0; err.type = "empty"; throw err; }
  return { text, truncated: data.stop_reason === "max_tokens", model };
}

let lastAlert = 0;
export async function alertCoachDown(err, where) {
  if (Date.now() - lastAlert < 3600_000) return; lastAlert = Date.now();
  const fix = err?.status === 401 || err?.status === 403 ? "The Anthropic API key in Vercel is wrong, revoked or missing permissions. Make a new key at console.anthropic.com and update ANTHROPIC_API_KEY in Vercel, then redeploy."
    : err?.status === 400 && /credit|billing/i.test(err?.detail || "") ? "The Anthropic account is out of credit. Top up at console.anthropic.com → Billing, and turn on auto-reload so it can't run out again."
    : err?.status === 404 ? "The model name isn't recognised. Check ANTHROPIC_MODEL in Vercel."
    : "Anthropic had a problem. If this keeps happening, check status.anthropic.com and console.anthropic.com.";
  try {
    await sendEmail({ to: LEGAL.email, subject: "[ALERT] AI coach is failing",
      text: `The AI coach failed (${where}).\n\nError: ${err?.message || err}\n${err?.detail ? "Details: " + err.detail + "\n" : ""}\nWhat to do: ${fix}\n\nYou'll get at most one of these an hour.`,
      html: `<p>The AI coach failed (${where}).</p><p><b>Error:</b> ${String(err?.message || err).replace(/</g, "&lt;")}</p><p><b>What to do:</b> ${fix}</p><p style="color:#888">You'll get at most one of these an hour.</p>` });
  } catch (e) { console.error("Couldn't send coach alert", e?.message); }
}

// Ask Claude. Throws only if the main and backup models both fail.
export async function askClaude(content, { maxTokens = 2500, where = "coach" } = {}) {
  if (!process.env.ANTHROPIC_API_KEY) { const e = new Error("ANTHROPIC_API_KEY not set"); e.status = 401; await alertCoachDown(e, where); throw e; }
  const started = Date.now(); let last;
  for (let i = 0; i < 3; i++) {
    const left = 50_000 - (Date.now() - started); if (left < 8000) break;
    try { return await call(MAIN(), content, maxTokens, true, Math.min(left, 45_000)); }
    catch (e) { last = e; console.error("Coach attempt", i + 1, e.message, e.detail || "");
      const transient = RETRY.has(e.status) || e.name === "TimeoutError" || e.name === "TypeError" || e.type === "empty";
      if (!transient) break; await wait([800, 2500][i] || 0); }
  }
  // Backup model: plainer request, still the same prompt.
  const left = 57_000 - (Date.now() - started);
  if (left > 6000) {
    try { return await call(BACKUP(), content, Math.min(maxTokens, 2000), false, left); }
    catch (e) { console.error("Coach backup failed", e.message, e.detail || ""); if (!last) last = e; }
  }
  // Only email when it's something to fix (not a passing blip that the retries already rode out).
  await alertCoachDown(last, where);
  throw last;
}
