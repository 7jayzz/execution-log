import Link from "next/link";
import LegalPage, { Email } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata = { title: "Refund Policy" };

// DRAFT: have this checked before launch.
export default function Refunds() {
  return (
    <LegalPage title="Refund Policy" current="/refunds" intro="Simple version: try it free first, cancel any time, and if you're charged and change your mind within 14 days, we'll refund you in full.">
      <h2>Free trial</h2>
      <p>New subscribers get a {LEGAL.trialDays}-day free trial. Cancel before it ends and you won't be charged anything.</p>

      <h2>14-day money-back guarantee</h2>
      <p>If you're charged for a new subscription, or for a yearly renewal, and you change your mind, email <Email /> within <strong>14 days of the payment</strong>. We'll cancel your plan and refund that payment in full.</p>
      <p>This includes your legal right to cancel a new contract within 14 days under the Consumer Contracts Regulations. We don't deduct anything for the days you've used.</p>

      <h2>After 14 days</h2>
      <p>You can cancel any time from Settings → Subscription &amp; billing. Your plan stays active until the end of the period you've paid for and won't renew. We don't give partial refunds for unused time, except:</p>
      <ul>
        <li>if we've charged you by mistake, for example twice;</li>
        <li>if the service had a serious problem we couldn't fix within a reasonable time;</li>
        <li>if we significantly reduced what your plan includes, or raised the price, and you cancelled because of it;</li>
        <li>anywhere else the law gives you a right to one.</li>
      </ul>

      <h2>Monthly renewals</h2>
      <p>Monthly renewals aren't covered by the 14-day guarantee, but if you forgot to cancel and haven't used the service since the renewal, email us within 7 days and we'll usually refund it.</p>

      <h2>How refunds are paid</h2>
      <p>Refunds go back to the card you paid with, usually within 5 to 10 working days, depending on your bank.</p>

      <h2>Upgrades and downgrades</h2>
      <p>Upgrades are charged straight away for the rest of your current period. Downgrades take effect at your next renewal, so there's nothing to refund. Full details are in our <Link className="link" href="/terms">terms</Link>.</p>

      <h2>Questions</h2>
      <p>Email <Email /> with the email address on your account. We'll get back to you within 2 working days.</p>
    </LegalPage>
  );
}
