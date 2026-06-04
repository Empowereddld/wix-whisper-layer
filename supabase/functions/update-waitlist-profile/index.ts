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
    const body = await req.json().catch(() => ({}));
    const {
      referral_code,
      name,
      is_speech_professional,
      role,
      role_other,
      child_age,
      hopes,
      hopes_other,
      hear_about,
      complete_profile,
    } = body as {
      referral_code?: string;
      name?: string;
      is_speech_professional?: boolean;
      role?: string;
      role_other?: string | null;
      child_age?: number | null;
      hopes?: string[];
      hopes_other?: string | null;
      hear_about?: string | null;
      complete_profile?: boolean;
    };

    if (!referral_code || typeof referral_code !== "string") {
      return new Response(
        JSON.stringify({ error: "referral_code is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const updates: Record<string, unknown> = {};

    if (typeof name === "string") {
      const trimmed = name.trim();
      if (!trimmed) {
        return new Response(
          JSON.stringify({ error: "Name cannot be empty" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (trimmed.includes("@")) {
        return new Response(
          JSON.stringify({ error: "Please enter your name, not your email." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (trimmed.length > 100) {
        return new Response(
          JSON.stringify({ error: "Name must be 100 characters or fewer." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      updates.name = trimmed;
    }

    if (typeof is_speech_professional === "boolean") {
      // Self-claimed only — never auto-verifies, never awards the +50 bonus.
      // Admin must approve via the SLP verification queue to award points.
      if (is_speech_professional === true) {
        updates.is_speech_professional = true;
      }
    }

    // Role updates: validated against known codes. Picking Speech Professional
    // also flips is_speech_professional = true and auto-awards the +50 bonus.
    // Switching away from Other clears role_other; switching to Other requires it.
    const ALLOWED_ROLES = ["parent", "speech_pro", "other"];
    if (typeof role === "string") {
      if (!ALLOWED_ROLES.includes(role)) {
        return new Response(
          JSON.stringify({ error: "Invalid role" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      updates.role = role;
      if (role === "other") {
        const detail = typeof role_other === "string" ? role_other.trim() : "";
        if (!detail) {
          return new Response(
            JSON.stringify({ error: "Tell us a bit more about your role." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (detail.length > 60) {
          return new Response(
            JSON.stringify({ error: "Please keep it under 60 characters." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        updates.role_other = detail;
      } else {
        updates.role_other = null;
        if (role === "speech_pro") {
          // Self-claimed only — admin must verify to award the +50 bonus.
          updates.is_speech_professional = true;
        }
      }
    }

    // ----- New profile completion fields -----
    const ALLOWED_HOPES = [
      "understanding_stories",
      "retelling",
      "putting_events_in_order",
      "vocabulary",
      "confidence",
      "other",
    ];
    const ALLOWED_HEAR_ABOUT = [
      "facebook_group",
      "friend_or_family",
      "slp_recommendation",
      "social_media",
      "other",
    ];

    if (typeof child_age !== "undefined" && child_age !== null) {
      const ageNum = Number(child_age);
      if (!Number.isInteger(ageNum) || ageNum < 1 || ageNum > 25) {
        return new Response(
          JSON.stringify({ error: "Please enter an age between 1 and 25." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      updates.child_age = ageNum;
    }

    if (Array.isArray(hopes)) {
      const cleaned = Array.from(new Set(hopes.filter((h) => ALLOWED_HOPES.includes(h))));
      if (cleaned.length > 3) {
        return new Response(
          JSON.stringify({ error: "Pick up to 3." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      updates.hopes = cleaned;
      if (cleaned.includes("other")) {
        const detail = typeof hopes_other === "string" ? hopes_other.trim() : "";
        if (!detail) {
          return new Response(
            JSON.stringify({ error: "Please tell us a bit more about your 'Other' hope." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (detail.length > 200) {
          return new Response(
            JSON.stringify({ error: "Please keep it under 200 characters." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        updates.hopes_other = detail;
      } else {
        updates.hopes_other = null;
      }
    }

    if (typeof hear_about !== "undefined" && hear_about !== null) {
      if (!ALLOWED_HEAR_ABOUT.includes(hear_about)) {
        return new Response(
          JSON.stringify({ error: "Invalid 'how did you hear' value." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      updates.hear_about = hear_about;
    }

    if (Object.keys(updates).length === 0 && complete_profile !== true) {
      return new Response(
        JSON.stringify({ error: "No valid fields to update" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // One-time SLP +50 bonus.
    if (updates.speech_professional_verified === true) {
      const { data: existing } = await supabase
        .from("storybuilders_waitlist")
        .select("points, speech_professional_verified")
        .eq("referral_code", referral_code)
        .is("deleted_at", null)
        .maybeSingle();

      if (existing?.speech_professional_verified) {
        delete (updates as Record<string, unknown>).speech_professional_verified;
        delete (updates as Record<string, unknown>).is_speech_professional;
      } else if (existing) {
        (updates as Record<string, unknown>).points = (existing.points || 0) + 50;
      }
    }

    // One-time profile completion +10 bonus.
    // Only awarded the first time complete_profile=true is sent AND all
    // required fields (child_age, hopes, hear_about) are present.
    if (complete_profile === true) {
      const { data: existing } = await supabase
        .from("storybuilders_waitlist")
        .select("points, profile_completed_at, child_age, hopes, hear_about")
        .eq("referral_code", referral_code)
        .is("deleted_at", null)
        .maybeSingle();

      if (existing && !existing.profile_completed_at) {
        const finalChildAge = (updates.child_age as number | undefined) ?? existing.child_age;
        const finalHopes =
          (updates.hopes as string[] | undefined) ?? (existing.hopes as string[] | undefined) ?? [];
        const finalHearAbout =
          (updates.hear_about as string | undefined) ?? existing.hear_about;
        if (finalChildAge && finalHopes.length > 0 && finalHearAbout) {
          const basePoints = (updates.points as number | undefined) ?? existing.points ?? 0;
          (updates as Record<string, unknown>).points = basePoints + 10;
          (updates as Record<string, unknown>).profile_completed_at = new Date().toISOString();
        } else {
          return new Response(
            JSON.stringify({ error: "Please fill in all profile fields before submitting." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    const { data, error } = await supabase
      .from("storybuilders_waitlist")
      .update(updates)
      .eq("referral_code", referral_code)
      .is("deleted_at", null)
      .select("id, name, is_speech_professional, speech_professional_verified, role, role_other, child_age, hopes, hopes_other, hear_about, profile_completed_at, points")
      .maybeSingle();

    if (error || !data) {
      console.error("Update failed:", error);
      return new Response(
        JSON.stringify({ error: "This signup is no longer active or could not be updated." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, profile: data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Unexpected error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
