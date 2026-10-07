// Adds (or updates) a contact in the EmailOctopus list.
//
// Two calling modes:
//  1) TRUSTED (server functions: exact service key or CRON_SECRET) may pass
//     { email, tags } from the allowed tag set.
//  2) PUBLIC { source } only. Tags come from a fixed server-side map per source;
//     caller-supplied tags are ignored. Form sources sync only an email saved by
//     that form in the last few minutes; "hub" syncs only the signed-in user's
//     own confirmed email, with "newsletter" only if they consented.
//
// Never changes an existing contact's status (unsubscribed stays unsubscribed)
// and skips addresses on the suppression list.

import { createHash } from "node:crypto";
import { createClient } from "npm:@supabase/supabase-js@2";
import { allow, clientIp } from "../_shared/rateLimit.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_TAGS = new Set(["story-pros", "resource-hub", "newsletter", "workshop", "educational-app", "contact", "lead", "legacy-list"]);
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/;
const SUBMISSION_WINDOW_MIN = 15;

type FormSource = { table: string; cols: string; notes?: string; tags: string[] };
const FORM_SOURCES: Record<string, FormSource> = {
  footer: { table: "waitlist", cols: "name", notes: "footer newsletter", tags: ["newsletter"] },
  workshop: { table: "waitlist", cols: "name", notes: "Parent Workshop waitlist", tags: ["workshop"] },
  "educational-app": { table: "waitlist", cols: "name", notes: "Educational App waitlist", tags: ["educational-app"] },
  contact: { table: "contact_submissions", cols: "first_name, last_name", tags: ["contact"] },
  lead: { table: "lead_captures", cols: "name", tags: ["lead"] },
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function likeEscape(s: string) {
  return s.replace(/[\\%_]/g, (c) => `\\${c}`);
}

function isTrusted(req: Request): boolean {
  const cron = Deno.env.get("CRON_SECRET");
  if (cron && req.headers.get("x-cron-secret") === cron) return true;
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  return !!serviceKey && token === serviceKey;
}

function splitName(full: unknown): [string, string] {
  const parts = String(full ?? "").trim().split(/\s+/).filter(Boolean);
  return [parts[0] ?? "", parts.slice(1).join(" ")];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const apiKey = Deno.env.get("EMAILOCTOPUS_API_KEY");
  const listId = Deno.env.get("EMAILOCTOPUS_LIST_ID");
  if (!apiKey || !listId) {
    console.error("emailoctopus-subscribe: missing API key or list ID");
    return json({ error: "EmailOctopus is not configured" }, 500);
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }
  if (payload.action !== undefined) return json({ error: "Unsupported action" }, 400);

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  let email = "";
  let firstName = "";
  let lastName = "";
  let tags: string[] = [];

  if (isTrusted(req)) {
    email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
    firstName = typeof payload.first_name === "string" ? payload.first_name.trim().slice(0, 100) : "";
    lastName = typeof payload.last_name === "string" ? payload.last_name.trim().slice(0, 100) : "";
    if (Array.isArray(payload.tags)) {
      for (const t of payload.tags) if (typeof t === "string" && t.trim()) tags.push(t.trim());
    }
    if (typeof payload.tag === "string" && payload.tag.trim()) tags.push(payload.tag.trim());
    tags = [...new Set(tags)];
    if (tags.length === 0 || tags.some((t) => !ALLOWED_TAGS.has(t))) {
      return json({ error: "Unknown source tag" }, 400);
    }
  } else {
    const source = typeof payload.source === "string" ? payload.source : "";

    if (source === "hub") {
      const auth = req.headers.get("authorization") || "";
      const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
      const { data: u } = token ? await admin.auth.getUser(token) : { data: null as any };
      const user = u?.user;
      if (!user?.email || !user.email_confirmed_at) return json({ error: "Sign in required" }, 401);
      email = user.email.toLowerCase();
      const { data: prof } = await admin.from("profiles").select("first_name, last_name").eq("id", user.id).maybeSingle();
      firstName = (prof?.first_name ?? "").slice(0, 100);
      lastName = (prof?.last_name ?? "").slice(0, 100);
      const { data: consent } = await admin.from("newsletter_consents").select("id")
        .eq("user_id", user.id).eq("consented", true).limit(1);
      tags = ["resource-hub", ...((consent?.length ?? 0) > 0 ? ["newsletter"] : [])];
    } else if (FORM_SOURCES[source]) {
      const cfg = FORM_SOURCES[source];
      email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
      if (!EMAIL_RE.test(email) || email.length > 254) {
        return json({ error: "A valid email address is required" }, 400);
      }
      const since = new Date(Date.now() - SUBMISSION_WINDOW_MIN * 60_000).toISOString();
      let q = admin.from(cfg.table).select(cfg.cols)
        .ilike("email", likeEscape(email)).gte("created_at", since);
      if (cfg.notes) q = q.eq("notes", cfg.notes);
      const { data: rows } = await q.order("created_at", { ascending: false }).limit(1);
      const row = rows?.[0] as Record<string, any> | undefined;
      if (!row) return json({ error: "No matching recent submission" }, 403);
      if (cfg.table === "contact_submissions") {
        firstName = String(row.first_name ?? "").slice(0, 100);
        lastName = String(row.last_name ?? "").slice(0, 100);
      } else {
        [firstName, lastName] = splitName(row.name);
      }
      tags = cfg.tags;
    } else {
      return json({ error: "Unknown source" }, 400);
    }

    const ok = await allow(admin, [
      { bucket: "eo-subscribe:ip", id: clientIp(req), max: 20, windowMin: 60 },
      { bucket: `eo-subscribe:${source}:email`, id: email, max: 3, windowMin: 60 * 24 },
    ]);
    if (!ok) return json({ error: "Too many requests. Please try again later." }, 429);
  }

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ error: "A valid email address is required" }, 400);
  }

  // Never (re)add suppressed addresses (bounced, complained, unsubscribed).
  const { data: blocked } = await admin.from("suppressed_emails").select("id").eq("email", email).limit(1);
  if ((blocked?.length ?? 0) > 0) return json({ success: true, skipped: true });

  const base = `https://api.emailoctopus.com/lists/${encodeURIComponent(listId)}/contacts`;
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` };

  const fields: Record<string, string> = {};
  if (firstName) fields.FirstName = firstName;
  if (lastName) fields.LastName = lastName;

  const create = await fetch(base, {
    method: "POST",
    headers,
    body: JSON.stringify({ email_address: email, fields, tags, status: "subscribed" }),
  });
  if (create.ok) {
    await create.text();
    return json({ success: true, created: true });
  }

  const createBody = await create.text();

  // Already on the list: update tags/fields only. Status is never sent, so an
  // unsubscribed contact stays unsubscribed.
  if (create.status === 409 || createBody.includes("MEMBER_EXISTS_WITH_EMAIL_ADDRESS") || createBody.includes("already")) {
    const contactId = createHash("md5").update(email).digest("hex");
    const update = await fetch(`${base}/${contactId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ fields, tags: Object.fromEntries(tags.map((t) => [t, true])) }),
    });
    const updateBody = await update.text();
    if (update.ok) return json({ success: true, updated: true });
    console.error(`emailoctopus-subscribe update failed [${update.status}]: ${updateBody.slice(0, 300)}`);
    return json({ error: "EmailOctopus update failed" }, 502);
  }

  console.error(`emailoctopus-subscribe create failed [${create.status}]: ${createBody.slice(0, 300)}`);
  return json({ error: "EmailOctopus request failed" }, 502);
});
