import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CLICK_RATE_LIMIT = 30; // 30 clicks per hour per IP

async function checkClickRateLimit(
  supabase: any,
  ipAddress: string
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const { count, error } = await supabase
      .from("waitlist_events")
      .select("*", { count: "exact", head: true })
      .eq("metadata->>ip_address", ipAddress)
      .eq("event_type", "referral_click")
      .gte("created_at", oneHourAgo);

    if (error) {
      console.warn("Rate limit check error (allowing by default):", error);
      return { allowed: true, remaining: CLICK_RATE_LIMIT };
    }

    const requests = count || 0;
    const allowed = requests < CLICK_RATE_LIMIT;
    const remaining = Math.max(0, CLICK_RATE_LIMIT - requests);

    return { allowed, remaining };
  } catch (error) {
    console.warn("Rate limit check failed (allowing by default):", error);
    return { allowed: true, remaining: CLICK_RATE_LIMIT };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { referral_code } = await req.json();

    if (!referral_code) {
      return new Response(
        JSON.stringify({ error: "referral_code is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Get IP address from headers
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
                      req.headers.get("cf-connecting-ip") ||
                      "unknown";

    // Check rate limit (30 clicks per hour per IP)
    const rateLimit = await checkClickRateLimit(supabase, ipAddress);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: "Too many referral clicks. Please try again later.",
          remaining: rateLimit.remaining,
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Find the referrer by code — only select columns that exist
    const { data: referrer, error: findError } = await supabase
      .from("storybuilders_waitlist")
      .select("id, email, invite_count")
      .eq("referral_code", referral_code)
      .maybeSingle();

    if (findError) {
      console.error("Referrer lookup error:", findError);
      return new Response(
        JSON.stringify({ error: "Failed to find referrer" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!referrer) {
      return new Response(
        JSON.stringify({ error: "Invalid referral code" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Log the click event with IP address for rate limiting tracking
    await supabase
      .from("waitlist_events")
      .insert({
        user_email: referrer.email,
        event_type: "referral_click",
        points_awarded: 0,
        metadata: { ip_address: ipAddress, referral_code: referral_code },
      });

    return new Response(
      JSON.stringify({
        success: true,
        referrer_id: referrer.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
