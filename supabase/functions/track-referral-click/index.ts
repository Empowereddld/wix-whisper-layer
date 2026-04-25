import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Must mirror REPEATABLE_POINTS.CLICK and DAILY_CAPS.MAX_CLICK_POINTS
const POINTS_PER_CLICK = 3;
const DAILY_CAP_POINTS = 15;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { referral_code } = await req.json();

    if (!referral_code || typeof referral_code !== "string") {
      return new Response(JSON.stringify({ error: "referral_code is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    const { data, error } = await supabase.rpc("record_referral_click", {
      p_referral_code: referral_code,
      p_ip_address: ipAddress,
      p_points: POINTS_PER_CLICK,
      p_daily_cap: DAILY_CAP_POINTS,
    });

    if (error) {
      console.error("record_referral_click RPC error:", error);
      return new Response(JSON.stringify({ error: "Failed to record click" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const row = Array.isArray(data) ? data[0] : data;
    return new Response(
      JSON.stringify({
        success: row?.success ?? false,
        awarded: row?.awarded ?? false,
        reason: row?.reason ?? "",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
