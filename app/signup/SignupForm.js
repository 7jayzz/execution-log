"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PasswordField, { pwValid } from "@/components/PasswordField";
import OAuthButtons from "@/components/OAuthButtons";

const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [taken, setTaken] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setTaken(false);
    if (!name.trim()) return setError("Add your name to continue.");
    if (!emailOk(email.trim())) return setError("Enter a valid email address.");
    if (!pwValid(pw)) return setError("Your password needs at least 8 characters, with a letter and a number.");
    if (pw !== pw2) return setError("The passwords don't match.");
    if (!agree) return setError("Please agree to the Terms and Privacy Policy.");
    setBusy(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: pw,
      options: { data: { full_name: name.trim() }, emailRedirectTo: `${window.location.origin}/auth/confirm` },
    });
    setBusy(false);
    if (error) {
      if (/registered|exists/i.test(error.message)) return setTaken(true);
      return setError(error.message);
    }
    // With email confirmation on, Supabase hides whether an email is already used by returning a user with no identities.
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) return setTaken(true);
    if (data.session) return router.replace("/dashboard");
    router.push(`/check-email?email=${encodeURIComponent(email.trim())}`);
  };

  return (
    <form className="auth-card" onSubmit={submit} noValidate>
      <h1>Create your account</h1>
      <p className="lead">Start your journal. Your trades stay private to you.</p>
      <OAuthButtons />
      <div className="field"><label htmlFor="name">Your name</label><input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={60} /></div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" className="input" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setTaken(false); }} autoComplete="email" maxLength={120} />
        {taken && (
          <div className="box bad row-between"><span>There's already an account with this email.</span><Link href={`/login?email=${encodeURIComponent(email.trim())}`} className="btn primary">Log in</Link></div>
        )}
      </div>
      <PasswordField id="pw" label="Password" value={pw} onChange={setPw} meter />
      <PasswordField id="pw2" label="Confirm password" value={pw2} onChange={setPw2} />
      <label className="check"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /><span>I agree to the <Link href="/terms" className="link">Terms</Link> and <Link href="/privacy" className="link">Privacy Policy</Link>.</span></label>
      {error && <div className="err" role="alert">{error}</div>}
      <button className="btn primary big block" type="submit" disabled={busy}>{busy ? "Creating your account…" : "Create account"}</button>
      <div className="switch"><span>Already have an account?</span><Link href="/login" className="btn">Log in</Link></div>
    </form>
  );
}
