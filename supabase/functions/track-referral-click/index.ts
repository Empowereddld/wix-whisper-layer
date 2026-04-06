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

    // Find the referrer by code
    const { data: referrer, error: findError } = await supabase
      .from("storybuilders_waitlist")
      .select("id, email, click_count, points")
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

    const newClickCount = (referrer.click_count ?? 0) + 1;

    // Update click count
    const { error: updateError } = await supabase
      .from("storybuilders_waitlist")
      .update({ click_count: newClickCount })
      .eq("id", referrer.id);

    if (updateError) {
      console.error("Click count update error:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update click count" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if we should award points (max 10 click points per day per referrer)
    const today = new Date().toISOString().split("T")[0];
    const { data: todayClicks, error: clickCheckError } = await supabase
      .from("waitlist_events")
      .select("points_awarded")
      .eq("user_email", referrer.email)
      .eq("event_type", "referral_click")
      .gte("created_at", `${today}T00:00:00`)
      .lt("created_at", `${today}T23:59:59`);

    if (clickCheckError) {
      console.error("Click event check error:", clickCheckError);
    }

    const pointsAwardedToday = todayClicks?.reduce((sum, e) => sum + (e.points_awarded || 0), 0) ?? 0;
    const MAX_CLICK_POINTS_PER_DAY = 10;
    const shouldAwardPoints = pointsAwardedToday < MAX_CLICK_POINTS_PER_DAY;

    // Award 1 point per click if limit not reached
    if (shouldAwardPoints) {
      const pointsToAward = Math.min(1, MAX_CLICK_POINTS_PER_DAY - pointsAwardedToday);

      await supabase.rpc("award_waitlist_points", {
        p_email: referrer.email,
        p_points: pointsToAward,
        p_event_type: "referral_click",
        p_metadata: { click_count: newClickCount },
      });
    }

    // Log referral click event
    await supabase
      .from("waitlist_events")
      .insert({
        user_email: referrer.email,
        event_type: "referral_click",
        points_awarded: shouldAwardPoints ? 1 : 0,
        metadata: { referral_code, click_count: newClickCount },
      })
      .then(() => {})
      .catch((err) => console.error("Event logging error:", err));

    return new Response(
      JSON.stringify({
        success: true,
        click_count: newClickCount,
        points_awarded: shouldAwardPoints ? 1 : 0,
        daily_limit_reached: pointsAwardedToday + (shouldAwardPoints ? 1 : 0) >= MAX_CLICK_POINTS_PER_DAY,
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
