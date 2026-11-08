import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendToUser } from "@/lib/push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// "Send a test" button in Settings → Notifications.
export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  try {
    const sent = await sendToUser(createAdminClient(), user.id, {
      title: "Push notifications are on",
      body: "This is how The Execution Log will remind you to journal, review and stay within your rules.",
      url: "/dashboard",
      tag: "test",
    });
    return NextResponse.json({ sent });
  } catch (e) {
    console.error("Test push failed", e);
    return NextResponse.json({ error: "Could not send" }, { status: 500 });
  }
}
