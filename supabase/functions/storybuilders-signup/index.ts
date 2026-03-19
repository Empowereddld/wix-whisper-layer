import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, ref } = await req.json();

    if (!name || !email) {
      return new Response(JSON.stringify({ error: "Name and email are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Check if email already exists
    const { data: existing } = await supabase
      .from("storybuilders_waitlist")
      .select("referral_code, invite_count")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (existing) {
      // Return existing entry
      const { data: totalCount } = await supabase.rpc("get_storybuilders_waitlist_count");
      return new Response(
        JSON.stringify({
          already_joined: true,
          referral_code: existing.referral_code,
          invite_count: existing.invite_count,
          total_count: totalCount ?? 0,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate unique referral code
    let referralCode = generateCode();
    let attempts = 0;
    while (attempts < 5) {
      const { data: codeExists } = await supabase
        .from("storybuilders_waitlist")
        .select("id")
        .eq("referral_code", referralCode)
        .maybeSingle();
      if (!codeExists) break;
      referralCode = generateCode();
      attempts++;
    }

    // Insert new entry
    const { data: newEntry, error: insertError } = await supabase
      .from("storybuilders_waitlist")
      .insert({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        referral_code: referralCode,
        referred_by_code: ref || null,
      })
      .select("referral_code, invite_count")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to join waitlist" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If referred, increment referrer's invite count
    if (ref) {
      await supabase.rpc("increment_waitlist_invites", { p_code: ref });
    }

    const { data: totalCount } = await supabase.rpc("get_storybuilders_waitlist_count");

    return new Response(
      JSON.stringify({
        already_joined: false,
        referral_code: newEntry.referral_code,
        invite_count: newEntry.invite_count,
        total_count: totalCount ?? 0,
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
