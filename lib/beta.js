import { createAdminClient } from "@/lib/supabase/admin";

// Features switched on for individual accounts only (beta testing). Read with the service role,
// so nobody can grant themselves access from the browser.
export async function betaFeatures(userId) {
  if (!userId) return [];
  try {
    const { data } = await createAdminClient().from("beta_access").select("feature").eq("user_id", userId);
    return (data || []).map((r) => r.feature);
  } catch { return []; }
}
