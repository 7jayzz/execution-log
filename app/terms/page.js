import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata = { title: "Terms" };

// TEMPLATE: have this checked before launch.
export default function Terms() {
  return (
    <div className="site" style={{ gap: 30 }}>
      <SiteNav user={null} />
      <article className="legal">
        <h1>Terms of Service</h1>
        <p>Last updated: [date]</p>
        <h2>The service</h2>
        <p>The Execution Log is a journal for recording and reviewing your own trades. It is not financial advice, and nothing in it is a recommendation to buy or sell anything. Trading carries a high risk of losing money.</p>
        <h2>Your account</h2>
        <p>Keep your login details safe. You're responsible for what happens on your account. You must be 18 or over to subscribe.</p>
        <h2>Subscriptions</h2>
        <p>Plans renew automatically each month or year until you cancel. New subscribers get a free trial; you won't be charged until it ends and you can cancel before then. You can cancel any time from Settings → Subscription & billing, and you keep access until the end of the period you've paid for.</p>
        <h2>Your data</h2>
        <p>Your journal is yours. You can export or delete it at any time. See our Privacy Policy.</p>
        <h2>Changes and availability</h2>
        <p>We work to keep the service running but can't promise it will always be available or error-free. Check figures against your broker statements.</p>
        <h2>Contact</h2>
        <p>[your name or company], [address], [email].</p>
      </article>
      <SiteFooter />
    </div>
  );
}
