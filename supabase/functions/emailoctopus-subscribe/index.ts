// Adds (or updates) a contact in the EmailOctopus list.
// Idempotent: an existing email is updated with the new tag instead of erroring.
// Never blocks a signup: callers treat this as fire-and-forget.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_TAGS = new Set(["story-pros", "resource-hub", "newsletter", "workshop", "educational-app", "contact", "lead"]);
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
  const tagRaw = typeof payload.tag === "string" ? payload.tag.trim() : "";
  const firstName = typeof payload.first_name === "string" ? payload.first_name.trim().slice(0, 100) : "";
  const lastName = typeof payload.last_name === "string" ? payload.last_name.trim().slice(0, 100) : "";

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ error: "A valid email address is required" }, 400);
  }
  if (!ALLOWED_TAGS.has(tagRaw)) {
    return json({ error: "Unknown source tag" }, 400);
  }

  const fields: Record<string, string> = {};
  if (firstName) fields.FirstName = firstName;
  if (lastName) fields.LastName = lastName;

  const base = `https://api.emailoctopus.com/lists/${encodeURIComponent(listId)}/contacts`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const create = await fetch(base, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email_address: email,
      fields,
      tags: { [tagRaw]: true },
      status: "subscribed",
    }),
  });

  if (create.ok) {
    return json({ success: true, created: true });
  }

  const createBody = await create.text();

  // Already on the list: update tags/fields instead (idempotent path).
  if (create.status === 409 || createBody.includes("MEMBER_EXISTS_WITH_EMAIL_ADDRESS") || createBody.includes("already")) {
    const update = await fetch(`${base}/${encodeURIComponent(email)}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ fields, tags: { [tagRaw]: true } }),
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
