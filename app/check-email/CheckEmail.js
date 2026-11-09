"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import useCooldown from "@/components/useCooldown";

export default function CheckEmail({ email }) {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const { left, start } = useCooldown(60);
  useEffect(() => { start(); }, []); // the first email was just sent at signup
  const resend = async () => {
    if (!email || left || busy) return;
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: `${window.location.origin}/auth/confirm` } });
    setBusy(false);
    start();
    setMsg(error ? "Couldn't send it just now. Try again in a minute." : "Sent again. Check your inbox and spam folder.");
  };
  return (
    <div className="auth-card">
      <h1>Check your email</h1>
      <p className="lead">We sent a confirmation link to <b>{email || "your email"}</b>. Tap it to finish creating your account.</p>
      <div className="box info">It can take a minute to arrive. Check your spam or promotions folder if you can't see it.</div>
      {msg && <div className="box good" role="status">{msg}</div>}
      <button type="button" className="btn block" onClick={resend} disabled={!email || busy || left > 0}>
        {busy ? "Sending…" : left > 0 ? `Send another email in ${left}s` : "Send another email"}
      </button>
      <div className="row-between"><Link href="/signup" className="link">Use a different email</Link><Link href="/login" className="link">Back to log in</Link></div>
    </div>
  );
}
