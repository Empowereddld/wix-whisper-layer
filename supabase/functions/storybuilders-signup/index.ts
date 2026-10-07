import { maskEmail } from "../_shared/logRedact.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { escapeHtml as escHtml } from "../_shared/html.ts";
import { issueDashboardToken } from "../_shared/dashboardToken.ts";
import { allow, clientIp } from "../_shared/rateLimit.ts";

// Repeat signup with an existing email: never reveal the referral code or
// points on screen. Email a dashboard link to the address on file instead.
async function neutralExistingResponse(
  supabase: any, supabaseUrl: string, serviceKey: string, req: Request,
  row: { id: string; name?: string | null; email?: string | null },
) {
  try {
    const ok = await allow(supabase, [
      { bucket: "signup-existing:ip", id: clientIp(req), max: 5, windowMin: 60 },
      { bucket: "signup-existing:email", id: row.email || row.id, max: 3, windowMin: 60 * 24 },
    ]);
    if (ok && row.email) {
      const link = `https://www.empowereddld.com/storypros/dashboard?dt=${encodeURIComponent(await issueDashboardToken(row.id))}`;
      await fetch(`${supabaseUrl}/functions/v1/send-waitlist-email`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${serviceKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          template: "dashboard_recovery",
          to: row.email,
          data: { name: (row.name || "").split(" ")[0] || "there", dashboard_link: link },
        }),
      });
    }
  } catch (e) {
    console.error("Existing-signup dashboard email failed:", e);
  }
  const { data: totalCount } = await supabase.rpc("get_storybuilders_waitlist_count");
  return new Response(
    JSON.stringify({ already_joined: true, check_email: true, total_count: totalCount ?? 0 }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}

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
  const emailFunctionUrl = `${supabaseUrl}/functions/v1/send-waitlist-email`;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Branded handoff page on our own domain (more resilient to email scanners
  // and inbox link rewriters than pointing directly at the functions URL).
  const verificationLink = `https://empowereddld.com/storypros/verify?token=${verificationToken}`;

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
    throw new Error(error || `Verification email send failed with status ${response.status}`);
  }
}

async function alertSignupEmailFailure(
  supabaseUrl: string,
  email: string,
  name: string,
  errorMessage: string
) {
  try {
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: "hello@empowereddld.com",
        subject: "🚨 Story Pros signup email failed",
        html: `<p><strong>A signup could not receive its verification email.</strong></p>
          <p><strong>Name:</strong> ${escHtml(name)}</p>
          <p><strong>Email:</strong> ${escHtml(email)}</p>
          <p><strong>Error:</strong> ${escHtml(errorMessage)}</p>`,
        text: `A Story Pros signup could not receive its verification email.\n\nName: ${name}\nEmail: ${email}\nError: ${errorMessage}`,
      }),
    });
  } catch (error) {
    console.error("Failed to send signup email failure alert:", error);
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
          name: (referrerName || "").split(" ")[0] || "there",
          first_name: (referrerName || "").split(" ")[0] || "there",
          referred_name: newUserName.split(" ")[0],
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
        "x-cron-secret": Deno.env.get("CRON_SECRET") ?? "",
      },
      body: JSON.stringify({
        email,
        ip_address: ipAddress,
        referred_by_code: referralCode,
      }),
      // Never let the fraud screen hold up a signup.
      signal: AbortSignal.timeout(4000),
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

// New-signup limits per network, keyed by a hashed server-seen address
// (never stored raw, purged after 2 days). Sized so a household, classroom
// or clinic can sign up several people while scripted bursts are stopped.
const SIGNUP_NET_LIMITS = (ip: string) => [
  { bucket: "signup-new:ip:15m", id: ip, max: 8, windowMin: 15 },
  { bucket: "signup-new:ip:24h", id: ip, max: 30, windowMin: 60 * 24 },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, ref, is_speech_professional, role, role_other, newsletter_consent } = await req.json();
    const wantsNewsletter = newsletter_consent === true;

    // Exact wording shown to the user at signup time (audit trail).
    const CONSENT_WORDING_VERSION = "newsletter-consent-v1";
    const CONSENT_CHECKBOX_TEXT = "Yes, I'd like practical DLD resources, Empowered DLD updates, and occasional Story Pros news by email.";
    const CONSENT_HELPER_TEXT = "Optional. You'll stay on the Story Pros waitlist whether or not you choose this. You can unsubscribe at any time.";

    if (!name || !email) {
      return new Response(JSON.stringify({ error: "Name and email are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Role is optional for backwards-compat with any older callers, but if
    // supplied it must be one of the known codes. "other" requires role_other.
    const ALLOWED_ROLES = ["parent", "speech_pro", "other"];
    let normalizedRole: string | null = null;
    let normalizedRoleOther: string | null = null;
    if (typeof role === "string" && role.length > 0) {
      if (!ALLOWED_ROLES.includes(role)) {
        return new Response(JSON.stringify({ error: "Invalid role" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      normalizedRole = role;
      if (role === "other") {
        const detail = typeof role_other === "string" ? role_other.trim() : "";
        if (!detail) {
          return new Response(JSON.stringify({ error: "Tell us a bit more about your role." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        normalizedRoleOther = detail.slice(0, 60);
      }
    }

    // Selecting Speech Professional as your role implicitly self-IDs as one
    // (admins still verify before the +50 bonus is awarded).
    const isSpeechPro = is_speech_professional === true || normalizedRole === "speech_pro";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists (active row only — mirrors the partial unique index
    // storybuilders_waitlist_email_active_unique). Without the deleted_at filter,
    // soft-deleted duplicates can make maybeSingle() return a "multiple rows" error,
    // which previously caused the function to fall through to INSERT and 500.
    const { data: existing, error: existingErr } = await supabase
      .from("storybuilders_waitlist")
      .select("id, name, email, referral_code, invite_count, points, email_verified")
      .eq("email", normalizedEmail)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingErr) {
      console.error("Existing-email lookup failed (will rely on 23505 fallback):", existingErr);
    }

    if (existing) {
      // Repeat signup: never record newsletter consent here, because the
      // person typing may not own this inbox. The owner is asked again on
      // their own dashboard (signed pass required).
      return await neutralExistingResponse(supabase, supabaseUrl, serviceKey, req, existing);
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

    // Server-seen network address only; browser-supplied values are ignored.
    const ipAddress = clientIp(req);

    // Network limit runs before anything is saved or emailed.
    if (!(await allow(supabase, SIGNUP_NET_LIMITS(ipAddress)))) {
      return new Response(
        JSON.stringify({
          error: "Too many signup attempts. Please try again later.",
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

    // Speech professionals get an automatic +50 bonus at signup (no manual approval).
    // We trust self-identification at launch; verification can be re-introduced later if needed.
    const SLP_AUTO_BONUS = 50;
    const initialPoints = 10 + (isSpeechPro ? SLP_AUTO_BONUS : 0);

    // Insert new entry
    const { data: newEntry, error: insertError } = await supabase
      .from("storybuilders_waitlist")
      .insert({
        name: name.trim(),
        email: normalizedEmail,
        referral_code: referralCode,
        referred_by_code: ref || null,
        points: initialPoints,
        verification_token: verificationToken,
        email_verified: false,
        is_speech_professional: isSpeechPro,
        speech_professional_verified: isSpeechPro, // auto-verified at signup (Option A)
        role: normalizedRole,
        role_other: normalizedRoleOther,
      })
      .select("referral_code, invite_count, points, id")
      .single();

    if (insertError) {
      // Race safety net: another concurrent submit (or a stale soft-deleted dup
      // pattern we somehow missed) won the unique index. Re-read the active row
      // and return the friendly already_joined payload instead of a 500.
      if ((insertError as any).code === "23505") {
        const { data: raceRow } = await supabase
          .from("storybuilders_waitlist")
          .select("id, name, email")
          .eq("email", normalizedEmail)
          .is("deleted_at", null)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (raceRow) {
          return await neutralExistingResponse(supabase, supabaseUrl, serviceKey, req, raceRow);
        }
      }

      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to join waitlist" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Also insert into the multi-token table so the link stays valid even if
    // a new token is later issued (resend, nudge, reminder).
    await supabase
      .from("waitlist_verification_tokens")
      .insert({ waitlist_id: newEntry.id, token: verificationToken });

    // Record the newsletter consent choice (yes or no) for the audit trail.
    // A `false` row only means "no opt-in at this moment" — it never revokes
    // an earlier affirmative record.
    try {
      await supabase.from("newsletter_consents").insert({
        waitlist_id: newEntry.id,
        email: normalizedEmail,
        consented: wantsNewsletter,
        source: "story-pros-waitlist",
        wording_version: CONSENT_WORDING_VERSION,
        checkbox_text: CONSENT_CHECKBOX_TEXT,
        helper_text: CONSENT_HELPER_TEXT,
      });
    } catch (e) {
      console.error("Failed to record newsletter consent:", e);
    }

    // Note: fraud check result is informational only (no DB columns yet)
    if (fraudCheck.flagged) {
      console.log("Fraud flagged:", maskEmail(normalizedEmail), fraudCheck.reasons.join("; "), "score:", fraudCheck.risk_score);
    }

    // Double opt-in: send ONLY the verification email on signup.
    // The Welcome email is sent by verify-email-waitlist after the user clicks the link.
    try {
      await sendVerificationEmail(supabaseUrl, name, normalizedEmail, verificationToken);

      const { error: sentAtError } = await supabase
        .from("storybuilders_waitlist")
        .update({ verification_sent_at: new Date().toISOString() })
        .eq("id", newEntry.id);

      if (sentAtError) {
        throw new Error(`Failed to record verification send timestamp: ${sentAtError.message}`);
      }
    } catch (emailError) {
      const message = emailError instanceof Error ? emailError.message : "unknown verification email error";
      console.error("Storybuilders signup verification email failure:", maskEmail(normalizedEmail), message);

      const { error: cleanupError } = await supabase
        .from("storybuilders_waitlist")
        .delete()
        .eq("id", newEntry.id);

      if (cleanupError) {
        console.error("Failed to clean up waitlist row after email failure:", cleanupError);
      }

      await alertSignupEmailFailure(supabaseUrl, normalizedEmail, name.trim(), message);

      return new Response(
        JSON.stringify({ error: "We couldn't send your verification email just now. Please try again in a few minutes." }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Referral points are NOT awarded at signup. They are awarded once, after this
    // member verifies their email (see _shared/referralAward.ts).

    const { data: totalCount } = await supabase.rpc("get_storybuilders_waitlist_count");

    return new Response(
      JSON.stringify({
        already_joined: false,
        dashboard_token: await issueDashboardToken(newEntry.id),
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
