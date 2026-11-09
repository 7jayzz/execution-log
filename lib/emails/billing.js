import { layout, p, small, strong, facts, button, esc, firstName, money, longDate } from "@/lib/emails/layout";

const PLAN_NAMES = { basic: "Basic", pro: "Pro", elite: "Elite" };
const planLabel = (plan, interval) => `${PLAN_NAMES[plan] || "Your plan"} (${interval === "year" ? "yearly" : "monthly"})`;

// Sent by Stripe's trial_will_end event, 3 days before the trial finishes.
export function trialEndingEmail({ name, email, plan, interval, amount, currency, trialEnd, billingUrl, dashboardUrl }) {
  const when = longDate(trialEnd);
  const price = money(amount, currency);
  const body = [
    p(`Hi ${esc(firstName(name))}, your free trial of The Execution Log ends on ${strong(esc(when))}.`),
    p(`If you're enjoying it, you don't need to do anything. Your plan starts automatically and you'll be charged then.`),
    facts([["Plan", planLabel(plan, interval)], ["First payment", price], ["Charged on", when]]),
    button(dashboardUrl, "Open my journal"),
    p(`Not for you? Cancel before ${esc(when)} and you won't pay anything. <a href="${esc(billingUrl)}" style="color:#F4B53F;">Manage or cancel your plan</a>.`),
    small(`Quick tip before it ends: check your Insights page. A week of trades is usually enough to spot your best setup and your most expensive habit.`),
  ].join("");
  const text = `Hi ${firstName(name)},\n\nYour free trial of The Execution Log ends on ${when}.\n\nIf you're enjoying it, you don't need to do anything. Your ${planLabel(plan, interval)} plan starts automatically and you'll be charged ${price} then.\n\nNot for you? Cancel before ${when} and you won't pay anything: ${billingUrl}\n\nOpen your journal: ${dashboardUrl}\n\n— The Execution Log`;
  return {
    subject: `Your free trial ends ${when.split(",")[0]}`,
    html: layout({ title: "Your free trial is ending", preheader: `Your trial ends on ${when}. Nothing to do if you're staying.`, heading: "Your trial ends soon", body, footer: `You're getting this because you started a free trial with ${esc(email)}.` }),
    text,
  };
}

// Sent when a renewal or first payment fails, so access isn't lost by surprise.
export function paymentFailedEmail({ name, email, plan, interval, amount, currency, nextAttempt, billingUrl }) {
  const price = money(amount, currency);
  const retry = nextAttempt ? longDate(nextAttempt) : "";
  const body = [
    p(`Hi ${esc(firstName(name))}, we couldn't take your payment of ${strong(esc(price))} for The Execution Log.`),
    p(`This usually happens when a card has expired, been replaced, or the bank declined it. Your journal and data are safe.`),
    facts([["Plan", planLabel(plan, interval)], ["Amount", price], ...(retry ? [["We'll try again", retry]] : [])]),
    button(billingUrl, "Update payment details"),
    small(`If the payment still can't be taken, paid features will be paused until it is. Your data is never deleted because of a failed payment.`),
  ].join("");
  const text = `Hi ${firstName(name)},\n\nWe couldn't take your payment of ${price} for The Execution Log. Your journal and data are safe.\n${retry ? `\nWe'll try again on ${retry}.\n` : ""}\nUpdate your payment details: ${billingUrl}\n\n— The Execution Log`;
  return {
    subject: "Your payment didn't go through",
    html: layout({ title: "Payment failed", preheader: "Update your card to keep your plan running.", heading: "Payment didn't go through", body, footer: `You're getting this because you have a subscription with ${esc(email)}.` }),
    text,
  };
}

// Sent when someone cancels, confirming what happens next.
export function cancelledEmail({ name, email, plan, accessUntil, dashboardUrl, billingUrl }) {
  const until = longDate(accessUntil);
  const body = [
    p(`Hi ${esc(firstName(name))}, your ${esc(PLAN_NAMES[plan] || "")} plan has been cancelled${until ? ` and won't renew. You keep full access until ${strong(esc(until))}` : ""}.`),
    p(`Your journal stays yours. You can export everything from Settings → Data &amp; privacy at any time.`),
    button(dashboardUrl, "Open my journal"),
    small(`Changed your mind? You can restart your plan from <a href="${esc(billingUrl)}" style="color:#F4B53F;">billing</a> before it ends. If you have a minute, reply and tell us what we could do better. We read every reply.`),
  ].join("");
  const text = `Hi ${firstName(name)},\n\nYour plan has been cancelled${until ? ` and won't renew. You keep full access until ${until}` : ""}.\n\nYour journal stays yours. Export everything from Settings → Data & privacy any time.\n\nChanged your mind? ${billingUrl}\n\n— The Execution Log`;
  return {
    subject: "Your plan has been cancelled",
    html: layout({ title: "Plan cancelled", preheader: until ? `You keep access until ${until}.` : "Your plan won't renew.", heading: "Sorry to see you go", body, footer: `You're getting this because you had a subscription with ${esc(email)}.` }),
    text,
  };
}
