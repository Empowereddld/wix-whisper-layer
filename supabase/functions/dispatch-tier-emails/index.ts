// Dispatches tier-up emails (3, 4, 5, 6, 7/7B) when users cross point thresholds.
// Triggered by pg_cron every 5 minutes.
//
// Thresholds (must match src/lib/waitlist-constants.ts TIER_THRESHOLDS):
//   Tier 2 = 35 pts   -> email3_tier2
//   Tier 3 = 75 pts   -> email4_tier3
//   Tier 4 = 130 pts  -> email5_tier4
//   Tier 5 = 250 pts  -> email6_tier5
//   Tier 6 = 500 pts  -> email7_tier6_founder (first 20) OR email7b_tier6_legend
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FOUNDER_SLOT_CAP = 20;
const BASE_URL = "https://empowereddld.com";

// Signed, expiring Founder claim token: "<waitlist_id>.<exp>.<hmac>".
// Must match claim-founder-package. Valid for 90 days from the email send.
const CLAIM_TOKEN_TTL_SECONDS = 90 * 24 * 60 * 60;
async function signClaimToken(id: string): Promise<string> {
  const exp = String(Math.floor(Date.now() / 1000) + CLAIM_TOKEN_TTL_SECONDS);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`founder-claim:v2:${id}:${exp}`));
  const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `${id}.${exp}.${b64}`;
}

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


async function logCronAuthFailure(req: Request, functionName: string) {
  try {
    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) return;
    await fetch(`${url}/rest/v1/cron_auth_failures`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": key,
        "Authorization": `Bearer ${key}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        function_name: functionName,
        ip_address:
          req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
          req.headers.get("cf-connecting-ip") ??
          null,
        user_agent: req.headers.get("user-agent") ?? null,
      }),
    });
  } catch (_) {
    // never block the response on logging
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Cron-only.
  const cronSecret = Deno.env.get("CRON_SECRET");
  if (!cronSecret || req.headers.get("x-cron-secret") !== cronSecret) {
    await logCronAuthFailure(req, "dispatch-tier-emails");
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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
        "id, name, email, referral_code, points, email_verified, founder_slot_number, invite_count, email3_sent_at, email4_sent_at, email5_sent_at, email6_sent_at, email7_sent_at"
      )
      .eq("email_verified", true)
      .is("deleted_at", null)
      .is("automated_email_hold_at", null)
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
            // Atomic slot assignment: a SECURITY DEFINER RPC takes an
            // advisory lock + FOR UPDATE so two concurrent Tier 6 users
            // cannot be handed the same slot. Returns null if the cap is
            // reached, in which case we fall through to the Legend email.
            const { data: slotRows, error: slotErr } = await supabase.rpc(
              "assign_founder_slot",
              { p_user_id: u.id, p_cap: FOUNDER_SLOT_CAP }
            );
            if (slotErr) {
              console.error("assign_founder_slot failed:", slotErr);
            } else {
              const row = Array.isArray(slotRows) ? slotRows[0] : slotRows;
              if (row?.slot_number) founderSlot = row.slot_number;
            }
          }

          if (founderSlot && founderSlot <= FOUNDER_SLOT_CAP) {
            template = "email7_tier6_founder";
          } else {
            template = "email7b_tier6_legend";
          }

          const claimUrl =
            template === "email7_tier6_founder"
              ? `${BASE_URL}/storypros/claim-founder?token=${encodeURIComponent(await signClaimToken(u.id))}`
              : undefined;

          const { error: sendError } = await supabase.functions.invoke("send-waitlist-email", {
          headers: { "x-cron-secret": cronSecret },
            body: {
              template,
              to: u.email,
              data: {
                name: firstName,
                referral_link: referralLink,
                founder_slot_number: founderSlot ?? undefined,
                referral_count: u.invite_count ?? 0,
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

        // --- Tiers 2-5: send ONLY the HIGHEST tier the user currently qualifies
        // for. Any lower unsent tiers are marked done without sending, so a
        // backlog never produces several tier emails in sequence.
        let dispatched = false;
        let highest = -1;
        for (let i = 0; i < TIERS.length; i++) {
          if (u.points >= TIERS[i].threshold) highest = i;
        }
        if (highest >= 0 && !u[TIERS[highest].sentColumn]) {
          const t = TIERS[highest];
          const { error: sendError } = await supabase.functions.invoke("send-waitlist-email", {
            headers: { "x-cron-secret": cronSecret },
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

          const now = new Date().toISOString();
          const updates: Record<string, string> = {};
          for (let i = 0; i <= highest; i++) {
            if (!u[TIERS[i].sentColumn]) updates[TIERS[i].sentColumn] = now;
          }
          await supabase.from("storybuilders_waitlist").update(updates).eq("id", u.id);
          sent++;
          dispatched = true;
        }
        if (!dispatched) skipped.push(u.email);
      } catch (e) {
        console.error(`Tier dispatch failed for member ${u.id}:`, e);
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
