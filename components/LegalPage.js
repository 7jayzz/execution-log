import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { LEGAL, LEGAL_PAGES } from "@/lib/legal";

// A highlighted gap that still needs filling in before launch.
export function Todo({ children }) {
  return <mark className="todo">{children}</mark>;
}

export function Owner() {
  return LEGAL.owner ? <>{LEGAL.owner}</> : <Todo>[your full legal name]</Todo>;
}
export function Address() {
  return LEGAL.address ? <>{LEGAL.address}</> : <Todo>[a UK postal address]</Todo>;
}
export function Email() {
  return <a className="link" href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>;
}
export function WhoWeAre() {
  return <>The Execution Log is run by <Owner />, a sole trader trading as The Execution Log, of <Address />, United Kingdom. Email: <Email />.</>;
}

export default function LegalPage({ title, current, intro, children }) {
  return (
    <div className="site" style={{ gap: 30 }}>
      <SiteNav user={null} />
      <article className="legal">
        <nav className="legal-tabs" aria-label="Legal pages">
          {LEGAL_PAGES.map((p) => <Link key={p.href} href={p.href} aria-current={p.href === current ? "page" : undefined}>{p.label}</Link>)}
        </nav>
        <h1>{title}</h1>
        <p className="legal-date">Last updated: {LEGAL.updated}</p>
        {intro && <p className="legal-intro">{intro}</p>}
        {children}
      </article>
      <SiteFooter />
    </div>
  );
}
