import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Comprehensive list of disposable email domains
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  // Popular disposable email services
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "throwaway.email",
  "yopmail.com",
  "sharklasers.com",
  "grr.la",
  "guerrillamailblock.com",
  "pokemail.com",
  "spam4.me",
  "trashmail.com",
  "10minutemail.com",
  "guerrillamail.info",
  "guerrillamail.net",
  "guerrillamail.org",
  "pokemail.net",
  "mailnesia.com",
  "maildrop.cc",
  "mintemail.com",
  "mytrashmail.com",
  "temp-mail.org",
  "temporaryemail.com",
  "throwawaymail.com",
  "tempmail.net",
  "temporary-mail.net",
  "yopmail.fr",
  "yopmail.net",
  "safeemail.com",
  "fakeinbox.com",
  "spam-mail.com",
  "disposablemail.com",
  "trash-mail.com",
  "temp-mail.io",
  "email.net",
  "sharklasers.net",
  "grr.la",
  "pokemail.org",
]);

interface FraudCheckRequest {
  email: string;
  ip_address: string;
}

interface FraudCheckResponse {
  flagged: boolean;
  reasons: string[];
  risk_score: number;
}

async function checkIPRateLimit(
  supabase: any,
  ipAddress: string
): Promise<{ count: number; exceedsLimit: boolean }> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("storybuilders_waitlist")
    .select("id")
    .eq("ip_address", ipAddress)
    .gte("created_at", oneDayAgo);

  if (error) {
    console.error("Rate limit check error:", error);
    return { count: 0, exceedsLimit: false };
  }

  const count = data?.length ?? 0;
  const MAX_SIGNUPS_PER_IP_PER_DAY = 5;

  return {
    count,
    exceedsLimit: count >= MAX_SIGNUPS_PER_IP_PER_DAY,
  };
}

async function checkEmailPatterns(
  supabase: any,
  email: string,
  ipAddress: string
): Promise<boolean> {
  const emailPattern = /(.+?)(\d+)@/;
  const match = email.match(emailPattern);

  if (!match) {
    return false;
  }

  const baseEmail = match[1];
  const emailRegex = new RegExp(`^${baseEmail}\\d+@`, "i");

  const { data, error } = await supabase
    .from("storybuilders_waitlist")
    .select("id")
    .eq("ip_address", ipAddress)
    .filter("email", "ilike", `%${baseEmail}%`);

  if (error) {
    console.error("Email pattern check error:", error);
    return false;
  }

  // If there are 3+ similar emails from same IP, flag it
  return (data?.length ?? 0) >= 3;
}

async function checkSelfReferral(
  supabase: any,
  email: string,
  referredByCode: string | null
): Promise<boolean> {
  if (!referredByCode) {
    return false;
  }

  const { data, error } = await supabase
    .from("storybuilders_waitlist")
    .select("email")
    .eq("referral_code", referredByCode)
    .maybeSingle();

  if (error) {
    console.error("Self-referral check error:", error);
    return false;
  }

  if (!data) {
    return false;
  }

  return data.email.toLowerCase() === email.toLowerCase();
}

function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;

  return DISPOSABLE_EMAIL_DOMAINS.has(domain) ||
    DISPOSABLE_EMAIL_DOMAINS.has(domain.replace(/^www\./, ""));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, ip_address, referred_by_code } = (await req.json()) as FraudCheckRequest & {
      referred_by_code?: string;
    };

    if (!email || !ip_address) {
      return new Response(
        JSON.stringify({ error: "email and ip_address are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const normalizedEmail = email.toLowerCase().trim();
    const reasons: string[] = [];
    let riskScore = 0;

    // Check 1: Disposable email domain
    if (isDisposableEmail(normalizedEmail)) {
      reasons.push("Disposable email domain detected");
      riskScore += 30;
    }

    // Check 2: Self-referral
    if (await checkSelfReferral(supabase, normalizedEmail, referred_by_code || null)) {
      reasons.push("Self-referral detected");
      riskScore += 40;
    }

    // Check 3: IP rate limiting
    const rateLimit = await checkIPRateLimit(supabase, ip_address);
    if (rateLimit.exceedsLimit) {
      reasons.push(`IP address exceeded limit (${rateLimit.count} signups in 24h)`);
      riskScore += 50;
    }

    // Check 4: Email pattern detection
    if (await checkEmailPatterns(supabase, normalizedEmail, ip_address)) {
      reasons.push("Sequential email pattern from same IP");
      riskScore += 35;
    }

    const flagged = riskScore >= 30; // Flag if risk score is 30 or higher

    // Log fraud attempt to database
    if (flagged) {
      try {
        await supabase.from("waitlist_fraud_log").insert({
          email: normalizedEmail,
          ip_address,
          risk_score: riskScore,
          fraud_reasons: reasons, // Array of reason strings
          user_agent: req.headers.get("user-agent"),
        });
      } catch (logError) {
        console.error("Failed to log fraud attempt:", logError);
        // Don't fail the request if logging fails
      }
    }

    const response: FraudCheckResponse = {
      flagged,
      reasons,
      risk_score: riskScore,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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
