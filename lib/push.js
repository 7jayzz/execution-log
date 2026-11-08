// Server-side web push. The signing key lives in Supabase Vault, read with the service role.
import webpush from "web-push";
import { SITE_URL } from "@/lib/site";

export const VAPID_PUBLIC = "BELvHtMwbiJSR-hM_pitbIkLQ7IYnNeLHMvKpTeAv7QNNpZ0AWpWki5yhlYc2ls90Qv5dxIUcunknkyms7cmh_I";

let secrets = null;
export async function pushSecrets(admin) {
  if (secrets) return secrets;
  const { data, error } = await admin.rpc("get_push_secrets");
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.vapid_private) throw new Error("Push key missing from Vault");
  secrets = { vapidPrivate: row.vapid_private, cronSecret: row.cron_secret || "" };
  return secrets;
}

// Sends one notification to every device a user has turned push on for. Removes devices that have gone.
export async function sendToUser(admin, userId, payload) {
  const { vapidPrivate } = await pushSecrets(admin);
  const subject = SITE_URL.startsWith("https://") ? SITE_URL : "mailto:support@theexecutionlog.app";
  const { data: subs } = await admin.from("push_subscriptions").select("endpoint,p256dh,auth").eq("user_id", userId);
  let sent = 0;
  for (const s of subs || []) {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        JSON.stringify(payload),
        { TTL: 60 * 60 * 6, vapidDetails: { subject, publicKey: VAPID_PUBLIC, privateKey: vapidPrivate } }
      );
      sent++;
    } catch (e) {
      if (e?.statusCode === 404 || e?.statusCode === 410) await admin.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
      else console.error("Push failed", e?.statusCode, e?.body || e?.message);
    }
  }
  return sent;
}
