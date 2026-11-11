// Connects the journal (public/journal.html, loaded in an iframe) to Supabase.
// The journal was built against a small storage API: use("db") / use("user") / use("assets") / use("downloads").
// This file provides the same API, backed by your Supabase tables and storage.

const clone = (v) => JSON.parse(JSON.stringify(v));
const hex32 = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");

function makeDb(supabase, uid) {
  const cache = new Map();
  const listeners = new Set();
  let loaded = false;
  let loading = null;
  let channel = null;

  const emit = () => {
    const snap = { metadata: { fromCache: false }, docs: [...cache].map(([id, d]) => ({ id, data: () => clone(d) })) };
    listeners.forEach((fn) => {
      try { fn(snap); } catch (e) { console.error(e); }
    });
  };

  async function load() {
    const rows = [];
    // Page through in case of many trades.
    for (let from = 0; ; from += 1000) {
      const { data, error } = await supabase.from("journal_docs").select("id,data").eq("user_id", uid).range(from, from + 999);
      if (error) throw error;
      rows.push(...data);
      if (data.length < 1000) break;
    }
    cache.clear();
    rows.forEach((r) => cache.set(r.id, r.data));
    loaded = true;
    emit();
  }

  function listen() {
    if (channel) return;
    // Live sync between devices (needs Realtime enabled on journal_docs; see README).
    channel = supabase
      .channel("journal-" + uid)
      .on("postgres_changes", { event: "*", schema: "public", table: "journal_docs", filter: `user_id=eq.${uid}` }, (payload) => {
        if (payload.eventType === "DELETE") cache.delete(payload.old.id);
        else if (payload.new) cache.set(payload.new.id, payload.new.data);
        emit();
      })
      .subscribe();
  }

  const collection = () => ({
    doc: (id) => ({
      async set(data) {
        const { error } = await supabase
          .from("journal_docs")
          .upsert({ user_id: uid, id, data, updated_at: new Date().toISOString() }, { onConflict: "user_id,id" });
        if (error) throw error;
        cache.set(id, clone(data));
        emit();
      },
      async delete() {
        const { error } = await supabase.from("journal_docs").delete().eq("user_id", uid).eq("id", id);
        if (error) throw error;
        cache.delete(id);
        emit();
      },
    }),
    onSnapshot(fn, onError) {
      listeners.add(fn);
      if (loaded) setTimeout(() => fn({ metadata: { fromCache: false }, docs: [...cache].map(([id, d]) => ({ id, data: () => clone(d) })) }), 0);
      else {
        loading = loading || load().catch((e) => { loading = null; if (onError) onError(e); });
      }
      listen();
      return () => listeners.delete(fn);
    },
  });

  return {
    api: { collection },
    dispose() { if (channel) supabase.removeChannel(channel); channel = null; listeners.clear(); },
  };
}

function makeAssets(supabase, uid) {
  return {
    async upload(file, opts = {}) {
      const id = hex32();
      const { error } = await supabase.storage.from("shots").upload(`${uid}/${id}`, file, { contentType: opts.type || file.type, upsert: false });
      if (error) throw /row-level security|policy/i.test(error.message || "") ? { code: "quota", message: "Screenshot storage full" } : { code: "upload_failed", message: error.message };
      return { id, url: "/_blob/" + id, sizeBytes: file.size, contentType: opts.type || file.type };
    },
    // Screenshot storage used and allowed on this plan, in bytes.
    async usage() {
      const { data, error } = await supabase.rpc("my_shot_storage");
      if (error || !data) return null;
      return { used: Number(data.used) || 0, quota: Number(data.quota) || 0, plan: data.plan || null };
    },
    async delete(id) {
      if (!/^[0-9a-f]{32}$/.test(id)) return { deleted: false };
      await supabase.storage.from("shots").remove([`${uid}/${id}`]);
      return { deleted: true };
    },
  };
}

// Screenshots for the AI coach: resized (longest side 1568px) and sent as JPEG.
async function blobToB64(blob) {
  const bmp = await createImageBitmap(blob); const k = Math.min(1, 1568 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas"); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(bmp, 0, 0, c.width, c.height);
  const url = c.toDataURL("image/jpeg", 0.85);
  return { media_type: "image/jpeg", data: url.slice(url.indexOf(",") + 1) };
}

const downloads = {
  async save({ filename, data }) {
    const type = /\.csv$/i.test(filename) ? "text/csv" : /\.json$/i.test(filename) ? "application/json" : "application/octet-stream";
    const blob = data instanceof Blob ? data : new Blob([typeof data === "string" ? data : JSON.stringify(data, null, 2)], { type });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    return { status: "saved" };
  },
};

export function makeHost(supabase, user, subscription) {
  const db = makeDb(supabase, user.id);
  const assets = makeAssets(supabase, user.id);
  return {
    hosted: true,
    user,
    subscription,
    // Ideas and bug reports from inside the journal.
    async feedback(payload) {
      const r = await fetch("/api/feedback", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const b = await r.json().catch(() => ({})); if (!r.ok) throw new Error(b.message || "Couldn't send that right now"); return true;
    },
    // How many AI coach replies are left on this plan (free monthly replies on Basic/Pro, daily on Elite).
    async coachUsage() { try { const r = await fetch("/api/coach"); return r.ok ? await r.json() : null; } catch { return null; } },
    async use(name) {
      if (name === "db") return db.api;
      if (name === "user") return { id: async () => user.id, isOwner: async () => true, canEdit: async () => true };
      if (name === "assets") return assets;
      if (name === "downloads") return downloads;
      if (name === "sample") return async (input, opts = {}) => {
        const images = opts.images?.length ? await Promise.all(opts.images.slice(0, 3).map(blobToB64)) : undefined;
        const res = await fetch("/api/coach", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ prompt: typeof input === "string" ? input : input.map((m) => m.content).join("\n\n"), images }), signal: opts.signal });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          const friendly = res.status === 403 && body.code === "upgrade" && body.resets ? `You've used your ${body.limit} free coach replies this month. They reset on ${new Date(body.resets + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long" })}, or upgrade to Elite for a full coach every day.` : res.status === 403 ? "The AI coach is part of the Elite plan." : res.status === 429 ? "You've reached today's AI coach limit. It resets at midnight." : res.status === 503 ? "The AI coach isn't switched on yet. Please try again later." : res.status === 401 ? "Your session has ended. Log in again to use the coach." : "The AI coach didn't respond. Please try again in a minute.";
          throw { code: res.status === 429 ? "rate_limited" : body.code === "upgrade" ? "upgrade" : "unavailable", message: body.message || "Coach unavailable", friendly };
        }
        if (opts.onText) opts.onText({ text: body.text, delta: body.text });
        if (typeof body.left === "number") window.dispatchEvent(new CustomEvent("tel-coach-usage", { detail: { left: body.left, limit: body.limit, period: body.period } }));
        return { text: body.text, truncated: !!body.truncated };
      };
      return null;
    },
    async signOut(reason) {
      try { await supabase.auth.signOut(); } catch {}
      window.location.href = reason === "idle" ? "/login?reason=idle" : "/";
    },
    // Push notifications. The journal (same origin) asks permission and subscribes itself;
    // these save or remove that device and send a test.
    push: {
      key: "BELvHtMwbiJSR-hM_pitbIkLQ7IYnNeLHMvKpTeAv7QNNpZ0AWpWki5yhlYc2ls90Qv5dxIUcunknkyms7cmh_I",
      async save(sub) {
        const j = sub && sub.keys ? sub : null;
        if (!j || !/^https:\/\//.test(j.endpoint || "")) throw new Error("Bad subscription");
        const { error } = await supabase.from("push_subscriptions").upsert({ endpoint: j.endpoint, user_id: user.id, p256dh: j.keys.p256dh, auth: j.keys.auth, user_agent: navigator.userAgent.slice(0, 200) }, { onConflict: "endpoint" });
        if (error) throw error;
      },
      async remove(endpoint) { if (endpoint) await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint).eq("user_id", user.id); },
      async test() { const r = await fetch("/api/push/test", { method: "POST" }); const b = await r.json().catch(() => ({})); return r.ok ? b.sent || 0 : -1; },
    },
    manageBilling() { window.location.href = "/api/billing-portal"; },
    changePassword() { window.location.href = "/reset-password"; },
    // Deletes the login and everything in it. Returns an error message, or redirects home on success.
    async deleteAccount() {
      const r = await fetch("/api/account/delete", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ confirm: "DELETE" }) });
      const b = await r.json().catch(() => ({}));
      if (!r.ok) return b.error || "Something went wrong. Please try again.";
      try { await supabase.auth.signOut(); } catch {}
      window.location.href = "/?deleted=1";
      return null;
    },
    dispose() { db.dispose(); },
  };
}
