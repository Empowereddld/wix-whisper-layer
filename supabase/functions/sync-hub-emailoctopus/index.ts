// Server-side sync of confirmed Resource Library (hub) accounts to EmailOctopus.
// Runs on a schedule so syncing no longer depends on the user's browser.
// Idempotent: emailoctopus_synced_users records who has been synced, and the
// emailoctopus-subscribe function itself is idempotent per email.
// Never resubscribes: the subscribe function only updates tags/fields on
// existing contacts and never sends a status on update.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const cronSecret = Deno.env.get("CRON_SECRET");
  if (!cronSecret || req.headers.get("x-cron-secret") !== cronSecret) {
    return json({ error: "Unauthorized" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey);

  // Optional body: { backfill: true } processes all confirmed users ever,
  // not just recently confirmed ones. Default: last 48h (schedule overlap-safe).
  let backfill = false;
  try {
    const body = await req.json();
    backfill = body?.backfill === true;
  } catch { /* empty body is fine */ }

  const since = backfill
    ? null
    : new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  // Page through auth users (admin API).
  const confirmed: Array<{
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  }> = [];

  let page = 1;
  const perPage = 200;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) {
      console.error("listUsers failed:", error);
      return json({ error: "Could not list users" }, 500);
    }
    const users = data?.users ?? [];
    for (const u of users) {
      if (!u.email || !u.email_confirmed_at) continue;
      if (since && u.email_confirmed_at < since) continue;
      const meta = (u.user_metadata ?? {}) as Record<string, string>;
      let first = (meta.first_name ?? "").trim();
      let last = (meta.last_name ?? "").trim();
      if (!first && !last) {
        first = (meta.given_name ?? "").trim();
        last = (meta.family_name ?? "").trim();
        if (!first && meta.full_name) {
          const parts = meta.full_name.trim().split(/\s+/);
          first = parts[0] || "";
          last = parts.slice(1).join(" ");
        }
      }
      confirmed.push({ id: u.id, email: u.email, first_name: first, last_name: last });
    }
    if (users.length < perPage) break;
    page += 1;
  }

  // Skip users already synced.
  const ids = confirmed.map((u) => u.id);
  const alreadySynced = new Set<string>();
  for (let i = 0; i < ids.length; i += 500) {
    const { data } = await admin
      .from("emailoctopus_synced_users")
      .select("user_id")
      .in("user_id", ids.slice(i, i + 500));
    for (const row of data ?? []) alreadySynced.add(row.user_id);
  }

  const toSync = confirmed.filter((u) => !alreadySynced.has(u.id));

  // Look up affirmative newsletter consent for the users we're about to sync.
  const consentedIds = new Set<string>();
  const toSyncIds = toSync.map((u) => u.id);
  for (let i = 0; i < toSyncIds.length; i += 500) {
    const { data } = await admin
      .from("newsletter_consents")
      .select("user_id")
      .eq("consented", true)
      .in("user_id", toSyncIds.slice(i, i + 500));
    for (const row of data ?? []) {
      if (row.user_id) consentedIds.add(row.user_id);
    }
  }

  let synced = 0;
  const failures: Array<{ email: string; error: string }> = [];
  for (const u of toSync) {
    try {
      const tags = ["resource-hub"];
      if (consentedIds.has(u.id)) tags.push("newsletter");
      const res = await fetch(`${supabaseUrl}/functions/v1/emailoctopus-subscribe`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: u.email,
          tags,
          first_name: u.first_name,
          last_name: u.last_name,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        failures.push({ email: u.email, error: `HTTP ${res.status}: ${text.slice(0, 200)}` });
        continue;
      }
      await admin.from("emailoctopus_synced_users").insert({ user_id: u.id });
      synced += 1;
    } catch (e) {
      failures.push({ email: u.email, error: String(e).slice(0, 200) });
    }
  }

  return json({
    ok: true,
    backfill,
    confirmed_found: confirmed.length,
    already_synced: alreadySynced.size,
    synced,
    failed: failures.length,
    failures: failures.slice(0, 20),
  });
});
