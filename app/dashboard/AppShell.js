"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { makeHost } from "@/lib/host";

// Keep the browser's "install app" offer so the journal can show its own Install button (Android / desktop Chrome).
if (typeof window !== "undefined" && !window.__telInstallHooked) {
  window.__telInstallHooked = true;
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); window.__telInstall = e; });
  window.addEventListener("appinstalled", () => { window.__telInstall = null; });
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
}

const IDLE_MS = 10 * 60 * 1000; // log out after 10 minutes with no activity
const EVENTS = ["pointerdown", "keydown", "wheel", "touchstart", "mousemove", "scroll"];

export default function AppShell({ user, subscription }) {
  const [ready, setReady] = useState(false);
  const frame = useRef(null);
  const lastActive = useRef(Date.now());
  const host = useRef(null);

  useEffect(() => {
    const supabase = createClient();
    host.current = makeHost(supabase, user, subscription);
    window.__telHost = host.current;
    setReady(true);

    const bump = () => { lastActive.current = Date.now(); };
    EVENTS.forEach((ev) => window.addEventListener(ev, bump, { passive: true }));
    const check = () => {
      if (Date.now() - lastActive.current >= IDLE_MS) host.current?.signOut("idle");
    };
    const timer = setInterval(check, 15000);
    const onVis = () => { if (document.visibilityState === "visible") check(); };
    document.addEventListener("visibilitychange", onVis);

    // If the session ends in another tab, leave too.
    const { data: authSub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") window.location.href = "/login";
    });

    return () => {
      clearInterval(timer);
      EVENTS.forEach((ev) => window.removeEventListener(ev, bump));
      document.removeEventListener("visibilitychange", onVis);
      authSub?.subscription?.unsubscribe();
      host.current?.dispose();
      delete window.__telHost;
    };
  }, [user, subscription]);

  // Activity inside the journal also counts.
  const onLoad = () => {
    try {
      const w = frame.current?.contentWindow;
      const bump = () => { lastActive.current = Date.now(); };
      EVENTS.forEach((ev) => w?.addEventListener(ev, bump, { passive: true, capture: true }));
      if (w?.document?.title) document.title = w.document.title;
    } catch {}
  };

  return ready ? <iframe ref={frame} src="/journal.html" title="The Execution Log" className="app-frame" allow="fullscreen; clipboard-write" allowFullScreen onLoad={onLoad} /> : null;
}
