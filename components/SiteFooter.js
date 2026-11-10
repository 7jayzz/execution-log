import Link from "next/link";
import { TAGLINE } from "@/lib/site";
import { LEGAL, LEGAL_PAGES } from "@/lib/legal";

export default function SiteFooter() {
  return (
    <footer className="foot">
      <span>© {new Date().getFullYear()} The Execution Log · {TAGLINE}</span>
      <nav>
        <Link href="/pricing">Pricing</Link>
        <Link href="/help">Help</Link>
        <a href={`mailto:${LEGAL.email}`}>Contact: {LEGAL.email}</a>
        {LEGAL_PAGES.map((p) => <Link key={p.href} href={p.href}>{p.label}</Link>)}
      </nav>
    </footer>
  );
}
