"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import PasswordField from "@/components/PasswordField";
import OAuthButtons from "@/components/OAuthButtons";

export default function LoginForm({ next = "/dashboard", reason = "", initialEmail = "", linkError = "" }) {
  const [email, setEmail] = useState(initialEmail);
  const [pw, setPw] = useState("");
  const [error, setError] = useState(linkError === "link" ? "That link has expired or was already used. Log in, or ask for a new one." : linkError === "oauth" ? "That sign-in didn't finish. Try again." : "");
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setUnconfirmed(false);
    if (!email.trim() || !pw) return setError("Enter your email and password.");
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw });
    if (error) {
      setBusy(false);
      if (/confirm/i.test(error.message)) return setUnconfirmed(true);
      if (/invalid/i.test(error.message)) return setError("Wrong email or password.");
      if (/rate|many/i.test(error.message)) return setError("Too many tries. Wait a minute and try again.");
      return setError(error.message);
    }
    window.location.href = next;
  };

  const resend = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.resend({ type: "signup", email: email.trim(), options: { emailRedirectTo: `${window.location.origin}/auth/confirm` } });
    setNotice(error ? "Couldn't send it just now. Try again in a minute." : "Confirmation email sent. Check your inbox.");
  };

  return (
    <form className="auth-card" onSubmit={submit} noValidate>
      <h1>Log in</h1>
      <p className="lead">Welcome back. Log in to open your journal.</p>
      {reason === "idle" && <div className="box info">You were logged out after 10 minutes of inactivity.</div>}
      <OAuthButtons next={next} />
      <div className="field"><label htmlFor="email">Email</label><input id="email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></div>
      <PasswordField id="pw" label="Password" value={pw} onChange={setPw} autoComplete="current-password" />
      {unconfirmed && (
        <div className="box bad">Confirm your email first. We sent you a link when you signed up. <button type="button" className="link" onClick={resend}>Send it again</button></div>
      )}
      {notice && <div className="box good">{notice}</div>}
      {error && <div className="err" role="alert">{error}</div>}
      <div className="row-between">
        <Link href="/forgot" className="link">Forgot password?</Link>
        <button className="btn primary" type="submit" disabled={busy} style={{ minWidth: 140 }}>{busy ? "Logging in…" : "Log in"}</button>
      </div>
      <div className="switch"><span>Don't have an account?</span><Link href="/signup" className="btn">Create account</Link></div>
    </form>
  );
}
