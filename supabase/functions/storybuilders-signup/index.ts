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

async function sendWelcomeEmail(
  supabaseUrl: string,
  name: string,
  email: string,
  referralCode: string,
  verificationToken: string
) {
  try {
    const emailFunctionUrl = `${supabaseUrl}/functions/v1/send-waitlist-email`;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const appUrl = Deno.env.get("APP_URL") || "https://empowereddld.com/storypros";

    const verificationLink = `${appUrl}/verify?token=${verificationToken}`;

    const response = await fetch(emailFunctionUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        template: "welcome",
        to: email,
        data: {
          name: name.split(" ")[0],
          referral_code: referralCode,
          verification_link: verificationLink,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to send welcome email:", error);
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

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const { data: existing } = await supabase
      .from("storybuilders_waitlist")
      .select("referral_code, invite_count, points, current_tier")
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
          current_tier: existing.current_tier,
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

    // Insert new entry with initial points, queue position, and fraud flag
    const { data: newEntry, error: insertError } = await supabase
      .from("storybuilders_waitlist")
      .insert({
        name: name.trim(),
        email: normalizedEmail,
        referral_code: referralCode,
        referred_by_code: ref || null,
        ip_address: ipAddress,
        points: 10, // Initial signup bonus
        current_tier: 0,
        verification_token: verificationToken,
        verification_sent_at: new Date().toISOString(),
        email_verified: false,
        fraud_flagged: fraudCheck.flagged,
        fraud_reason: fraudCheck.flagged ? fraudCheck.reasons.join("; ") : null,
        fraud_risk_score: fraudCheck.risk_score,
      })
      .select("referral_code, invite_count, points, current_tier, id")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to join waitlist" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Log signup event
    await supabase
      .from("waitlist_events")
      .insert({
        user_email: normalizedEmail,
        event_type: "signup",
        points_awarded: 10,
        metadata: { referral_code: referralCode, ip_address: ipAddress },
      });

    // Calculate queue position for this user
    await supabase.rpc("recalculate_waitlist_positions");

    // Get updated position
    const { data: userPosition } = await supabase
      .from("storybuilders_waitlist")
      .select("queue_position")
      .eq("email", normalizedEmail)
      .single();

    // Send welcome email with verification token
    await sendWelcomeEmail(supabaseUrl, name, normalizedEmail, referralCode, verificationToken);

    // Handle referral
    if (ref) {
      // Find the referrer
      const { data: referrer } = await supabase
        .from("storybuilders_waitlist")
        .select("email, name, points, current_tier")
        .eq("referral_code", ref)
        .single();

      if (referrer) {
        // Award 25 points to referrer
        const pointsResult = await supabase.rpc("award_waitlist_points", {
          p_email: referrer.email,
          p_points: 25,
          p_event_type: "referral_convert",
          p_metadata: { referred_user_email: normalizedEmail, referred_user_name: name },
        });

        // Send referral notification email to referrer
        await notifyReferrer(supabaseUrl, referrer.email, referrer.name, name, pointsResult?.data?.new_points || 0);

        // Log referral event for the new user
        await supabase
          .from("waitlist_events")
          .insert({
            user_email: normalizedEmail,
            event_type: "referred_signup",
            points_awarded: 0,
            metadata: { referred_by: referrer.email },
          });
      }
    }

    const { data: totalCount } = await supabase.rpc("get_storybuilders_waitlist_count");

    return new Response(
      JSON.stringify({
        already_joined: false,
        referral_code: newEntry.referral_code,
        invite_count: newEntry.invite_count ?? 0,
        points: newEntry.points,
        current_tier: newEntry.current_tier,
        queue_position: userPosition?.queue_position,
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
