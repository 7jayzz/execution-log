"use client";
import { useEffect, useState } from "react";

// Counts down from `seconds` after start(); `left` is 0 when the button can be used again.
export default function useCooldown(seconds = 60) {
  const [until, setUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!until) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [until]);
  const left = Math.max(0, Math.ceil((until - now) / 1000));
  const start = () => { const n = Date.now(); setNow(n); setUntil(n + seconds * 1000); };
  return { left, start };
}
