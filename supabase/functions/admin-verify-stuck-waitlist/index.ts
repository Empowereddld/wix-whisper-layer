// Admin-only bulk verifier for waitlist users whose double opt-in link never
// reached the verify endpoint (browser/email-scanner mangled the URL).
//
// For each unverified user with at least one unused verification token:
//   1. Call verify_waitlist_and_award(p_waitlist_id, 15)  -> flips
//      email_verified=true, sets verified_at, adds +15 points.
//   2. If welcome_sent_at is null, claim it then invoke send-waitlist-email
//      with template "welcome" (same path verify-email-waitlist uses).
//   3. Mark that user's outstanding tokens used_at = now() so they can't be
//      replayed.
//
// Returns counts so the admin can report back.
//
// Auth: caller must present a valid Bearer JWT for a user with the admin role.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  try {
    // ---- Admin auth check --------------------------------------------------
    const authHeader = req.headers.get("Authorization") || "";
    const jwt = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!jwt) {
      return new Response(JSON.stringify({ error: "Missing Authorization bearer token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });
    const { data: userResp, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userResp?.user) {
      return new Response(JSON.stringify({ error: "Invalid auth token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const callerId = userResp.user.id;

    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: isAdminRows, error: roleErr } = await supabase.rpc("has_role", {
      _user_id: callerId,
      _role: "admin",
    });
    if (roleErr || isAdminRows !== true) {
      return new Response(JSON.stringify({ error: "Admin role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- Find candidates ---------------------------------------------------
    // Active + unverified + has at least one unused token.
    // Pull unused token waitlist_ids first, then load matching waitlist rows.
    const { data: tokenRows, error: tokenErr } = await supabase
      .from("waitlist_verification_tokens")
      .select("waitlist_id")
      .is("used_at", null)
      .limit(2000);
    if (tokenErr) throw tokenErr;

    const candidateIds = Array.from(
      new Set((tokenRows ?? []).map((r: any) => r.waitlist_id).filter(Boolean))
    );

    if (candidateIds.length === 0) {
      return new Response(
        JSON.stringify({
          processed: 0,
          verified: 0,
          already_verified: 0,
          welcomes_sent: 0,
          welcome_failures: 0,
          errors: [],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: users, error: usersErr } = await supabase
      .from("storybuilders_waitlist")
      .select("id, email, name, email_verified, deleted_at, welcome_sent_at")
      .in("id", candidateIds)
      .eq("email_verified", false)
      .is("deleted_at", null);
    if (usersErr) throw usersErr;

    let processed = 0;
    let verified = 0;
    let alreadyVerified = 0;
    let welcomesSent = 0;
    let welcomeFailures = 0;
    const errors: Array<{ id: string; email?: string; error: string }> = [];

    for (const u of users ?? []) {
      processed++;
      try {
        const { data: rpcRows, error: rpcErr } = await supabase.rpc(
          "verify_waitlist_and_award",
          { p_waitlist_id: u.id, p_bonus: 15 }
        );
        if (rpcErr) throw rpcErr;
        const result: any = Array.isArray(rpcRows) ? rpcRows[0] : rpcRows;

        if (result?.out_already_verified) {
          alreadyVerified++;
        } else if (result?.out_verified_now) {
          verified++;

          // Welcome dispatch (atomic claim)
          if (!result.out_welcome_sent_at) {
            const { data: claimed } = await supabase
              .from("storybuilders_waitlist")
              .update({ welcome_sent_at: new Date().toISOString() })
              .eq("id", u.id)
              .is("welcome_sent_at", null)
              .select("id");

            if (claimed && claimed.length > 0) {
              try {
                const firstName =
                  (result.out_name as string | undefined)?.split(" ")[0] || "friend";
                const referralCode =
                  (result.out_referral_code as string | undefined) || "";

                const res = await fetch(`${supabaseUrl}/functions/v1/send-waitlist-email`, {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${serviceKey}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    template: "welcome",
                    to: result.out_email ?? u.email,
                    data: { name: firstName, referral_code: referralCode },
                  }),
                });
                if (!res.ok) {
                  throw new Error(await res.text());
                }
                welcomesSent++;
              } catch (welcomeErr) {
                welcomeFailures++;
                // Roll back the claim so a retry can try again.
                await supabase
                  .from("storybuilders_waitlist")
                  .update({ welcome_sent_at: null })
                  .eq("id", u.id);
                errors.push({
                  id: u.id,
                  email: u.email,
                  error: `welcome: ${welcomeErr instanceof Error ? welcomeErr.message : String(welcomeErr)}`,
                });
              }
            }
          }
        }

        // Invalidate any outstanding tokens for this user.
        await supabase
          .from("waitlist_verification_tokens")
          .update({ used_at: new Date().toISOString() })
          .eq("waitlist_id", u.id)
          .is("used_at", null);
      } catch (e) {
        errors.push({
          id: u.id,
          email: u.email,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    return new Response(
      JSON.stringify({
        processed,
        verified,
        already_verified: alreadyVerified,
        welcomes_sent: welcomesSent,
        welcome_failures: welcomeFailures,
        errors,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("admin-verify-stuck-waitlist error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
