import Link from "next/link";
import LegalPage, { WhoWeAre, Email } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata = { title: "Privacy Policy" };

// DRAFT: have this checked before launch so it matches how you run the business.
export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" current="/privacy" intro="This explains what personal data The Execution Log collects, why, who we share it with and the choices you have. Your trading journal is private, and we treat it that way.">
      <h2>Who is responsible for your data</h2>
      <p><WhoWeAre /> We are the "controller" of your personal data under UK data protection law (the UK GDPR and the Data Protection Act 2018). We are registered with the Information Commissioner's Office (ICO), registration number <strong>{LEGAL.ico}</strong>.</p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Account details:</strong> your name, email address and password. Passwords are stored in hashed (scrambled) form by our login provider. We can't see them.</li>
        <li><strong>Profile answers:</strong> optional details you give during setup, such as country, trading experience and style.</li>
        <li><strong>Your journal:</strong> trading accounts, trades, imports, notes, goals, reviews and screenshots you add.</li>
        <li><strong>Billing details:</strong> your plan, payment status and billing history. Card payments are handled by Stripe. We never see or store your full card number. Stripe tells us a card "fingerprint" (a code that identifies a card without revealing its number) so we can limit free trials to one per card.</li>
        <li><strong>Phone number:</strong> only if we ask you to verify one, to prevent duplicate free-trial accounts.</li>
        <li><strong>Notification settings:</strong> if you turn on push notifications, your browser gives us a technical address to send them to.</li>
        <li><strong>AI coach messages (Elite):</strong> the questions you ask and the journal figures needed to answer them.</li>
        <li><strong>Technical data:</strong> IP address, browser type and log records needed to keep you signed in, keep the service secure and fix problems.</li>
      </ul>

      <h2>Why we use it, and our legal basis</h2>
      <ul>
        <li><strong>To provide the service you signed up for</strong>: your account, journal, sync between devices, billing and account emails (confirmation, password reset, welcome, billing). Legal basis: <em>contract</em>.</li>
        <li><strong>To keep the service secure and prevent abuse</strong>, including fraud and repeat free trials. Legal basis: <em>legitimate interests</em>.</li>
        <li><strong>To send reminders and push notifications</strong> you've turned on. Legal basis: <em>consent</em>. You can turn them off any time in Settings.</li>
        <li><strong>To keep financial records</strong> as tax law requires. Legal basis: <em>legal obligation</em>.</li>
        <li><strong>To improve the service</strong>, using support conversations and aggregated, non-identifying information. Legal basis: <em>legitimate interests</em>.</li>
      </ul>
      <p>We don't sell your data, we don't use your trades for advertising, and we don't make automated decisions about you that have legal or similarly significant effects.</p>

      <h2>Who we share it with</h2>
      <p>We use trusted providers ("processors") who only handle data on our instructions:</p>
      <ul>
        <li><strong>Supabase</strong>: database, file storage and login. Our database is hosted in London.</li>
        <li><strong>Vercel</strong>: website hosting.</li>
        <li><strong>Stripe</strong>: payments and subscriptions.</li>
        <li><strong>Resend</strong>: sending account emails.</li>
        <li><strong>Twilio</strong>: sending phone verification codes, if phone verification is in use.</li>
        <li><strong>Anthropic</strong>: powering the AI coach on the Elite plan. Only what's needed to answer your question is sent.</li>
        <li><strong>Your browser's push service</strong> (for example Apple or Google): delivering notifications you've turned on.</li>
      </ul>
      <p>We may also share data if the law requires it, or to protect our rights and users' safety.</p>

      <h2>International transfers</h2>
      <p>Some of these providers are based in, or use services in, the United States or elsewhere outside the UK. Where data leaves the UK, we rely on protections recognised by UK law, such as the UK–US data bridge, adequacy regulations or the UK International Data Transfer Agreement.</p>

      <h2>How long we keep it</h2>
      <ul>
        <li>Your journal and account: until you delete them or close your account.</li>
        <li>Billing and tax records: as long as the law requires (normally 6 years).</li>
        <li>Free-trial card fingerprints: kept to prevent repeat trials, without your card details.</li>
        <li>Technical logs: short periods, usually a few weeks.</li>
      </ul>

      <h2>How we protect it</h2>
      <p>Data is encrypted in transit (HTTPS). Each user can only reach their own journal: this is enforced by database security rules, not just the app. Screenshots are stored privately. Payment details stay with Stripe. No system is perfectly secure, so please use a strong, unique password.</p>

      <h2>Your rights</h2>
      <p>You can export or delete your journal at any time from Settings → Data &amp; privacy. You also have the right to:</p>
      <ul>
        <li>get a copy of your personal data;</li>
        <li>have it corrected or deleted;</li>
        <li>object to, or ask us to restrict, how we use it;</li>
        <li>receive it in a portable format;</li>
        <li>withdraw consent (for example, for notifications) at any time.</li>
      </ul>
      <p>Email <Email /> to use any of these rights. We'll reply within one month. If you're unhappy with how we've handled your data, you can complain to the Information Commissioner's Office at <a className="link" href="https://ico.org.uk" rel="noopener">ico.org.uk</a>. We'd appreciate the chance to sort it out first.</p>

      <h2>Cookies</h2>
      <p>We only use cookies and similar storage that are needed to keep you signed in and remember your settings. No advertising or tracking cookies. See our <Link className="link" href="/cookies">cookie policy</Link>.</p>

      <h2>Children</h2>
      <p>The Execution Log is for adults. We don't knowingly collect data from anyone under 18.</p>

      <h2>Changes</h2>
      <p>If we change this policy in a way that matters, we'll update the date at the top and, for significant changes, email you.</p>
    </LegalPage>
  );
}
