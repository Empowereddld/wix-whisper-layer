// Adds (or updates) a contact in the EmailOctopus list.
// Idempotent: an existing email is updated with the new tag instead of erroring.
// Never blocks a signup: callers treat this as fire-and-forget.

import { createHash } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_TAGS = new Set(["story-pros", "resource-hub", "newsletter", "workshop", "educational-app", "contact", "lead", "legacy-list"]);
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/;

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

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const firstName = typeof payload.first_name === "string" ? payload.first_name.trim().slice(0, 100) : "";
  const lastName = typeof payload.last_name === "string" ? payload.last_name.trim().slice(0, 100) : "";

  // Accept either a single `tag` or a `tags` array; all must be known tags.
  const tags: string[] = [];
  if (Array.isArray(payload.tags)) {
    for (const t of payload.tags) {
      if (typeof t === "string" && t.trim()) tags.push(t.trim());
    }
  }
  if (typeof payload.tag === "string" && payload.tag.trim()) {
    tags.push(payload.tag.trim());
  }
  const uniqueTags = [...new Set(tags)];

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ error: "A valid email address is required" }, 400);
  }
  if (uniqueTags.length === 0 || uniqueTags.some((t) => !ALLOWED_TAGS.has(t))) {
    return json({ error: "Unknown source tag" }, 400);
  }

  const base = `https://api.emailoctopus.com/lists/${encodeURIComponent(listId)}/contacts`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  // Removal path: mark a contact unsubscribed (used for manual list cleaning).
  if (payload.action === "unsubscribe") {
    const contactId = createHash("md5").update(email).digest("hex");
    const res = await fetch(`${base}/${contactId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ status: "unsubscribed" }),
    });
    if (res.ok) return json({ success: true, unsubscribed: true });
    const body = await res.text();
    console.error(`emailoctopus-subscribe unsubscribe failed [${res.status}]: ${body}`);
    return json({ error: "EmailOctopus unsubscribe failed", status: res.status }, res.status);
  }

  const fields: Record<string, string> = {};
  if (firstName) fields.FirstName = firstName;
  if (lastName) fields.LastName = lastName;

  const create = await fetch(base, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email_address: email,
      fields,
      tags: uniqueTags,
      status: "subscribed",
    }),
  });

  if (create.ok) {
    return json({ success: true, created: true });
  }

  const createBody = await create.text();

  // Already on the list: update tags/fields instead (idempotent path).
  if (create.status === 409 || createBody.includes("MEMBER_EXISTS_WITH_EMAIL_ADDRESS") || createBody.includes("already")) {
    // EmailOctopus identifies an existing contact by the MD5 hash of the lowercase email.
    const contactId = createHash("md5").update(email).digest("hex");
    const update = await fetch(`${base}/${contactId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        fields,
        tags: Object.fromEntries(uniqueTags.map((t) => [t, true])),
      }),
    });

    if (update.ok) {
      return json({ success: true, updated: true });
    }

    const updateBody = await update.text();
    console.error(`emailoctopus-subscribe update failed [${update.status}]: ${updateBody}`);
    return json({ error: "EmailOctopus update failed", status: update.status, details: updateBody }, update.status);
  }

  console.error(`emailoctopus-subscribe create failed [${create.status}]: ${createBody}`);
  return json({ error: "EmailOctopus request failed", status: create.status, details: createBody }, create.status);
});
