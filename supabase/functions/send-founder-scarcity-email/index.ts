// Founder slot scarcity broadcast.
// Fires automatically when remaining Founder slots <= TRIGGER_THRESHOLD (5).
// Sends ONCE per user (tracked via founder_scarcity_sent_at) to all
// verified users who have not yet reached Tier 6.
//
// Triggered by pg_cron (hourly). Idempotent: if remaining > 5 OR all
// eligible users have already received it, the function is a no-op.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FOUNDER_SLOT_CAP = 20;
const TRIGGER_THRESHOLD = 5;
const BATCH_LIMIT = 500;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Count claimed Founder slots.
    const { count: claimed } = await supabase
      .from("storybuilders_waitlist")
      .select("id", { count: "exact", head: true })
      .not("founder_slot_number", "is", null);

    const remaining = FOUNDER_SLOT_CAP - (claimed ?? 0);
    if (remaining > TRIGGER_THRESHOLD || remaining <= 0) {
      return new Response(
        JSON.stringify({ success: true, skipped: true, remaining }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Eligible recipients: verified, not yet Tier 6, not already sent.
    const { data: candidates, error } = await supabase
      .from("storybuilders_waitlist")
      .select("id, name, email, points, referral_code")
      .eq("email_verified", true)
      .is("deleted_at", null)
      .is("founder_scarcity_sent_at", null)
      .lt("points", 500)
      .limit(BATCH_LIMIT);

    if (error) throw error;

    let sent = 0;
    let failed = 0;

    for (const u of candidates ?? []) {
      try {
        const firstName = u.name?.split(" ")[0] || "friend";
        const { error: sendError } = await supabase.functions.invoke("send-waitlist-email", {
          body: {
            template: "founder_scarcity",
            to: u.email,
            data: { name: firstName, slots_remaining: remaining },
          },
        });
        if (sendError) throw sendError;

        await supabase
          .from("storybuilders_waitlist")
          .update({ founder_scarcity_sent_at: new Date().toISOString() })
          .eq("id", u.id);
        sent++;
      } catch (e) {
        console.error(`Scarcity failed for ${u.email}:`, e);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, remaining, candidates: candidates?.length ?? 0, sent, failed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("send-founder-scarcity-email error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
