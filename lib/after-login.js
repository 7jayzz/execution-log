import { createAdminClient } from "@/lib/supabase/admin";
import { sendWelcomeEmail } from "@/lib/email";

// Sends the welcome email exactly once, the first time a confirmed user signs in.
export async function afterLogin(user) {
  if (!user || !user.email) return;
  const provider = user.app_metadata?.provider;
  if (provider === "email" && !user.email_confirmed_at) return;
  try {
    const admin = createAdminClient();
    const name = user.user_metadata?.full_name || user.user_metadata?.name || "";
    // Make sure the profile row exists (the database trigger normally creates it).
    await admin.from("profiles").upsert({ id: user.id, full_name: name }, { onConflict: "id", ignoreDuplicates: true });
    // Claim the welcome atomically so two tabs can't both send it.
    const { data: claimed } = await admin
      .from("profiles")
      .update({ welcomed_at: new Date().toISOString() })
      .eq("id", user.id)
      .is("welcomed_at", null)
      .select("id");
    if (!claimed || !claimed.length) return;
    await sendWelcomeEmail({ to: user.email, name });
  } catch (e) {
    console.error("Welcome email failed", e);
  }
}
