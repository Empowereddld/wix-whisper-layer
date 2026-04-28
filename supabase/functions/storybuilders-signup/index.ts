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

// Double opt-in: on signup we send ONLY the verification email.
// The full Welcome email (and all tier emails) are gated until the user clicks verify.
async function sendVerificationEmail(
  supabaseUrl: string,
  name: string,
  email: string,
  verificationToken: string
) {
  try {
    const emailFunctionUrl = `${supabaseUrl}/functions/v1/send-waitlist-email`;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const verificationLink = `${supabaseUrl}/functions/v1/verify-email-waitlist?token=${verificationToken}`;

    const response = await fetch(emailFunctionUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        template: "verification",
        to: email,
        data: {
          name: name.split(" ")[0],
          verification_link: verificationLink,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to send verification email:", error);
    }
  } catch (error) {
    console.error("Error calling send-waitlist-email:", error);
  }
}

async function notifyReferrer(
  supabaseUrl: string,
  referrerEmail: string,
  referrerName: string,
  newUserName: string,
  newUserPoints: number
) {
  try {
    const emailFunctionUrl = `${supabaseUrl}/functions/v1/send-waitlist-email`;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const response = await fetch(emailFunctionUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        template: "referral_joined",
        to: referrerEmail,
        data: {
          name: newUserName.split(" ")[0],
          points: newUserPoints,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to send referral notification:", error);
    }
  } catch (error) {
    console.error("Error sending referral notification:", error);
  }
}

async function checkFraud(
  supabaseUrl: string,
  email: string,
  ipAddress: string,
  referralCode: string | null
): Promise<{
  flagged: boolean;
  reasons: string[];
  risk_score: number;
}> {
  try {
    const checkFraudUrl = `${supabaseUrl}/functions/v1/check-fraud`;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const response = await fetch(checkFraudUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        ip_address: ipAddress,
        referred_by_code: referralCode,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Fraud check API error:", error);
      // Return safe default if fraud check fails
      return { flagged: false, reasons: [], risk_score: 0 };
    }

    return await response.json();
  } catch (error) {
    console.error("Error calling check-fraud:", error);
    // Return safe default if fraud check fails
    return { flagged: false, reasons: [], risk_score: 0 };
  }
}

const SIGNUP_RATE_LIMIT = 5; // 5 signups per hour per IP

async function checkSignupRateLimit(
  supabase: any,
  ipAddress: string
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const { count, error } = await supabase
      .from("waitlist_events")
      .select("*", { count: "exact", head: true })
      .eq("metadata->>ip_address", ipAddress)
      .eq("event_type", "signup")
      .gte("created_at", oneHourAgo);

    if (error) {
      console.warn("Rate limit check error (allowing by default):", error);
      return { allowed: true, remaining: SIGNUP_RATE_LIMIT };
    }

    const requests = count || 0;
    const allowed = requests < SIGNUP_RATE_LIMIT;
    const remaining = Math.max(0, SIGNUP_RATE_LIMIT - requests);

    return { allowed, remaining };
  } catch (error) {
    console.warn("Rate limit check failed (allowing by default):", error);
    return { allowed: true, remaining: SIGNUP_RATE_LIMIT };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, ref, is_speech_professional } = await req.json();

    if (!name || !email) {
      return new Response(JSON.stringify({ error: "Name and email are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const isSpeechPro = is_speech_professional === true;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const { data: existing } = await supabase
      .from("storybuilders_waitlist")
      .select("referral_code, invite_count, points")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existing) {
      // Return existing entry
      const { data: totalCount } = await supabase.rpc("get_storybuilders_waitlist_count");
      return new Response(
        JSON.stringify({
          already_joined: true,
          referral_code: existing.referral_code,
          invite_count: existing.invite_count,
          points: existing.points,
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

    // Get IP address from headers
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
                      req.headers.get("cf-connecting-ip") ||
                      "unknown";

    // Check rate limit (5 signups per hour per IP)
    const rateLimit = await checkSignupRateLimit(supabase, ipAddress);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: "Too many signup attempts. Please try again later.",
          remaining: rateLimit.remaining,
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check for fraud
    const fraudCheck = await checkFraud(supabaseUrl, normalizedEmail, ipAddress, ref || null);

    // Generate verification token
    const verificationToken = crypto.randomUUID();

    // Insert new entry
    const { data: newEntry, error: insertError } = await supabase
      .from("storybuilders_waitlist")
      .insert({
        name: name.trim(),
        email: normalizedEmail,
        referral_code: referralCode,
        referred_by_code: ref || null,
        points: 10, // Initial signup bonus
        verification_token: verificationToken,
        verification_sent_at: new Date().toISOString(),
        email_verified: false,
        is_speech_professional: isSpeechPro,
        speech_professional_verified: false,
      })
      .select("referral_code, invite_count, points, id")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to join waitlist" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Note: fraud check result is informational only (no DB columns yet)
    if (fraudCheck.flagged) {
      console.log("Fraud flagged:", normalizedEmail, fraudCheck.reasons.join("; "), "score:", fraudCheck.risk_score);
    }

    // Double opt-in: send ONLY the verification email on signup.
    // The Welcome email is sent by verify-email-waitlist after the user clicks the link.
    await sendVerificationEmail(supabaseUrl, name, normalizedEmail, verificationToken);

    // Handle referral
    if (ref) {
      const { data: referrer } = await supabase
        .from("storybuilders_waitlist")
        .select("email, name, points, referral_code")
        .eq("referral_code", ref)
        .single();

      if (referrer) {
        // Atomic award: 25 pts + 10 first-referral bonus + invite increment (single RPC)
        const { data: awardResult } = await supabase.rpc("award_referral", {
          p_referrer_code: ref,
          p_referral_points: 25,
          p_first_bonus: 10,
        });

        const awardedPoints = (awardResult as any)?.[0]?.new_points ?? (referrer.points ?? 0) + 25;

        // Send referral notification email
        await notifyReferrer(supabaseUrl, referrer.email, referrer.name, name, awardedPoints);
      }
    }

    const { data: totalCount } = await supabase.rpc("get_storybuilders_waitlist_count");

    return new Response(
      JSON.stringify({
        already_joined: false,
        referral_code: newEntry.referral_code,
        invite_count: newEntry.invite_count ?? 0,
        points: newEntry.points,
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
