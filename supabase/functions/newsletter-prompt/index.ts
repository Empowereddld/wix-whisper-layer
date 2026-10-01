// One-time newsletter opt-in prompt for existing Resource Library users and
// Story Pros waitlist members who have never made a newsletter choice.
// Actions: "status" (should we show the prompt?) and "record" (save a choice).
// A "no" record never revokes an earlier "yes"; status is never sent to EmailOctopus.

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createHash } from "node:crypto";

const WORDING_VERSION = "newsletter-consent-v1";
const WORDING = {
  hub: {
    source: "resource-library-existing-prompt",
    sourceTag: "resource-hub",
    checkbox: "Yes, I'd like practical DLD tips, new resources, and occasional updates from Empowered DLD by email.",
    helper: "Optional. You can unsubscribe at any time. Your Resource Library access is not affected.",
  },
  storypros: {
    source: "story-pros-existing-prompt",
    sourceTag: "story-pros",
    checkbox: "Yes, I'd like practical DLD resources, Empowered DLD updates, and occasional Story Pros news by email.",
    helper: "Optional. You'll stay on the Story Pros waitlist whether or not you choose this. You can unsubscribe at any time.",
  },
} as const;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Returns true when EmailOctopus already shows a decision (newsletter tag or
// unsubscribed). Fails closed: if we can't check, treat as decided.
async function emailOctopusDecided(email: string): Promise<boolean> {
  const apiKey = Deno.env.get("EMAILOCTOPUS_API_KEY");
  const listId = Deno.env.get("EMAILOCTOPUS_LIST_ID");
  if (!apiKey || !listId) return true;
  const hash = createHash("md5").update(email.toLowerCase()).digest("hex");
  try {
    const res = await fetch(
      `https://api.emailoctopus.com/lists/${encodeURIComponent(listId)}/contacts/${hash}`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );
    if (res.status === 404) return false;
    if (!res.ok) return true;
    const c = await res.json();
    const status = String(c.status ?? "").toLowerCase();
    if (status === "unsubscribed") return true;
    const tags: string[] = Array.isArray(c.tags) ? c.tags : Object.keys(c.tags ?? {});
    return tags.includes("newsletter");
  } catch {
    return true;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }
  const action = body.action;
  const kind = body.kind;
  if (action !== "status" && action !== "record") return json({ error: "Invalid action" }, 400);
  if (kind !== "hub" && kind !== "storypros") return json({ error: "Invalid kind" }, 400);
  if (action === "record" && typeof body.consented !== "boolean") {
    return json({ error: "consented must be true or false" }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey);

  // Identify the person.
  let userId: string | null = null;
  let waitlistId: string | null = null;
  let email = "";
  let firstName = "";
  let lastName = "";

  if (kind === "hub") {
    const auth = req.headers.get("Authorization") ?? "";
    const token = auth.replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "Unauthorized" }, 401);
    const { data, error } = await admin.auth.getUser(token);
    if (error || !data.user?.email || !data.user.email_confirmed_at) {
      return json({ error: "Unauthorized" }, 401);
    }
    userId = data.user.id;
    email = data.user.email.toLowerCase();
    const { data: prof } = await admin
      .from("profiles").select("first_name, last_name, interests").eq("id", userId).maybeSingle();
    // New users answer this during onboarding instead.
    if (action === "status" && (!prof || prof.interests === null)) return json({ show: false });
    firstName = prof?.first_name ?? "";
    lastName = prof?.last_name ?? "";
  } else {
    const code = typeof body.referral_code === "string" ? body.referral_code.trim() : "";
    if (!code || code.length > 64) return json({ error: "referral_code required" }, 400);
    const { data: row } = await admin
      .from("storybuilders_waitlist")
      .select("id, email, name, email_verified, deleted_at")
      .eq("referral_code", code)
      .maybeSingle();
    if (!row || row.deleted_at || !row.email_verified) {
      return action === "status" ? json({ show: false }) : json({ error: "Not found" }, 404);
    }
    waitlistId = row.id;
    email = String(row.email).toLowerCase();
    const parts = String(row.name ?? "").trim().split(/\s+/);
    firstName = parts[0] ?? "";
    lastName = parts.slice(1).join(" ");
  }

  // Any existing consent record (yes or no) for this person or email = decided.
  const idFilter = userId ? `user_id.eq.${userId}` : `waitlist_id.eq.${waitlistId}`;
  const { data: existing } = await admin
    .from("newsletter_consents")
    .select("id")
    .or(`${idFilter},email.eq.${email}`)
    .limit(1);
  const alreadyDecided = (existing?.length ?? 0) > 0;

  if (action === "status") {
    if (alreadyDecided) return json({ show: false });
    return json({ show: !(await emailOctopusDecided(email)) });
  }

  // record
  const w = WORDING[kind];
  const consented = body.consented as boolean;
  if (alreadyDecided && !consented) return json({ success: true, skipped: true });

  const { error: insErr } = await admin.from("newsletter_consents").insert({
    user_id: userId,
    waitlist_id: waitlistId,
    email,
    consented,
    source: w.source,
    wording_version: WORDING_VERSION,
    checkbox_text: w.checkbox,
    helper_text: w.helper,
  });
  if (insErr) {
    console.error("newsletter-prompt insert failed", insErr);
    return json({ error: "Could not save choice" }, 500);
  }

  if (consented) {
    try {
      await fetch(`${supabaseUrl}/functions/v1/emailoctopus-subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${serviceKey}` },
        body: JSON.stringify({
          email,
          tags: [w.sourceTag, "newsletter"],
          first_name: firstName,
          last_name: lastName,
        }),
      });
    } catch (e) {
      console.error("newsletter-prompt EmailOctopus sync failed", e);
    }
  }
  return json({ success: true });
});
