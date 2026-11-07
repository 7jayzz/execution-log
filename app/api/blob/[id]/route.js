import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Serves a trade screenshot to its owner only.
export async function GET(_request, { params }) {
  const id = params.id;
  if (!/^[0-9a-f]{32}$/.test(id)) return new Response("Not found", { status: 404 });
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Not found", { status: 404 });
  const { data, error } = await supabase.storage.from("shots").download(`${user.id}/${id}`);
  if (error || !data) return new Response("Not found", { status: 404 });
  return new Response(data, {
    headers: { "Content-Type": data.type || "image/png", "Cache-Control": "private, max-age=86400" },
  });
}
