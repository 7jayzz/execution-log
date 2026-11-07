import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { afterLogin } from "@/lib/after-login";
import { SITE_URL, safeNext } from "@/lib/site";

// Links in the confirmation and password-reset emails land here.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const allowed = ["email", "signup", "recovery", "email_change", "invite", "magiclink"];
  if (token_hash && allowed.includes(type)) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      if (type === "recovery") return NextResponse.redirect(`${SITE_URL}/reset-password`);
      await afterLogin(data.user);
      const dest = new URL(safeNext(searchParams.get("next")), SITE_URL);
      dest.searchParams.set("welcome", "1");
      return NextResponse.redirect(dest.toString());
    }
  }
  return NextResponse.redirect(`${SITE_URL}/login?error=link`);
}
