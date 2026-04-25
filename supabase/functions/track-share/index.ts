import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Must mirror REPEATABLE_POINTS.SHARE, DAILY_CAPS.MAX_SHARE_POINTS, ONETIME_POINTS.FIRST_SHARE
const POINTS_PER_SHARE = 1;
const DAILY_CAP_POINTS = 5;
const FIRST_SHARE_BONUS = 5;

const VALID_PLATFORMS = new Set(["instagram", "facebook", "youtube", "x", "twitter", "copy", "email", "whatsapp", "other"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { referral_code, platform } = await req.json();

    if (!referral_code || typeof referral_code !== "string") {
      return new Response(JSON.stringify({ error: "referral_code is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const normalizedPlatform = String(platform || "other").toLowerCase().trim();
    if (!VALID_PLATFORMS.has(normalizedPlatform)) {
      return new Response(JSON.stringify({ error: "Invalid platform" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase.rpc("record_share", {
      p_referral_code: referral_code,
      p_platform: normalizedPlatform,
      p_points_per_share: POINTS_PER_SHARE,
      p_daily_cap: DAILY_CAP_POINTS,
      p_first_share_bonus: FIRST_SHARE_BONUS,
    });

    if (error) {
      console.error("record_share RPC error:", error);
      return new Response(JSON.stringify({ error: "Failed to record share" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const row = Array.isArray(data) ? data[0] : data;
    return new Response(
      JSON.stringify({
        success: row?.success ?? false,
        points_awarded: row?.points_awarded ?? 0,
        new_points: row?.new_points ?? 0,
        capped: row?.capped ?? false,
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
