// Public lookup of a storybuilders_waitlist row.
//
// Two modes:
//   - ref:   public referral-code lookup. Referral codes are share-link tokens
//            (not enumerable), so this stays unauthenticated.
//   - email: PII lookup. Requires a valid Supabase JWT AND the requested email
//            must match the authenticated user's email. Prevents email
//            enumeration of waitlist members.
//
// Uses the service role to bypass RLS so the dashboard can hydrate without us
// opening up SELECT on the table to anon.
//
// Returns ONLY a safe subset of columns — never includes verification_token,
// deleted_by, deleted_reason, or any internal admin fields.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Whitelist of columns safe to return to the public client.
const SAFE_COLUMNS = [
  "id",
  "name",
  "email",
  "role",
  "role_other",
  "referral_code",
  "invite_count",
  "created_at",
  "email_verified",
  "points",
  "is_speech_professional",
  "speech_professional_verified",
  "social_claims",
  "share_count",
  "click_count",
  "rewards_claimed",
  "deleted_at",
  "child_age",
  "hopes",
  "hopes_other",
  "hear_about",
  "profile_completed_at",
].join(", ");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const ref = typeof body?.ref === "string" ? body.ref.trim() : "";
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!ref && !email) {
      return new Response(
        JSON.stringify({ error: "ref or email required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Email lookup is PII-sensitive: require an authenticated session and
    // verify the requested email matches the caller's own auth email.
    if (email && !ref) {
      const authHeader = req.headers.get("Authorization") ?? "";
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : "";
      if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const anonClient = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: `Bearer ${token}` } } }
      );
      const { data: userData, error: userErr } = await anonClient.auth.getUser();
      const callerEmail = userData?.user?.email?.toLowerCase() ?? "";
      if (userErr || !callerEmail) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (callerEmail !== email) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    let query = supabase.from("storybuilders_waitlist").select(SAFE_COLUMNS);
    if (ref) {
      query = query.eq("referral_code", ref);
    } else {
      query = query.eq("email", email);
    }
    // Only return active (non-deleted) rows.
    query = query.is("deleted_at", null);

    const { data, error } = await query.maybeSingle();
    if (error) {
      console.error("lookup error:", error);
      return new Response(
        JSON.stringify({ error: "Lookup failed" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!data) {
      return new Response(JSON.stringify({ found: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Compute queue position (1 + count of rows created before this one).
    let queue_position: number | null = null;
    if ((data as any).created_at) {
      const { count } = await supabase
        .from("storybuilders_waitlist")
        .select("id", { count: "exact", head: true })
        .lt("created_at", (data as any).created_at)
        .is("deleted_at", null);
      if (typeof count === "number") queue_position = count + 1;
    }

    const { count: totalCount } = await supabase
      .from("storybuilders_waitlist")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null);

    return new Response(
      JSON.stringify({
        found: true,
        user: data,
        queue_position,
        total_count: totalCount ?? null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("lookup-storypros-by-ref error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
