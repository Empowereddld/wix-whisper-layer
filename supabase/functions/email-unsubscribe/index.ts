// Public unsubscribe endpoint. Adds an email to suppressed_emails (idempotent).
// Called from the /unsubscribe page, no auth required.
// Rate-limited per IP to prevent mass-unsubscribe abuse.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// In-memory rate limiter (per instance). Best-effort; sufficient to deter scripted abuse.
// Limits: 5 requests per IP per minute, 30 per IP per hour.
const ipHits = new Map<string, number[]>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const minuteAgo = now - 60_000;
  const hourAgo = now - 3_600_000;

  const hits = (ipHits.get(ip) ?? []).filter((t) => t > hourAgo);

  const lastMinute = hits.filter((t) => t > minuteAgo).length;
  if (lastMinute >= 5) return { allowed: false, retryAfter: 60 };
  if (hits.length >= 30) return { allowed: false, retryAfter: 3600 };

  hits.push(now);
  ipHits.set(ip, hits);

  // Periodic cleanup to bound memory.
  if (ipHits.size > 5000) {
    for (const [k, v] of ipHits) {
      const fresh = v.filter((t) => t > hourAgo);
      if (fresh.length === 0) ipHits.delete(k);
      else ipHits.set(k, fresh);
    }
  }

  return { allowed: true };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      {
        status: 429,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Retry-After": String(rl.retryAfter ?? 60),
        },
      },
    );
  }

  try {
    const { email, reason = "unsubscribe" } = await req.json();

    if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Valid email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const normalized = email.trim().toLowerCase();

    // Idempotent: ignore conflict on the unique email constraint.
    const { error } = await supabase
      .from("suppressed_emails")
      .upsert({ email: normalized, reason }, { onConflict: "email", ignoreDuplicates: true });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, email: normalized }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("email-unsubscribe error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unsubscribe failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
