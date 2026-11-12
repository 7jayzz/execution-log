import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { afterLogin } from "@/lib/after-login";
import { SITE_URL, safeNext } from "@/lib/site";

// Links in the confirmation and password-reset emails land here.
export async function GET(request) {
  try {
    return await confirm(request);
  } catch (e) {
    console.error("Confirm link failed", e);
    return NextResponse.redirect(`${SITE_URL}/login?error=link`);
  }
}

async function confirm(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const code = searchParams.get("code");
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
  // Supabase's default email templates send a one-time code instead (works in the browser you signed up in).
  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const next = safeNext(searchParams.get("next"));
      if (next === "/reset-password") return NextResponse.redirect(`${SITE_URL}/reset-password`);
      await afterLogin(data.user);
      const dest = new URL(next, SITE_URL);
      dest.searchParams.set("welcome", "1");
      return NextResponse.redirect(dest.toString());
    }
    // The one-time code only works in the browser the person signed up in. Supabase has already confirmed the
    // email by this point, so say so rather than showing an "expired link" error.
    return NextResponse.redirect(`${SITE_URL}/login?error=confirmed`);
  }
  return NextResponse.redirect(`${SITE_URL}/login?error=link`);
}
