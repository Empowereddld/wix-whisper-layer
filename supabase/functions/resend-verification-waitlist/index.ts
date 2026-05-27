import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RATE_LIMIT_MINUTES = 2;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { referral_code } = await req.json();
    if (!referral_code || typeof referral_code !== "string") {
      return new Response(JSON.stringify({ error: "referral_code required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: user, error } = await supabase
      .from("storybuilders_waitlist")
      .select("id, name, email, email_verified, verification_token, verification_sent_at")
      .eq("referral_code", referral_code)
      .maybeSingle();

    if (error || !user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (user.email_verified) {
      return new Response(JSON.stringify({ already_verified: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limit: only allow resend every 2 minutes
    if (user.verification_sent_at) {
      const sentAt = new Date(user.verification_sent_at).getTime();
      const ageMin = (Date.now() - sentAt) / 60000;
      if (ageMin < RATE_LIMIT_MINUTES) {
        return new Response(
          JSON.stringify({
            error: "Please wait before requesting another verification email",
            retry_after_seconds: Math.ceil((RATE_LIMIT_MINUTES - ageMin) * 60),
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Issue a fresh token (additive — old tokens remain valid until their own
    // 7-day expiry or until one of them is used).
    const verificationToken = crypto.randomUUID();
    await supabase
      .from("waitlist_verification_tokens")
      .insert({ waitlist_id: user.id, token: verificationToken });
    await supabase
      .from("storybuilders_waitlist")
      .update({
        verification_token: verificationToken,
        verification_sent_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    const verificationLink = `${supabaseUrl}/functions/v1/verify-email-waitlist?token=${verificationToken}`;

    // Send the verification template (NOT welcome — welcome is gated until after verify)
    await fetch(`${supabaseUrl}/functions/v1/send-waitlist-email`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        template: "verification",
        to: user.email,
        data: {
          name: (user.name || "").split(" ")[0],
          verification_link: verificationLink,
        },
      }),
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("resend-verification-waitlist error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
