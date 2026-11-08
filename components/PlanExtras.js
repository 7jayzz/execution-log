"use client";
import { useEffect, useState } from "react";

// Opens every feature section on wide screens; on phones they stay collapsed to keep the cards short.
export function OpenOnDesktop() {
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 981px)");
    const apply = () => document.querySelectorAll("details.fgroup").forEach((d) => { d.open = mq.matches; });
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return null;
}

// Small bar fixed to the bottom of phone screens. Hidden while the plan cards are on screen,
// so it never covers the prices or the checkout buttons.
export function StickyPlansBar({ from = "£12.99", trialDays = 7 }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const plans = document.querySelector(".plans");
    let plansVisible = false, scrolled = false;
    const update = () => setShow(scrolled && !plansVisible && window.innerWidth <= 760);
    const io = plans ? new IntersectionObserver(([e]) => { plansVisible = e.isIntersecting; update(); }, { threshold: 0 }) : null;
    if (io && plans) io.observe(plans);
    const onScroll = () => { scrolled = window.scrollY > 420; update(); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => { io && io.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", update); };
  }, []);
  const go = () => { const el = document.querySelector(".billing-wrap") || document.querySelector(".plans"); el && el.scrollIntoView({ behavior: "smooth", block: "start" }); };
  return (
    <>
      <div className={`sticky-plans ${show ? "on" : ""}`} aria-hidden={!show}>
        <span><b>From {from}/month</b>{trialDays > 0 ? ` · ${trialDays}-day free trial` : ""}</span>
        <button type="button" className="btn primary small" onClick={go} tabIndex={show ? 0 : -1}>View plans</button>
      </div>
      <div className="sticky-plans-space" aria-hidden="true" />
    </>
  );
}
