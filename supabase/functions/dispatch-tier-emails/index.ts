// Dispatches tier-up emails (3, 4, 5, 6, 7/7B) when users cross point thresholds.
// Triggered by pg_cron every 5 minutes.
//
// Thresholds (must match src/lib/waitlist-constants.ts TIER_THRESHOLDS):
//   Tier 2 = 35 pts   -> email3_tier2
//   Tier 3 = 75 pts   -> email4_tier3
//   Tier 4 = 130 pts  -> email5_tier4
//   Tier 5 = 250 pts  -> email6_tier5
//   Tier 6 = 500 pts  -> email7_tier6_founder (first 50) OR email7b_tier6_legend
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FOUNDER_SLOT_CAP = 50;
const BASE_URL = "https://empowereddld.com";

// EF guide download link surfaced in Email 3 (Tier 2 reward).
const EF_GUIDE_URL =
  "https://haafpznzuazanylcelse.supabase.co/storage/v1/object/public/resources/storypros/executive-function-skills-guide.pdf";

type Tier = {
  threshold: number;
  template: string;
  sentColumn: "email3_sent_at" | "email4_sent_at" | "email5_sent_at" | "email6_sent_at" | "email7_sent_at";
  pointsToNext: number; // points needed to reach the NEXT tier from this threshold
};

// Order matters: lowest tier first. We process the highest unmet tier per user.
const TIERS: Tier[] = [
  { threshold: 35,  template: "email3_tier2", sentColumn: "email3_sent_at", pointsToNext: 75 - 35 },
  { threshold: 75,  template: "email4_tier3", sentColumn: "email4_sent_at", pointsToNext: 130 - 75 },
  { threshold: 130, template: "email5_tier4", sentColumn: "email5_sent_at", pointsToNext: 250 - 130 },
  { threshold: 250, template: "email6_tier5", sentColumn: "email6_sent_at", pointsToNext: 500 - 250 },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Pull verified users at/above the lowest tier threshold who still have at least
    // one tier email pending. Cap batch to keep cron run short.
    const { data: candidates, error } = await supabase
      .from("storybuilders_waitlist")
      .select(
        "id, name, email, referral_code, points, email_verified, founder_slot_number, email3_sent_at, email4_sent_at, email5_sent_at, email6_sent_at, email7_sent_at"
      )
      .eq("email_verified", true)
      .is("deleted_at", null)
      .gte("points", 35)
      .order("points", { ascending: false })
      .limit(200);

    if (error) throw error;

    let sent = 0;
    let failed = 0;
    const skipped: string[] = [];

    for (const u of candidates ?? []) {
      try {
        const firstName = u.name?.split(" ")[0] || "friend";
        const referralLink = `${BASE_URL}/storypros?ref=${u.referral_code}`;

        // --- Tier 6 (500 pts) -----------------------------------------------
        // Gated behind Tier 5 having been sent so the user always sees Tier 5
        // before the Founder/Legend Tier 6 email.
        if (u.points >= 500 && !u.email7_sent_at && u.email6_sent_at) {
          let template: string;
          let founderSlot: number | null = u.founder_slot_number;

          if (!founderSlot) {
            const { count } = await supabase
              .from("storybuilders_waitlist")
              .select("id", { count: "exact", head: true })
              .not("founder_slot_number", "is", null);
            const nextSlot = (count ?? 0) + 1;
            if (nextSlot <= FOUNDER_SLOT_CAP) {
              const { error: claimErr } = await supabase
                .from("storybuilders_waitlist")
                .update({ founder_slot_number: nextSlot })
                .eq("id", u.id)
                .is("founder_slot_number", null);
              if (!claimErr) founderSlot = nextSlot;
            }
          }

          if (founderSlot && founderSlot <= FOUNDER_SLOT_CAP) {
            template = "email7_tier6_founder";
          } else {
            template = "email7b_tier6_legend";
          }

          const claimUrl =
            template === "email7_tier6_founder"
              ? `${BASE_URL}/storypros/claim-founder?token=${u.id}`
              : undefined;

          const { error: sendError } = await supabase.functions.invoke("send-waitlist-email", {
            body: {
              template,
              to: u.email,
              data: {
                name: firstName,
                referral_link: referralLink,
                founder_slot_number: founderSlot ?? undefined,
                referral_count: undefined,
                claim_url: claimUrl,
              },
            },
          });
          if (sendError) throw sendError;

          await supabase
            .from("storybuilders_waitlist")
            .update({ email7_sent_at: new Date().toISOString() })
            .eq("id", u.id);
          sent++;
          continue;
        }

        // --- Tiers 2-5: send the LOWEST unsent tier the user qualifies for --
        // Send only ONE tier email per cron tick. Cron runs every 5 minutes,
        // so a user who jumped 0 → 250 pts will receive Email 3, then 5 min
        // later Email 4, then 5 min later Email 5. This prevents inbox
        // flooding and keeps each unlock email in proper context.
        let dispatched = false;
        for (let i = 0; i < TIERS.length; i++) {
          const t = TIERS[i];
          if (u.points >= t.threshold && !u[t.sentColumn]) {
            const { error: sendError } = await supabase.functions.invoke("send-waitlist-email", {
              body: {
                template: t.template,
                to: u.email,
                data: {
                  name: firstName,
                  referral_link: referralLink,
                  points_to_next: t.pointsToNext,
                  guide_download_url: t.template === "email3_tier2" ? EF_GUIDE_URL : undefined,
                },
              },
            });
            if (sendError) throw sendError;

            // Mark ONLY this tier as sent. Next cron tick (5 min later) will
            // pick up the next unsent tier the user qualifies for.
            await supabase
              .from("storybuilders_waitlist")
              .update({ [t.sentColumn]: new Date().toISOString() })
              .eq("id", u.id);
            sent++;
            dispatched = true;
            break;
          }
        }
        if (!dispatched) skipped.push(u.email);
      } catch (e) {
        console.error(`Tier dispatch failed for ${u.email}:`, e);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        candidates: candidates?.length ?? 0,
        sent,
        failed,
        skipped: skipped.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("dispatch-tier-emails error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
