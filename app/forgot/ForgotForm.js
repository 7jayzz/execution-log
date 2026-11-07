"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setError("Enter a valid email address.");
    setBusy(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/auth/confirm` });
    setBusy(false);
    setSent(true); // Same message either way, so nobody can check which emails have accounts.
  };
  return (
    <form className="auth-card" onSubmit={submit} noValidate>
      <h1>Reset your password</h1>
      {sent ? (
        <>
          <div className="box good">If there's an account for <b>{email.trim()}</b>, we've sent a link to reset your password.</div>
          <Link href="/login" className="btn block">Back to log in</Link>
        </>
      ) : (
        <>
          <p className="lead">Enter your account email and we'll send you a reset link.</p>
          <div className="field"><label htmlFor="email">Email</label><input id="email" className="input" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} autoComplete="email" /></div>
          {error && <div className="err" role="alert">{error}</div>}
          <button className="btn primary block" type="submit" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button>
          <div className="switch"><Link href="/login" className="link">Back to log in</Link></div>
        </>
      )}
    </form>
  );
}
