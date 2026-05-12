// Inactivity re-engagement email.
// Trigger: user verified 14+ days ago AND has earned no points beyond
// the verification bonus (points <= 15). Sent ONCE per user.
//
// Triggered by pg_cron (daily).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const INACTIVITY_DAYS = 14;
const VERIFY_BONUS_POINTS = 15;
const BATCH_LIMIT = 200;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const cutoff = new Date(Date.now() - INACTIVITY_DAYS * 86_400_000).toISOString();

    const { data: candidates, error } = await supabase
      .from("storybuilders_waitlist")
      .select("id, name, email, points, referral_code")
      .eq("email_verified", true)
      .is("deleted_at", null)
      .is("inactivity_email_sent_at", null)
      .lte("points", VERIFY_BONUS_POINTS)
      .lte("verified_at", cutoff)
      .limit(BATCH_LIMIT);

    if (error) throw error;

    let sent = 0;
    let failed = 0;

    for (const u of candidates ?? []) {
      try {
        const firstName = u.name?.split(" ")[0] || "friend";
        const { error: sendError } = await supabase.functions.invoke("send-waitlist-email", {
          body: {
            template: "inactivity_reengagement",
            to: u.email,
            data: { name: firstName },
          },
        });
        if (sendError) throw sendError;

        await supabase
          .from("storybuilders_waitlist")
          .update({ inactivity_email_sent_at: new Date().toISOString() })
          .eq("id", u.id);
        sent++;
      } catch (e) {
        console.error(`Inactivity failed for ${u.email}:`, e);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, candidates: candidates?.length ?? 0, sent, failed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("send-inactivity-emails error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
