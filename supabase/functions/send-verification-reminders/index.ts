// Sends double opt-in verification reminders.
//
// Strict gate: no Welcome email, no tier emails, no Email 2 are sent until
// the user clicks the verify link. We send up to TWO reminders (24h, 72h),
// then we stop emailing them entirely. Their record stays so they can still
// verify later via /storypros/dashboard or the resend flow.
//
// Triggered by pg_cron once per hour.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const REMINDER_1_DELAY_HOURS = 24;
const REMINDER_2_DELAY_HOURS = 72;
const BATCH_LIMIT = 100;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const cronSecret = Deno.env.get("CRON_SECRET");
  if (!cronSecret || req.headers.get("x-cron-secret") !== cronSecret) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const now = Date.now();
    const reminder1Cutoff = new Date(now - REMINDER_1_DELAY_HOURS * 3600_000).toISOString();
    const reminder2Cutoff = new Date(now - REMINDER_2_DELAY_HOURS * 3600_000).toISOString();

    let sent1 = 0;
    let sent2 = 0;
    let failed = 0;

    // ---------- Reminder 1 (24h after signup) ---------------------------
    const { data: round1, error: err1 } = await supabase
      .from("storybuilders_waitlist")
      .select("id, name, email, verification_token")
      .eq("email_verified", false)
      .is("verification_reminder_1_sent_at", null)
      .not("verification_token", "is", null)
      .lte("verification_sent_at", reminder1Cutoff)
      .limit(BATCH_LIMIT);

    if (err1) throw err1;

    for (const u of round1 ?? []) {
      try {
        // Issue a fresh token; old tokens remain valid until their own expiry.
        const freshToken = crypto.randomUUID();
        await supabase
          .from("waitlist_verification_tokens")
          .insert({ waitlist_id: u.id, token: freshToken });
        await supabase
          .from("storybuilders_waitlist")
          .update({ verification_token: freshToken })
          .eq("id", u.id);

        const verificationLink = `${supabaseUrl}/functions/v1/verify-email-waitlist?token=${freshToken}`;
        const firstName = u.name?.split(" ")[0] || "friend";

        const res = await fetch(`${supabaseUrl}/functions/v1/send-waitlist-email`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            template: "verification_reminder_1",
            to: u.email,
            data: { name: firstName, verification_link: verificationLink },
          }),
        });

        if (!res.ok) throw new Error(await res.text());

        await supabase
          .from("storybuilders_waitlist")
          .update({ verification_reminder_1_sent_at: new Date().toISOString() })
          .eq("id", u.id);

        sent1++;
      } catch (e) {
        console.error(`Reminder 1 failed for ${u.email}:`, e);
        failed++;
      }
    }

    // ---------- Reminder 2 (72h after signup, requires reminder 1 done) ---
    const { data: round2, error: err2 } = await supabase
      .from("storybuilders_waitlist")
      .select("id, name, email, verification_token")
      .eq("email_verified", false)
      .not("verification_reminder_1_sent_at", "is", null)
      .is("verification_reminder_2_sent_at", null)
      .not("verification_token", "is", null)
      .lte("verification_sent_at", reminder2Cutoff)
      .limit(BATCH_LIMIT);

    if (err2) throw err2;

    for (const u of round2 ?? []) {
      try {
        // Issue a fresh token; old tokens remain valid until their own expiry.
        const freshToken = crypto.randomUUID();
        await supabase
          .from("waitlist_verification_tokens")
          .insert({ waitlist_id: u.id, token: freshToken });
        await supabase
          .from("storybuilders_waitlist")
          .update({ verification_token: freshToken })
          .eq("id", u.id);

        const verificationLink = `${supabaseUrl}/functions/v1/verify-email-waitlist?token=${freshToken}`;
        const firstName = u.name?.split(" ")[0] || "friend";

        const res = await fetch(`${supabaseUrl}/functions/v1/send-waitlist-email`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            template: "verification_reminder_2",
            to: u.email,
            data: { name: firstName, verification_link: verificationLink },
          }),
        });

        if (!res.ok) throw new Error(await res.text());

        await supabase
          .from("storybuilders_waitlist")
          .update({ verification_reminder_2_sent_at: new Date().toISOString() })
          .eq("id", u.id);

        sent2++;
      } catch (e) {
        console.error(`Reminder 2 failed for ${u.email}:`, e);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent_reminder_1: sent1,
        sent_reminder_2: sent2,
        failed,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Verification reminder dispatcher error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
