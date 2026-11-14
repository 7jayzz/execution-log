import Link from "next/link";
import LegalPage, { WhoWeAre, Email } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata = { title: "Terms of Service" };

// DRAFT: have a solicitor check this before taking real payments.
export default function Terms() {
  const d = LEGAL.trialDays;
  return (
    <LegalPage title="Terms of Service" current="/terms" intro="These terms are the agreement between you and us when you use The Execution Log. We've written them in plain English. Please read them before you subscribe.">
      <h2>1. Who we are</h2>
      <p><WhoWeAre /></p>
      <p>"We", "us" and "our" mean The Execution Log. "You" means the person using it.</p>

      <h2>2. What The Execution Log is</h2>
      <p>The Execution Log is an online trading journal. It helps you record your own trades and review your results, habits and goals. It is a record-keeping and self-review tool.</p>
      <p><strong>It is not financial advice.</strong> Nothing in the service, including statistics, insights, reminders, prop firm templates or the AI coach, is a recommendation to buy, sell or hold anything, or a prediction of future results. We are not authorised by the Financial Conduct Authority to give investment advice, and we don't. Trading carries a high risk of losing money. See our <Link className="link" href="/disclaimer">risk disclaimer</Link>.</p>

      <h2>3. Who can use it</h2>
      <p>You must be 18 or over and able to enter into a contract. One account is for one person. Don't share your login.</p>

      <h2>4. Your account</h2>
      <ul>
        <li>Give accurate details when you sign up, and keep them up to date.</li>
        <li>Keep your password safe. You're responsible for activity on your account unless it happened because of our failure.</li>
        <li>Tell us straight away at <Email /> if you think someone else has accessed your account.</li>
      </ul>

      <h2>5. Plans, prices and payment</h2>
      <p>Our plans and prices are shown on our <Link className="link" href="/pricing">pricing page</Link>. Prices are in pounds sterling and include any VAT that applies. You can pay monthly or yearly. Paying yearly costs the same as 10 months.</p>
      <p>Payments are taken by our payment provider, Stripe. Your subscription renews automatically at the end of each billing period, at the price shown when you subscribed, until you cancel. If we ever change the price of your plan, we'll email you at least 30 days before the new price applies, and you can cancel before then.</p>

      <h2>6. Free trial</h2>
      <ul>
        <li>New subscribers get a {d}-day free trial. You need to add a card to start it.</li>
        <li>You won't be charged during the trial. If you don't cancel before it ends, your plan starts and you're charged for your first billing period.</li>
        <li>Free trials are limited to one per person and one per payment card, and aren't available on prepaid cards. If you or your card have had a trial before, or you pay with a prepaid card, your plan starts straight away and you'll be charged at checkout.</li>
        <li>You can cancel during the trial at no cost from Settings → Subscription &amp; billing.</li>
      </ul>

      <h2>7. Changing your plan</h2>
      <p>Upgrades start straight away. You're charged the difference for the rest of your current billing period. Downgrades, and switching from yearly to monthly, take effect at your next renewal date, and you keep your current plan until then.</p>
      <p>Some features depend on your plan, for example the number of trading accounts. If you downgrade, your data is kept, but features outside your new plan may become read-only or unavailable.</p>

      <h2>8. Cancelling</h2>
      <p>You can cancel any time from Settings → Subscription &amp; billing. Your plan stays active until the end of the period you've paid for, then it stops renewing. Refunds are covered in our <Link className="link" href="/refunds">refund policy</Link>, which includes your legal right to cancel within 14 days.</p>
      <p>If a payment fails, we'll try again and let you know. If it still can't be taken, your access to paid features may be paused until it is.</p>

      <h2>9. Your data and content</h2>
      <p>Everything you put in your journal (trades, notes, screenshots, goals) belongs to you. You give us permission to store and process it only so we can run the service for you. We don't sell it, and we don't use your trades for advertising.</p>
      <p>You can export your journal or delete it at any time from Settings → Data &amp; privacy. Our <Link className="link" href="/privacy">privacy policy</Link> explains how we handle personal data.</p>
      <p>Please don't upload anything that you don't have the right to share, that's unlawful, or that contains someone else's personal information without their permission.</p>

      <h2>10. Using the service fairly</h2>
      <p>You agree not to:</p>
      <ul>
        <li>try to access other people's accounts or data, or get around our security or plan limits;</li>
        <li>reverse-engineer, copy, scrape or resell the service;</li>
        <li>overload it with automated requests, or use it to send spam or malicious code;</li>
        <li>create multiple accounts or use different cards to get more than one free trial.</li>
      </ul>
      <p>If you break these terms seriously or repeatedly, we may suspend or close your account. Where we reasonably can, we'll warn you first and give you a chance to export your data.</p>

      <h2>11. Accuracy of figures</h2>
      <p>Statistics are calculated from the trades and settings you enter or import. Imports, exchange rates and contract sizes can be wrong or out of date. Always check figures against your broker or prop firm statements. Your broker's records are the official ones.</p>
      <p>Prop firm templates are provided for convenience and show the date we last checked them. Firms change their rules, so confirm the current rules with your firm. We're not affiliated with any broker, platform or prop firm.</p>

      <h2>12. Availability and changes</h2>
      <p>We work hard to keep The Execution Log running and your data safe, but we can't promise it will always be available or error-free. We may improve, change or remove features. If we make a change that significantly reduces what your paid plan includes, we'll tell you in advance and you can cancel and get a refund for any unused prepaid period.</p>

      <h2>13. Our responsibility to you</h2>
      <p>If we fail to meet these terms, we're responsible for loss or damage you suffer that is a foreseeable result of that failure. We're not responsible for loss that isn't foreseeable.</p>
      <p>We're not responsible for trading decisions you make or any trading losses, for business losses (you're using the service for personal record-keeping), or for problems caused by events outside our reasonable control.</p>
      <p>Apart from that, our total liability to you is limited to the amount you've paid us in the 12 months before the problem happened. Nothing in these terms limits liability for death or personal injury caused by negligence, fraud, or anything else that can't be limited by law, and nothing affects your legal rights as a consumer.</p>

      <h2>14. Closing your account</h2>
      <p>You can stop using the service and delete your data at any time. To close your login completely, email <Email /> and we'll do it. When an account is closed, we delete your journal data, keeping only what the law requires us to keep (such as billing records).</p>

      <h2>15. Changes to these terms</h2>
      <p>We may update these terms, for example when we add features or the law changes. If a change significantly affects you, we'll email you at least 30 days before it applies. If you don't agree, you can cancel before it takes effect.</p>

      <h2>16. Complaints and the law</h2>
      <p>If something's wrong, email <Email /> and we'll try to sort it out quickly. These terms are governed by the law of England and Wales. If you live in Scotland or Northern Ireland, you can also bring proceedings in your local courts.</p>
    </LegalPage>
  );
}
