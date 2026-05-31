import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Use a Headers instance with explicit lowercase keys + nosniff so no
// CDN/gateway/proxy can mis-detect or strip the Content-Type. The "page of
// random text" symptom users reported came from an intermittent text/plain
// response that browsers rendered as raw HTML source.
function htmlHeaders(): Headers {
  const h = new Headers();
  h.set("content-type", "text/html; charset=utf-8");
  h.set("x-content-type-options", "nosniff");
  h.set("cache-control", "no-store");
  h.set("access-control-allow-origin", "*");
  return h;
}

function getSuccessHTML(email: string, alreadyVerified = false): string {
  const brandColor = "#5B2D8E";
  const lightBackground = "#F8F5FC";
  const successColor = "#10B981";

  const heading = alreadyVerified ? "Already Verified" : "Email Verified!";
  const subhead = alreadyVerified ? "You're already on the list" : "You're all set";
  const message = alreadyVerified
    ? "Good news, this email has already been confirmed. Your spot on the Story Pros waitlist is secure and your +15 points were already added."
    : "Congratulations! Your email has been verified.";
  const secondary = alreadyVerified
    ? "Head back to Story Pros to keep climbing the tiers."
    : "You've secured your spot on our exclusive waitlist!";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${heading} - Story Pros</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Nunito', 'DM Sans', Arial, sans-serif;
          background: linear-gradient(135deg, ${brandColor} 0%, #7C3FB8 100%);
          min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .container { max-width: 500px; width: 100%; background: white; border-radius: 16px; box-shadow: 0 20px 60px rgba(91,45,142,0.3); overflow: hidden; }
        .header { background: linear-gradient(135deg, ${brandColor} 0%, #7C3FB8 100%); color: white; padding: 40px 20px; text-align: center; }
        .header h1 { font-size: 32px; margin-bottom: 10px; font-weight: 700; }
        .checkmark { width: 60px; height: 60px; margin: 0 auto 20px; background: ${successColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; color: white; }
        .content { padding: 40px; text-align: center; line-height: 1.6; color: #333; }
        .content p { margin-bottom: 16px; font-size: 16px; }
        .email-info { background: ${lightBackground}; border-radius: 8px; padding: 12px; margin: 20px 0; font-size: 14px; word-break: break-all; color: #666; }
        .button { display: inline-block; background: ${brandColor}; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; font-size: 16px; }
        .button:hover { background: #4A2370; }
        .footer { background: ${lightBackground}; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="checkmark">&#10003;</div>
          <h1>${heading}</h1>
          <p>${subhead}</p>
        </div>
        <div class="content">
          <p>${message}</p>
          <div class="email-info">${email}</div>
          <p>${secondary}</p>
          <a href="https://empowereddld.com/storypros" class="button">Back to Story Pros</a>
        </div>
        <div class="footer">
          <p>Thank you for joining Story Pros!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function getErrorHTML(
  reason: string,
  opts: { prefillEmail?: string; supabaseUrl: string; anonKey: string }
): string {
  const brandColor = "#5B2D8E";
  const accentColor = "#EF4444";
  const prefill = opts.prefillEmail ? escapeAttr(opts.prefillEmail) : "";
  const resendUrl = `${opts.supabaseUrl}/functions/v1/resend-verification-waitlist`;
  const anonKey = escapeAttr(opts.anonKey);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verification Link Issue - Story Pros</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Nunito', 'DM Sans', Arial, sans-serif;
          background: linear-gradient(135deg, ${brandColor} 0%, #7C3FB8 100%);
          min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .container { max-width: 500px; width: 100%; background: white; border-radius: 16px; box-shadow: 0 20px 60px rgba(91,45,142,0.3); overflow: hidden; }
        .header { background: linear-gradient(135deg, ${brandColor} 0%, #7C3FB8 100%); color: white; padding: 36px 20px; text-align: center; }
        .header h1 { font-size: 26px; margin-bottom: 6px; font-weight: 700; }
        .icon { font-size: 40px; margin-bottom: 14px; }
        .content { padding: 32px 36px 36px; text-align: center; line-height: 1.6; color: #333; }
        .content p { margin-bottom: 14px; font-size: 16px; }
        .reason { background: #FEF3F2; border-left: 4px solid ${accentColor}; padding: 12px 14px; border-radius: 8px; margin: 4px 0 22px; text-align: left; font-size: 14px; color: #7F1D1D; }
        form.resend { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; text-align: left; }
        form.resend input[type="email"] { width: 100%; padding: 12px 14px; font-size: 15px; border: 1px solid #D1D5DB; border-radius: 8px; outline: none; font-family: inherit; }
        form.resend input[type="email"]:focus { border-color: ${brandColor}; }
        form.resend button { background: ${brandColor}; color: white; padding: 13px 18px; border: none; border-radius: 8px; font-weight: 600; font-size: 15px; cursor: pointer; font-family: inherit; }
        form.resend button:hover { background: #4A2370; }
        form.resend button:disabled { opacity: 0.6; cursor: not-allowed; }
        .status { margin-top: 14px; font-size: 14px; min-height: 18px; }
        .status.ok { color: #047857; }
        .status.err { color: ${accentColor}; }
        .secondary { display: inline-block; margin-top: 18px; color: ${brandColor}; text-decoration: none; font-weight: 600; font-size: 14px; }
        .footer { background: #F9FAFB; padding: 18px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="icon">&#9888;</div>
          <h1>Verification Link Issue</h1>
        </div>
        <div class="content">
          <div class="reason">${reason}</div>
          <p style="font-size: 15px; color: #555;">Drop your email below and we'll send you a fresh one.</p>
          <form id="resend-form" class="resend" novalidate>
            <input type="email" id="resend-email" name="email" placeholder="you@example.com" value="${prefill}" required />
            <button type="submit" id="resend-btn">Resend my verification link</button>
          </form>
          <div id="resend-status" class="status"></div>
          <a href="https://empowereddld.com/storypros" class="secondary">Back to Story Pros</a>
        </div>
        <div class="footer">
          <p>Questions? Contact us at hello@empowereddld.com</p>
        </div>
      </div>
      <script>
        (function () {
          var form = document.getElementById('resend-form');
          var status = document.getElementById('resend-status');
          var btn = document.getElementById('resend-btn');
          var input = document.getElementById('resend-email');
          if (!form) return;
          form.addEventListener('submit', function (e) {
            e.preventDefault();
            var email = (input.value || '').trim();
            status.className = 'status';
            status.textContent = '';
            if (!email || email.indexOf('@') < 1) {
              status.className = 'status err';
              status.textContent = 'Please enter a valid email address.';
              return;
            }
            btn.disabled = true;
            var originalLabel = btn.textContent;
            btn.textContent = 'Sending...';
            fetch(${JSON.stringify(resendUrl)}, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': ${JSON.stringify(anonKey)},
                'Authorization': 'Bearer ' + ${JSON.stringify(anonKey)}
              },
              body: JSON.stringify({ email: email })
            })
              .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }).catch(function () { return { ok: r.ok, body: {} }; }); })
              .then(function (res) {
                if (res.ok && (res.body.success || res.body.already_verified)) {
                  form.style.display = 'none';
                  status.className = 'status ok';
                  status.textContent = res.body.already_verified
                    ? 'This email is already verified. You can head back to Story Pros.'
                    : 'Check your inbox, a fresh link is on the way.';
                } else {
                  status.className = 'status err';
                  status.textContent = (res.body && res.body.error) || 'Something went wrong. Please try again in a moment.';
                  btn.disabled = false;
                  btn.textContent = originalLabel;
                }
              })
              .catch(function () {
                status.className = 'status err';
                status.textContent = 'Network error. Please try again.';
                btn.disabled = false;
                btn.textContent = originalLabel;
              });
          });
        })();
      </script>
    </body>
    </html>
  `;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  const errorPage = (reason: string, status: number, prefillEmail?: string) =>
    new Response(getErrorHTML(reason, { prefillEmail, supabaseUrl, anonKey }), {
      status,
      headers: HTML_HEADERS,
    });

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return errorPage("No verification token was provided.", 400);
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    let waitlistId: string | null = null;
    let tokenRowId: string | null = null;
    let tokenCreatedAt: string | null = null;
    let tokenUsedAt: string | null = null;

    const { data: tokenRow } = await supabase
      .from("waitlist_verification_tokens")
      .select("id, waitlist_id, created_at, used_at")
      .eq("token", token)
      .maybeSingle();

    if (tokenRow) {
      waitlistId = tokenRow.waitlist_id;
      tokenRowId = tokenRow.id;
      tokenCreatedAt = tokenRow.created_at;
      tokenUsedAt = tokenRow.used_at;
    } else {
      const { data: legacy } = await supabase
        .from("storybuilders_waitlist")
        .select("id, verification_sent_at")
        .eq("verification_token", token)
        .maybeSingle();
      if (legacy) {
        waitlistId = legacy.id;
        tokenCreatedAt = legacy.verification_sent_at;
      }
    }

    if (!waitlistId) {
      return errorPage("This verification link is invalid or has already been replaced.", 404);
    }

    const { data: user } = await supabase
      .from("storybuilders_waitlist")
      .select("id, email, email_verified, deleted_at")
      .eq("id", waitlistId)
      .maybeSingle();

    if (!user) {
      return errorPage("We couldn't find this signup.", 404);
    }

    if (user.deleted_at) {
      return errorPage("This signup is no longer active.", 410);
    }

    if (user.email_verified || tokenUsedAt) {
      return new Response(null, {
        status: 302,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Location": "https://empowereddld.com/storypros/verified?already=1",
          "Cache-Control": "no-store",
        },
      });
    }

    if (tokenCreatedAt) {
      const sentAt = new Date(tokenCreatedAt);
      const hoursDiff = (Date.now() - sentAt.getTime()) / (1000 * 60 * 60);
      if (hoursDiff > 168) {
        return errorPage("This verification link is no longer valid.", 410, user.email);
      }
    }

    const { data: rpcRows, error: rpcError } = await supabase.rpc(
      "verify_waitlist_and_award",
      { p_waitlist_id: user.id, p_bonus: 15 }
    );

    if (rpcError) {
      console.error("verify_waitlist_and_award error:", rpcError);
      return errorPage("We hit a snag verifying your email.", 500, user.email);
    }

    const result: any = Array.isArray(rpcRows) ? rpcRows[0] : rpcRows;

    if (tokenRowId) {
      await supabase
        .from("waitlist_verification_tokens")
        .update({ used_at: new Date().toISOString() })
        .eq("id", tokenRowId);
    }

    if (!result?.out_verified_now) {
      return new Response(null, {
        status: 302,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Location": "https://empowereddld.com/storypros/verified?already=1",
          "Cache-Control": "no-store",
        },
      });
    }

    console.log("verify-email-waitlist: verified", {
      id: user.id,
      email: user.email,
      points_after: result.out_new_points,
      verified_at: new Date().toISOString(),
    });

    if (!result.out_welcome_sent_at) {
      const { data: claimed } = await supabase
        .from("storybuilders_waitlist")
        .update({ welcome_sent_at: new Date().toISOString() })
        .eq("id", user.id)
        .is("welcome_sent_at", null)
        .select("id");

      if (claimed && claimed.length > 0) {
        try {
          const firstName = (result.out_name as string | undefined)?.split(" ")[0] || "friend";
          const referralCode = (result.out_referral_code as string | undefined) || "";

          await fetch(`${supabaseUrl}/functions/v1/send-waitlist-email`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${serviceKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              template: "welcome",
              to: result.out_email ?? user.email,
              data: {
                name: firstName,
                referral_code: referralCode,
              },
            }),
          });
        } catch (welcomeErr) {
          console.error("Welcome email dispatch failed:", welcomeErr);
          await supabase
            .from("storybuilders_waitlist")
            .update({ welcome_sent_at: null })
            .eq("id", user.id);
        }
      }
    }

    return new Response(null, {
      status: 302,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Location": `https://empowereddld.com/storypros/verified?name=${encodeURIComponent((result.out_name as string | undefined) || "")}&points=15&ref=${encodeURIComponent((result.out_referral_code as string | undefined) || "")}`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return errorPage("Something went wrong on our end.", 500);
  }
});
