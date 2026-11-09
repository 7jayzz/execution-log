"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import useCooldown from "@/components/useCooldown";

const WAIT = 60;

export default function ForgotForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const { left, start } = useCooldown(WAIT);

  const send = async () => {
    setBusy(true); setError(""); setNote("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/auth/confirm?next=/reset-password` });
    setBusy(false);
    // Rate limits are the only error worth showing. Anything else gets the same message,
    // so nobody can use this page to check which emails have accounts.
    if (err && (err.status === 429 || /rate|seconds|too many/i.test(err.message || ""))) {
      setError("Too many emails sent just now. Wait a minute, then try again.");
      start();
      return false;
    }
    start();
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setError("Enter a valid email address.");
    if (await send()) setSent(true);
  };

  const resend = async () => {
    if (left || busy) return;
    if (await send()) setNote("Sent again. Check your inbox and spam folder.");
  };

  return (
    <form className="auth-card" onSubmit={submit} noValidate>
      <h1>Reset your password</h1>
      {sent ? (
        <>
          <div className="box good"><b>Check your inbox.</b> We've sent a reset link to <b>{email.trim()}</b>, if that address has an account with us.</div>
          <div className="box info">Not there after a few minutes? Check your spam or promotions folder, and make sure the email above is the one you signed up with. New here? <Link href="/signup" className="link">Create an account</Link>.</div>
          {note && <div className="box good" role="status">{note}</div>}
          {error && <div className="err" role="alert">{error}</div>}
          <button type="button" className="btn block" onClick={resend} disabled={busy || left > 0} aria-live="polite">
            {busy ? "Sending…" : left > 0 ? `Send another email in ${left}s` : "Send another email"}
          </button>
          <div className="row-between">
            <button type="button" className="link" onClick={() => { setSent(false); setNote(""); setError(""); }}>Use a different email</button>
            <Link href="/login" className="link">Back to log in</Link>
          </div>
        </>
      ) : (
        <>
          <p className="lead">Enter your account email and we'll send you a reset link.</p>
          <div className="field"><label htmlFor="email">Email</label><input id="email" className="input" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} autoComplete="email" /></div>
          {error && <div className="err" role="alert">{error}</div>}
          <button className="btn primary block" type="submit" disabled={busy || left > 0}>{busy ? "Sending…" : left > 0 ? `Send reset link (${left}s)` : "Send reset link"}</button>
          <div className="switch"><Link href="/login" className="link">Back to log in</Link></div>
        </>
      )}
    </form>
  );
}
