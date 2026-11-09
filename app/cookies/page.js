import LegalPage, { Email } from "@/components/LegalPage";

export const metadata = { title: "Cookie Policy" };

export default function Cookies() {
  return (
    <LegalPage title="Cookie Policy" current="/cookies" intro="We keep this short because we only use what's needed to make the site work. No advertising cookies, no tracking across other websites.">
      <h2>What we use</h2>
      <ul>
        <li><strong>Sign-in cookies</strong> (set by our login provider, Supabase): keep you signed in securely. Without them, you'd have to log in on every page.</li>
        <li><strong>Payment cookies</strong> (set by Stripe on the checkout and billing pages): needed to take payments safely and prevent fraud.</li>
        <li><strong>Local storage in your browser</strong>: remembers your preferences on this device, such as theme, language, the view you were last on, and whether you prefer quick or full trade entry.</li>
        <li><strong>Service worker</strong>: lets the site show push notifications if you've turned them on.</li>
      </ul>
      <p>These are all "strictly necessary" for the service you've asked for, so the law doesn't require us to ask for consent first.</p>

      <h2>What we don't use</h2>
      <p>No advertising cookies, no social media tracking pixels, and no third-party analytics that follow you around the web. If we ever add analytics, we'll update this page and ask for your consent where the law requires it.</p>

      <h2>Controlling cookies</h2>
      <p>You can clear or block cookies in your browser settings. If you block the sign-in cookies, you won't be able to stay logged in.</p>

      <h2>Questions</h2>
      <p>Email <Email />.</p>
    </LegalPage>
  );
}
