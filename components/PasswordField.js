"use client";
import { useState } from "react";

export const pwValid = (pw) => pw.length >= 8 && /[A-Za-z]/.test(pw) && /\d/.test(pw);
const score = (pw) => {
  if (!pw) return 0;
  if (!pwValid(pw)) return 1;
  let n = 0;
  if (pw.length >= 12) n++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) n++;
  if (/[^A-Za-z0-9]/.test(pw)) n++;
  return n >= 2 ? 3 : 2;
};

export default function PasswordField({ id, label, value, onChange, meter = false, autoComplete = "new-password" }) {
  const [show, setShow] = useState(false);
  const s = score(value);
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="pw">
        <input id={id} className="input" type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} maxLength={128} required />
        <button type="button" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
      </div>
      {meter && (
        <>
          <div className="meter" data-s={s} aria-hidden="true"><i /><i /><i /></div>
          <span className="hint">{s === 3 ? "Strong" : s === 2 ? "Good" : s === 1 ? "Weak · at least 8 characters, with a letter and a number" : "At least 8 characters, with a letter and a number."}</span>
        </>
      )}
    </div>
  );
}
