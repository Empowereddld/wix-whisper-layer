import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLATFORM_POINTS: Record<string, number> = {
  instagram: 8,
  facebook: 8,
  youtube: 8,
};

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

    const normalizedPlatform = String(platform || "").toLowerCase().trim();
    if (!PLATFORM_POINTS[normalizedPlatform]) {
      return new Response(
        JSON.stringify({ error: "Invalid platform. Must be instagram, facebook, or youtube." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase.rpc("claim_social_follow", {
      p_referral_code: referral_code,
      p_platform: normalizedPlatform,
      p_points: PLATFORM_POINTS[normalizedPlatform],
    });

    if (error) {
      console.error("claim_social_follow RPC error:", error);
      return new Response(JSON.stringify({ error: "Failed to claim follow" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const row = Array.isArray(data) ? data[0] : data;
    return new Response(
      JSON.stringify({
        success: row?.success ?? false,
        already_claimed: row?.already_claimed ?? false,
        new_points: row?.new_points ?? 0,
        points_awarded: row?.already_claimed ? 0 : PLATFORM_POINTS[normalizedPlatform],
        platform: normalizedPlatform,
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
