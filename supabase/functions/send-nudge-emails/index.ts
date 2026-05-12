// Sends nudge emails to verified users who are within 15 points of their
// next tier AND haven't earned points in 4+ days. Sent at most once per
// tier per user (tracked via nudge_sent_for_tier column).
//
// Triggered by pg_cron (daily).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TIER_THRESHOLDS = [0, 35, 75, 130, 250, 500];
const NUDGE_WINDOW_PTS = 15;
const INACTIVITY_DAYS = 4;
const BATCH_LIMIT = 200;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const cutoff = new Date(Date.now() - INACTIVITY_DAYS * 86_400_000).toISOString();

    // Pull verified, non-Tier-6 users inactive for 4+ days.
    const { data: candidates, error } = await supabase
      .from("storybuilders_waitlist")
      .select("id, name, email, points, referral_code, nudge_sent_for_tier, last_points_earned_at")
      .eq("email_verified", true)
      .is("deleted_at", null)
      .lt("points", 500)
      .lte("last_points_earned_at", cutoff)
      .limit(BATCH_LIMIT);

    if (error) throw error;

    let sent = 0;
    let failed = 0;
    let skipped = 0;

    for (const u of candidates ?? []) {
      try {
        // Find next tier threshold above current points
        const nextThreshold = TIER_THRESHOLDS.find((t) => t > (u.points ?? 0));
        if (!nextThreshold) {
          skipped++;
          continue;
        }
        const pointsAway = nextThreshold - (u.points ?? 0);
        if (pointsAway > NUDGE_WINDOW_PTS) {
          skipped++;
          continue;
        }
        // Already nudged for this tier?
        if (u.nudge_sent_for_tier === nextThreshold) {
          skipped++;
          continue;
        }

        const firstName = u.name?.split(" ")[0] || "friend";
        const { error: sendError } = await supabase.functions.invoke("send-waitlist-email", {
          body: {
            template: "nudge",
            to: u.email,
            data: { name: firstName, points_to_next: pointsAway, referral_code: u.referral_code },
          },
        });
        if (sendError) throw sendError;

        await supabase
          .from("storybuilders_waitlist")
          .update({ nudge_sent_for_tier: nextThreshold })
          .eq("id", u.id);
        sent++;
      } catch (e) {
        console.error(`Nudge failed for ${u.email}:`, e);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, candidates: candidates?.length ?? 0, sent, failed, skipped }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("send-nudge-emails error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
