"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const COUNTRIES = [
  ["GB", "+44", "🇬🇧"], ["IE", "+353", "🇮🇪"], ["US", "+1", "🇺🇸"], ["CA", "+1", "🇨🇦"], ["AU", "+61", "🇦🇺"],
  ["FR", "+33", "🇫🇷"], ["DE", "+49", "🇩🇪"], ["ES", "+34", "🇪🇸"], ["IT", "+39", "🇮🇹"], ["NL", "+31", "🇳🇱"],
  ["PT", "+351", "🇵🇹"], ["AE", "+971", "🇦🇪"], ["IN", "+91", "🇮🇳"], ["NG", "+234", "🇳🇬"], ["ZA", "+27", "🇿🇦"],
];
const toE164 = (code, raw) => {
  let n = String(raw || "").replace(/[^\d]/g, "");
  if (n.startsWith("00")) return "+" + n.slice(2);
  if (String(raw || "").trim().startsWith("+")) return "+" + n;
  n = n.replace(/^0+/, "");
  return code + n;
};
const friendly = (e) => {
  const m = String(e?.message || e || "").toLowerCase();
  if (m.includes("already") && (m.includes("registered") || m.includes("use") || m.includes("exists"))) return "This number is already linked to another account. Each number can only be used once.";
  if (m.includes("rate") || m.includes("too many") || m.includes("seconds")) return "Too many attempts. Please wait a few minutes and try again.";
  if (m.includes("expired") || m.includes("invalid") || m.includes("token")) return "That code isn't right or has expired. Check it, or send a new one.";
  if (m.includes("phone") && (m.includes("format") || m.includes("valid"))) return "That doesn't look like a valid mobile number.";
  return "Something went wrong. Please try again.";
};

// Verifies a mobile number with a six-digit text code before a free trial can start.
export default function PhoneVerify() {
  const router = useRouter();
  const [code, setCode] = useState("+44");
  const [num, setNum] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("enter");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [wait, setWait] = useState(0);
  useEffect(() => { if (!wait) return; const t = setTimeout(() => setWait(wait - 1), 1000); return () => clearTimeout(t); }, [wait]);

  async function send(e) {
    e?.preventDefault();
    const p = toE164(code, num);
    if (!/^\+\d{8,15}$/.test(p)) { setErr("That doesn't look like a valid mobile number."); return; }
    setBusy(true); setErr("");
    const { error } = await createClient().auth.updateUser({ phone: p });
    setBusy(false);
    if (error) { setErr(friendly(error)); return; }
    setPhone(p); setStep("code"); setOtp(""); setWait(60);
  }
  async function verify(e) {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) { setErr("Enter the six-digit code we sent you."); return; }
    setBusy(true); setErr("");
    const { error } = await createClient().auth.verifyOtp({ phone, token: otp, type: "phone_change" });
    setBusy(false);
    if (error) { setErr(friendly(error)); return; }
    setStep("done"); router.refresh();
  }

  if (step === "done") return <div className="box good" id="verify">Your number is verified. Pick a plan below to start your free trial.</div>;
  return (
    <section className="verify-card" id="verify" aria-labelledby="verify-title">
      <div>
        <h2 id="verify-title">Verify your phone number</h2>
        <p className="hint">To keep free trials fair, we confirm each new member's mobile number before their trial starts. We'll text you a six-digit code. We never use your number for marketing.</p>
      </div>
      {step === "enter" ? (
        <form className="verify-row" onSubmit={send} noValidate>
          <label className="sr-only" htmlFor="pv-cc">Country code</label>
          <select id="pv-cc" value={code} onChange={(e) => setCode(e.target.value)}>
            {COUNTRIES.map(([iso, c, flag]) => <option key={iso} value={c}>{flag} {c}</option>)}
          </select>
          <label className="sr-only" htmlFor="pv-num">Mobile number</label>
          <input id="pv-num" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="7XXX XXXXXX" value={num} onChange={(e) => setNum(e.target.value)} />
          <button className="btn primary" type="submit" disabled={busy}>{busy ? "Sending…" : "Send code"}</button>
        </form>
      ) : (
        <form className="verify-row" onSubmit={verify} noValidate>
          <label className="sr-only" htmlFor="pv-otp">Six-digit code</label>
          <input id="pv-otp" className="otp" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} />
          <button className="btn primary" type="submit" disabled={busy}>{busy ? "Checking…" : "Verify"}</button>
          <span className="hint verify-meta">Sent to {phone}. <button type="button" className="linkish" disabled={wait > 0 || busy} onClick={send}>{wait ? `Resend in ${wait}s` : "Resend code"}</button> · <button type="button" className="linkish" onClick={() => { setStep("enter"); setErr(""); }}>Change number</button></span>
        </form>
      )}
      {err && <div className="box bad" role="alert">{err}</div>}
    </section>
  );
}
