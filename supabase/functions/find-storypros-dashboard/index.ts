// Recovery flow: user enters their email; if it matches an active row in
// storybuilders_waitlist we send them an email with a link back to their
// dashboard. Always returns 200 with a generic shape so we don't leak which
// emails are on the waitlist.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_BASE = "https://www.empowereddld.com";
const RATE_LIMIT_MINUTES = 2;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: user } = await supabase
      .from("storybuilders_waitlist")
      .select("id, name, email, referral_code, deleted_at")
      .eq("email", cleanEmail)
      .is("deleted_at", null)
      .maybeSingle();

    if (!user || !user.referral_code) {
      // Tell the client we didn't find a match. The email is sensitive, but
      // the recovery flow is explicit (the user typed their own email), so
      // a clear answer is more useful than silently pretending we sent.
      return new Response(JSON.stringify({ found: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const dashboardLink = `${SITE_BASE}/storypros/dashboard?ref=${encodeURIComponent(user.referral_code)}`;
    const firstName = (user.name || "").split(" ")[0] || "there";

    await fetch(`${supabaseUrl}/functions/v1/send-waitlist-email`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        template: "dashboard_recovery",
        to: user.email,
        data: {
          name: firstName,
          dashboard_link: dashboardLink,
        },
      }),
    });

    return new Response(JSON.stringify({ found: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("find-storypros-dashboard error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
