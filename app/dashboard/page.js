import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubscription, isActive, subscriptionSummary } from "@/lib/subscription";
import AppShell from "./AppShell";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function Dashboard({ searchParams }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  let sub = await getSubscription(supabase, user.id);
  // Coming straight back from Stripe: the webhook can take a few seconds.
  if (!isActive(sub) && searchParams?.checkout === "success") {
    for (let i = 0; i < 5 && !isActive(sub); i++) {
      await new Promise((r) => setTimeout(r, 1200));
      sub = await getSubscription(supabase, user.id);
    }
  }
  if (!isActive(sub)) redirect("/pricing");

  return (
    <AppShell
      user={{ id: user.id, email: user.email, name: user.user_metadata?.full_name || user.user_metadata?.name || "" }}
      subscription={subscriptionSummary(sub)}
    />
  );
}
