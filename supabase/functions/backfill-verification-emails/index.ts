// ONE-OFF backfill: re-send the verification email to every unverified
// signup from the last 24h whose original verification email was blocked
// by the 403 auth bug. Requires x-cron-secret. Delete after running.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const cronSecret = Deno.env.get("CRON_SECRET");
  if (!cronSecret || req.headers.get("x-cron-secret") !== cronSecret) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  // Anyone unverified who signed up in the last 36h (covers full launch window).
  const cutoff = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();
  const { data: users, error } = await supabase
    .from("storybuilders_waitlist")
    .select("id, name, email")
    .eq("email_verified", false)
    .is("deleted_at", null)
    .gte("created_at", cutoff)
    .order("created_at", { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let sent = 0;
  let failed = 0;
  const failures: string[] = [];

  for (const u of users ?? []) {
    try {
      const token = crypto.randomUUID();
      await supabase
        .from("storybuilders_waitlist")
        .update({
          verification_token: token,
          verification_sent_at: new Date().toISOString(),
        })
        .eq("id", u.id);

      const link = `${supabaseUrl}/functions/v1/verify-email-waitlist?token=${token}`;
      const res = await fetch(`${supabaseUrl}/functions/v1/send-waitlist-email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template: "verification",
          to: u.email,
          data: {
            name: (u.name || "").split(" ")[0],
            verification_link: link,
          },
        }),
      });

      if (!res.ok) {
        failed++;
        failures.push(`${u.email}: ${res.status} ${await res.text()}`);
      } else {
        sent++;
      }

      // Gentle pacing to stay well under Resend rate limits.
      await new Promise((r) => setTimeout(r, 250));
    } catch (e) {
      failed++;
      failures.push(`${u.email}: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  return new Response(
    JSON.stringify({ candidates: users?.length ?? 0, sent, failed, failures: failures.slice(0, 20) }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
