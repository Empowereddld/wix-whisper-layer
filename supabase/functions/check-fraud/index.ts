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
}

interface FraudCheckResponse {
  flagged: boolean;
  reasons: string[];
  risk_score: number;
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

  // Internal-only: only the storybuilders-signup edge function should call this.
  const cronSecret = Deno.env.get("CRON_SECRET");
  if (!cronSecret || req.headers.get("x-cron-secret") !== cronSecret) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { email, referred_by_code } = (await req.json()) as FraudCheckRequest & {
      referred_by_code?: string;
    };

    if (typeof email !== "string" || !email || email.length > 254 ||
        (referred_by_code != null && (typeof referred_by_code !== "string" || referred_by_code.length > 32))) {
      return new Response(
        JSON.stringify({ error: "valid email is required" }),
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

    // Network rate limiting now happens in storybuilders-signup (hashed,
    // server-seen address) before a row is saved, so it is not repeated here.

    const flagged = riskScore >= 30; // Flag if risk score is 30 or higher

    // Flagged results are logged (masked) by storybuilders-signup.

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
