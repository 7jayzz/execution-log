import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata = { title: "Privacy Policy" };

// TEMPLATE: have this checked before launch so it matches how you run the business.
export default function Privacy() {
  return (
    <div className="site" style={{ gap: 30 }}>
      <SiteNav user={null} />
      <article className="legal">
        <h1>Privacy Policy</h1>
        <p>Last updated: [date]</p>
        <p>The Execution Log ("we", "us") is run by [your name or company], [address], United Kingdom. Contact: [email].</p>
        <h2>What we collect</h2>
        <ul>
          <li>Account details: your name, email address and password (stored encrypted by our login provider, Supabase).</li>
          <li>Journal data you enter: trades, accounts, goals, notes and screenshots.</li>
          <li>Billing details: handled by Stripe. We never see or store your full card number.</li>
          <li>Basic technical data needed to keep you logged in and the service secure.</li>
        </ul>
        <h2>How we use it</h2>
        <p>To run your journal, take payments, send account emails (confirmation, password reset, welcome, billing) and keep the service secure. We don't sell your data or use your trades for advertising.</p>
        <h2>Who processes it</h2>
        <p>Supabase (database and login), Stripe (payments), Resend (email) and Vercel (hosting). Data may be processed outside the UK under appropriate safeguards.</p>
        <h2>Your rights</h2>
        <p>You can export or delete your journal data at any time from Settings → Data & privacy. Under UK GDPR you can also ask us for access, correction or deletion of your personal data by emailing [email]. You can complain to the ICO (ico.org.uk).</p>
        <h2>How long we keep it</h2>
        <p>Until you delete it or close your account, plus any period the law requires for billing records.</p>
      </article>
      <SiteFooter />
    </div>
  );
}
