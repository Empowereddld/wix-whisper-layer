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
    const { referral_code, name, is_speech_professional, role, role_other } = body as {
      referral_code?: string;
      name?: string;
      is_speech_professional?: boolean;
      role?: string;
      role_other?: string | null;
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
      // Only allow setting to true via the dashboard (client cannot un-claim).
      // Option A: auto-verify and award the +50 bonus immediately.
      if (is_speech_professional === true) {
        updates.is_speech_professional = true;
        updates.speech_professional_verified = true;
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
          updates.is_speech_professional = true;
          updates.speech_professional_verified = true;
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid fields to update" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { data, error } = await supabase
      .from("storybuilders_waitlist")
      .update(updates)
      .eq("referral_code", referral_code)
      .select("id, name, is_speech_professional, speech_professional_verified, role, role_other")
      .maybeSingle();

    if (error || !data) {
      console.error("Update failed:", error);
      return new Response(
        JSON.stringify({ error: "Could not update your details. Try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
