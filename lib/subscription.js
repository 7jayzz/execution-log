import { planForPrice } from "@/lib/plans";

export const ACTIVE_STATUSES = ["active", "trialing"];

export async function getSubscription(supabase, userId) {
  const { data } = await supabase.from("subscriptions").select("*").eq("user_id", userId).maybeSingle();
  return data || null;
}

export function isActive(sub) {
  return !!sub && ACTIVE_STATUSES.includes(sub.status);
}

// The small, safe summary the journal's Billing tab shows.
export function subscriptionSummary(sub) {
  if (!sub) return { status: "none", plan: null, current_period_end: null, cancel_at_period_end: false };
  return {
    status: sub.status || "none",
    plan: planForPrice(sub.price_id),
    current_period_end: sub.status === "trialing" && sub.trial_end ? sub.trial_end : sub.current_period_end,
    cancel_at_period_end: !!sub.cancel_at_period_end,
  };
}
