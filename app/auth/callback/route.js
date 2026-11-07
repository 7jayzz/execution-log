import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { afterLogin } from "@/lib/after-login";
import { SITE_URL, safeNext } from "@/lib/site";

// Google and Apple sign-in come back here.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));
  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      await afterLogin(data.user);
      return NextResponse.redirect(`${SITE_URL}${next}`);
    }
  }
  return NextResponse.redirect(`${SITE_URL}/login?error=oauth`);
}
