// Dispatches Email 2 (24-hour follow-up: How Points & Tiers Work)
// Triggered by pg_cron every 15 minutes.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Find verified waitlist members who joined 24+ hours ago and haven't received Email 2
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: pending, error } = await supabase
      .from("storybuilders_waitlist")
      .select("id, name, email, referral_code")
      .eq("email_verified", true)
      .is("email2_sent_at", null)
      .lte("created_at", cutoff)
      .limit(100);

    if (error) throw error;

    let sent = 0;
    let failed = 0;

    for (const user of pending ?? []) {
      try {
        // Invoke the main email sender with the email2 template
        const { error: sendError } = await supabase.functions.invoke(
          "send-waitlist-email",
          {
            body: {
              template: "email2_points_tiers",
              to: user.email,
              data: {
                name: user.name?.split(" ")[0] || "friend",
                referral_code: user.referral_code,
                referral_link: `https://empowereddld.com/storypros?ref=${user.referral_code}`,
              },
            },
          }
        );

        if (sendError) throw sendError;

        // Mark as sent
        await supabase
          .from("storybuilders_waitlist")
          .update({ email2_sent_at: new Date().toISOString() })
          .eq("id", user.id);

        sent++;
      } catch (e) {
        console.error(`Failed Email 2 to ${user.email}:`, e);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent, failed, candidates: pending?.length ?? 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Email 2 dispatcher error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
