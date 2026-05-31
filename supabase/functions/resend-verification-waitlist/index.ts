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
    const body = await req.json().catch(() => ({} as any));
    const referral_code: string | undefined =
      typeof body?.referral_code === "string" ? body.referral_code : undefined;
    const emailInput: string | undefined =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : undefined;

    if (!referral_code && !emailInput) {
      return new Response(JSON.stringify({ error: "Email or referral code required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (emailInput && (emailInput.indexOf("@") < 1 || emailInput.length > 320)) {
      return new Response(JSON.stringify({ error: "Please enter a valid email address" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    let query = supabase
      .from("storybuilders_waitlist")
      .select("id, name, email, email_verified, verification_token, verification_sent_at, deleted_at");

    if (referral_code) {
      query = query.eq("referral_code", referral_code);
    } else if (emailInput) {
      query = query.ilike("email", emailInput);
    }

    const { data: user, error } = await query.maybeSingle();

    if (error || !user || user.deleted_at) {
      // Generic message so we don't leak which emails are on the waitlist
      return new Response(
        JSON.stringify({
          error: "We couldn't find that signup. Please check the email or join the waitlist again.",
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (user.email_verified) {
      return new Response(JSON.stringify({ already_verified: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (user.verification_sent_at) {
      const sentAt = new Date(user.verification_sent_at).getTime();
      const ageMin = (Date.now() - sentAt) / 60000;
      if (ageMin < RATE_LIMIT_MINUTES) {
        return new Response(
          JSON.stringify({
            error: "Please wait a couple of minutes before requesting another verification email.",
            retry_after_seconds: Math.ceil((RATE_LIMIT_MINUTES - ageMin) * 60),
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

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

    const verificationLink = `https://empowereddld.com/storypros/verify?token=${verificationToken}`;

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
