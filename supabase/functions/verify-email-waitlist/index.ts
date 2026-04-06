import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getSuccessHTML(email: string): string {
  const brandColor = "#5B2D8E";
  const lightBackground = "#F8F5FC";
  const successColor = "#10B981";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verified - Story Builders</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Nunito', 'DM Sans', Arial, sans-serif;
          background: linear-gradient(135deg, ${brandColor} 0%, #7C3FB8 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          max-width: 500px;
          width: 100%;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(91, 45, 142, 0.3);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, ${brandColor} 0%, #7C3FB8 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          font-size: 32px;
          margin-bottom: 10px;
          font-weight: 700;
        }
        .checkmark {
          width: 60px;
          height: 60px;
          margin: 0 auto 20px;
          background: ${successColor};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        }
        .content {
          padding: 40px;
          text-align: center;
          line-height: 1.6;
          color: #333;
        }
        .content p {
          margin-bottom: 16px;
          font-size: 16px;
        }
        .points-badge {
          background: ${lightBackground};
          border: 2px solid ${brandColor};
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
          display: inline-block;
        }
        .points-badge .label {
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
        }
        .points-badge .value {
          font-size: 36px;
          font-weight: 700;
          color: ${brandColor};
        }
        .email-info {
          background: ${lightBackground};
          border-radius: 8px;
          padding: 12px;
          margin: 20px 0;
          font-size: 14px;
          word-break: break-all;
          color: #666;
        }
        .button {
          display: inline-block;
          background: ${brandColor};
          color: white;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin-top: 20px;
          font-size: 16px;
          border: none;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .button:hover {
          background: #4A2370;
        }
        .footer {
          background: ${lightBackground};
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
        }
        .footer a {
          color: ${brandColor};
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="checkmark">✓</div>
          <h1>Email Verified!</h1>
          <p>You're all set</p>
        </div>
        <div class="content">
          <p>Congratulations! Your email has been verified.</p>
          <div class="email-info">${email}</div>
          <div class="points-badge">
            <div class="label">Bonus Points Awarded</div>
            <div class="value">+5</div>
          </div>
          <p>You've earned 5 bonus points and secured your spot on our exclusive waitlist!</p>
          <p style="font-size: 14px; color: #666;">You can now return to your dashboard to track your progress and start referring friends.</p>
          <a href="https://storybuilders.app/dashboard" class="button">Go to Dashboard</a>
        </div>
        <div class="footer">
          <p>Thank you for joining Story Builders!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getErrorHTML(reason: string = "Invalid or expired token"): string {
  const brandColor = "#5B2D8E";
  const errorColor = "#EF4444";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verification Failed - Story Builders</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Nunito', 'DM Sans', Arial, sans-serif;
          background: linear-gradient(135deg, ${brandColor} 0%, #7C3FB8 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          max-width: 500px;
          width: 100%;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(91, 45, 142, 0.3);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, ${errorColor} 0%, #DC2626 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          font-size: 32px;
          margin-bottom: 10px;
          font-weight: 700;
        }
        .icon {
          font-size: 48px;
          margin-bottom: 20px;
        }
        .content {
          padding: 40px;
          text-align: center;
          line-height: 1.6;
          color: #333;
        }
        .content p {
          margin-bottom: 16px;
          font-size: 16px;
        }
        .reason {
          background: #FEE2E2;
          border-left: 4px solid ${errorColor};
          padding: 16px;
          border-radius: 8px;
          margin: 20px 0;
          text-align: left;
          font-size: 14px;
          color: #7F1D1D;
        }
        .button {
          display: inline-block;
          background: ${brandColor};
          color: white;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin-top: 20px;
          font-size: 16px;
          border: none;
          cursor: pointer;
        }
        .button:hover {
          background: #4A2370;
        }
        .footer {
          background: #F9FAFB;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="icon">⚠️</div>
          <h1>Verification Failed</h1>
        </div>
        <div class="content">
          <p>We couldn't verify your email address.</p>
          <div class="reason">
            <strong>Reason:</strong> ${reason}
          </div>
          <p style="font-size: 14px; color: #666;">
            If you need a new verification link, please sign up again or contact our support team.
          </p>
          <a href="https://storybuilders.app" class="button">Return to Story Builders</a>
        </div>
        <div class="footer">
          <p>Questions? Contact us at support@storybuilders.app</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new Response(getErrorHTML("No verification token provided"), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "text/html" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Find the user by verification token
    const { data: user, error: findError } = await supabase
      .from("storybuilders_waitlist")
      .select("id, email, verification_token, email_verified")
      .eq("verification_token", token)
      .maybeSingle();

    if (findError || !user) {
      console.error("Token lookup error:", findError);
      return new Response(getErrorHTML("Invalid or expired verification token"), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "text/html" },
      });
    }

    if (user.email_verified) {
      return new Response(getErrorHTML("This email has already been verified"), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "text/html" },
      });
    }

    // Mark email as verified
    const { error: updateError } = await supabase
      .from("storybuilders_waitlist")
      .update({
        email_verified: true,
        verification_verified_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(getErrorHTML("Failed to verify email"), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "text/html" },
      });
    }

    // Award 5 points for verification
    const { error: awardError } = await supabase.rpc("award_waitlist_points", {
      p_email: user.email,
      p_points: 5,
      p_event_type: "verify_email",
      p_metadata: { verification_token: token },
    });

    if (awardError) {
      console.error("Award points error:", awardError);
      // Still succeed even if points award fails
    }

    // Log verification event
    await supabase
      .from("waitlist_events")
      .insert({
        user_email: user.email,
        event_type: "verify_email",
        points_awarded: 5,
        metadata: { verification_token: token },
      })
      .then(() => {})
      .catch((err) => console.error("Event logging error:", err));

    return new Response(getSuccessHTML(user.email), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "text/html" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(getErrorHTML("An unexpected error occurred"), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "text/html" },
    });
  }
});
