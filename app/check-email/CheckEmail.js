"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function CheckEmail({ email }) {
  const [msg, setMsg] = useState("");
  const resend = async () => {
    if (!email) return;
    const supabase = createClient();
    const { error } = await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: `${window.location.origin}/auth/confirm` } });
    setMsg(error ? "Couldn't send it just now. Try again in a minute." : "Sent again. Check your inbox and spam folder.");
  };
  return (
    <div className="auth-card">
      <h1>Check your email</h1>
      <p className="lead">We sent a confirmation link to <b>{email || "your email"}</b>. Tap it to finish creating your account.</p>
      <div className="box info">It can take a minute to arrive. Check your spam or promotions folder if you can't see it.</div>
      {msg && <div className="box good">{msg}</div>}
      <div className="row-between"><button type="button" className="link" onClick={resend}>Send it again</button><Link href="/login" className="btn">Back to log in</Link></div>
    </div>
  );
}
