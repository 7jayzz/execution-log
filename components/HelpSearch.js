"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

const norm = (s) => s.toLowerCase().normalize("NFKD").replace(/[^\w\s]/g, " ");

export default function HelpSearch({ sections }) {
  const [q, setQ] = useState("");
  const words = norm(q).split(/\s+/).filter(Boolean);
  const shown = useMemo(() => sections
    .map((s) => ({ ...s, items: s.items.filter((it) => !words.length || words.every((w) => norm(`${s.title} ${it.q} ${it.a}`).includes(w))) }))
    .filter((s) => s.items.length), [q]); // eslint-disable-line react-hooks/exhaustive-deps
  const count = shown.reduce((n, s) => n + s.items.length, 0);

  return (
    <>
      <div className="help-search">
        <label htmlFor="helpQ" className="sr-only">Search help</label>
        <input id="helpQ" className="input" type="search" placeholder="Search, e.g. cancel, MT5, refund" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
        {words.length > 0 && <span className="help-count" role="status">{count ? `${count} answer${count === 1 ? "" : "s"}` : "No answers found"}</span>}
      </div>
      {!words.length && (
        <nav className="help-topics" aria-label="Topics">
          {sections.map((s) => <a key={s.id} href={`#${s.id}`}>{s.title}</a>)}
        </nav>
      )}
      {shown.map((s) => (
        <section key={s.id} id={s.id} className="help-sec">
          <h2>{s.title}</h2>
          {s.items.map((it) => (
            <details key={it.q} className="help-q" open={words.length > 0 && count <= 3}>
              <summary>{it.q}</summary>
              <p>{it.a}</p>
              {it.link && <p><Link className="link" href={it.link.href}>{it.link.text} →</Link></p>}
            </details>
          ))}
        </section>
      ))}
      {words.length > 0 && !count && <p className="help-none">Nothing matched "{q}". Try another word, or email us below.</p>}
    </>
  );
}
