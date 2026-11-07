"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import PasswordField, { pwValid } from "@/components/PasswordField";

export default function ResetForm() {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!pwValid(pw)) return setError("Your password needs at least 8 characters, with a letter and a number.");
    if (pw !== pw2) return setError("The passwords don't match.");
    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setError(/different/i.test(error.message) ? "Choose a password you haven't used before." : error.message);
    setDone(true);
    setTimeout(() => { window.location.href = "/dashboard"; }, 1200);
  };
  return (
    <form className="auth-card" onSubmit={submit} noValidate>
      <h1>Choose a new password</h1>
      {done ? (
        <div className="box good">Password updated. Opening your journal…</div>
      ) : (
        <>
          <PasswordField id="pw" label="New password" value={pw} onChange={setPw} meter />
          <PasswordField id="pw2" label="Confirm new password" value={pw2} onChange={setPw2} />
          {error && <div className="err" role="alert">{error}</div>}
          <button className="btn primary block" type="submit" disabled={busy}>{busy ? "Saving…" : "Save new password"}</button>
        </>
      )}
    </form>
  );
}
