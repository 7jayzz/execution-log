import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import HelpSearch from "@/components/HelpSearch";
import { LEGAL } from "@/lib/legal";
import { HELP } from "@/lib/help";

export const metadata = {
  title: "Help centre",
  description: "Answers about the free trial, billing, importing from MT5, prop firm accounts, notifications and keeping your data private.",
};

export default function Help() {
  return (
    <div className="site" style={{ gap: 30 }}>
      <SiteNav user={null} />
      <main className="help">
        <header className="help-head">
          <h1>Help centre</h1>
          <p className="lead">Quick answers about your trial, billing, importing trades and keeping your data private.</p>
        </header>
        <HelpSearch sections={HELP} />
        <section className="help-contact">
          <h2>Still stuck?</h2>
          <p>Email <a className="link" href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> from the address on your account. We usually reply within 2 working days.</p>
          <p className="help-small">See also: <Link className="link" href="/pricing">Pricing</Link> · <Link className="link" href="/terms">Terms</Link> · <Link className="link" href="/refunds">Refunds</Link></p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
