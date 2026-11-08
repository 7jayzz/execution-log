import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Keeps the login session fresh and sends logged-out visitors away from private pages.
export async function middleware(request) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(list) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  const redirect = (to) => {
    const url = request.nextUrl.clone();
    url.pathname = to;
    url.search = "";
    if (to === "/login") url.searchParams.set("next", path);
    const r = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => r.cookies.set(c));
    return r;
  };

  if (!user && (path.startsWith("/dashboard") || path.startsWith("/reset-password"))) return redirect("/login");
  if (user && (path === "/login" || path === "/signup")) return redirect("/dashboard");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|journal.html|sw.js|manifest.webmanifest|api/stripe/webhook|api/push/cron|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
