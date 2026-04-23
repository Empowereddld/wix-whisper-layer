import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailData {
  template: string;
  to: string;
  data?: {
    name?: string;
    referral_code?: string;
    verification_link?: string;
    tier_name?: string;
    tier_reward?: string;
    recent_signups?: number;
    user_position?: number;
    total_users?: number;
    [key: string]: any;
  };
}

function getEmailTemplate(
  template: string,
  data: EmailData["data"] = {}
): { subject: string; html: string } {
  const brandColor = "#5B2D8E";
  const lightBackground = "#F8F5FC";
  const cardBackground = "#FFFFFF";

  const baseStyles = `
    font-family: 'Nunito', 'DM Sans', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
  `;

  const headerStyles = `
    background: linear-gradient(135deg, ${brandColor} 0%, #7C3FB8 100%);
    color: white;
    padding: 40px 20px;
    text-align: center;
    border-radius: 12px 12px 0 0;
  `;

  const buttonStyles = `
    display: inline-block;
    background: ${brandColor};
    color: white;
    padding: 14px 32px;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    margin: 20px 0;
    font-size: 16px;
  `;

  const footerStyles = `
    text-align: center;
    color: #999;
    font-size: 12px;
    margin-top: 40px;
    border-top: 1px solid #eee;
    padding-top: 20px;
  `;

  const containerStyles = `
    max-width: 600px;
    margin: 0 auto;
    background: ${lightBackground};
    padding: 20px;
  `;

  const cardStyles = `
    background: ${cardBackground};
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 2px 8px rgba(91, 45, 142, 0.1);
  `;

  switch (template) {
    case "welcome": {
      return {
        subject: `Welcome to Story Pros, ${data.name}!`,
        html: `
          <div style="${containerStyles}">
            <div style="${cardStyles}">
              <div style="${headerStyles}">
                <h1 style="margin: 0; font-size: 28px;">Welcome to Story Pros</h1>
              </div>
              <div style="padding: 20px 0;">
                <p style="${baseStyles}">Hi ${data.name},</p>
                <p style="${baseStyles}">
                  You've officially joined our exclusive waitlist! We're thrilled to have you here.
                  You're now part of an amazing community of creators building the next generation
                  of storytelling tools.
                </p>
                <p style="${baseStyles}"><strong>Your Referral Code:</strong> <code style="background: ${lightBackground}; padding: 4px 8px; border-radius: 4px; font-weight: 600;">${data.referral_code}</code></p>
                <p style="${baseStyles}">
                  Share this code with friends and unlock exclusive tiers with amazing rewards.
                  Every friend who joins moves you closer to the top of the waitlist!
                </p>
                <p style="${baseStyles}">
                  <strong>What's next?</strong> Keep an eye on your inbox for exclusive updates,
                  behind-the-scenes content, and opportunities to climb the waitlist ladder.
                </p>
                <a href="https://empowereddld.com/storypros" style="${buttonStyles}">Explore Story Pros</a>
                <p style="${baseStyles}">
                  Questions? Reply to this email and we'll get back to you soon.
                </p>
                <p style="${baseStyles}">
                  The Story Pros Team
                </p>
              </div>
              <div style="${footerStyles}">
                <p>You received this because you signed up for the Story Pros waitlist.</p>
                <p><a href="#" style="color: ${brandColor}; text-decoration: none;">Unsubscribe</a></p>
              </div>
            </div>
          </div>
        `,
      };
    }

    case "referral_joined": {
      return {
        subject: `Good news! ${data.name} joined through your referral!`,
        html: `
          <div style="${containerStyles}">
            <div style="${cardStyles}">
              <div style="${headerStyles}">
                <h1 style="margin: 0; font-size: 28px;">You've Got a Referral!</h1>
              </div>
              <div style="padding: 20px 0;">
                <p style="${baseStyles}">Great news!</p>
                <p style="${baseStyles}">
                  <strong>${data.name}</strong> just joined Story Pros using your referral code!
                  You've earned 25 points and are now closer to unlocking exclusive rewards.
                </p>
                <p style="${baseStyles}">
                  <strong>Points Earned:</strong> +25<br/>
                  <strong>Total Points:</strong> ${data.points || 'TBD'}
                </p>
                <p style="${baseStyles}">
                  Keep sharing to unlock tier rewards:
                </p>
                <ul style="${baseStyles}">
                  <li>Tier 2 — 35 pts (1 referral)</li>
                  <li>Tier 3 — 75 pts (3 referrals)</li>
                  <li>Tier 4 — 130 pts (5 referrals)</li>
                  <li>Tier 5 — 250 pts (10 referrals)</li>
                  <li>Tier 6 — 500 pts (20 referrals)</li>
                </ul>
                <a href="https://empowereddld.com/storypros/dashboard" style="${buttonStyles}">View Your Journey</a>
                <p style="${baseStyles}">
                  The Story Pros Team
                </p>
              </div>
              <div style="${footerStyles}">
                <p>You received this because someone used your referral code.</p>
                <p><a href="#" style="color: ${brandColor}; text-decoration: none;">Unsubscribe</a></p>
              </div>
            </div>
          </div>
        `,
      };
    }

    case "milestone_unlocked": {
      return {
        subject: `Congratulations! You've unlocked the ${data.tier_name} Tier!`,
        html: `
          <div style="${containerStyles}">
            <div style="${cardStyles}">
              <div style="${headerStyles}">
                <h1 style="margin: 0; font-size: 28px;">Tier Unlocked!</h1>
              </div>
              <div style="padding: 20px 0;">
                <p style="${baseStyles}">Wow! You've reached a new milestone!</p>
                <p style="${baseStyles}">
                  You've just unlocked the <strong>${data.tier_name}</strong> tier!
                  Your dedication and support mean everything to us.
                </p>
                <p style="${baseStyles}">
                  <strong>Your New Tier:</strong> ${data.tier_name}<br/>
                  <strong>Exclusive Reward:</strong> ${data.tier_reward || 'Coming soon!'}
                </p>
                <p style="${baseStyles}">
                  As a ${data.tier_name}, you now have access to exclusive benefits and early features.
                  We'll be reaching out soon with all the details about your special rewards.
                </p>
                <a href="https://empowereddld.com/storypros/dashboard" style="${buttonStyles}">View Your Rewards</a>
                <p style="${baseStyles}">
                  Thank you for being an amazing part of our community!
                </p>
                <p style="${baseStyles}">
                  The Story Pros Team
                </p>
              </div>
              <div style="${footerStyles}">
                <p>You received this because you unlocked a new tier.</p>
                <p><a href="#" style="color: ${brandColor}; text-decoration: none;">Unsubscribe</a></p>
              </div>
            </div>
          </div>
        `,
      };
    }

    case "verification": {
      return {
        subject: "Verify your email for Story Pros",
        html: `
          <div style="${containerStyles}">
            <div style="${cardStyles}">
              <div style="${headerStyles}">
                <h1 style="margin: 0; font-size: 28px;">Verify Your Email</h1>
              </div>
              <div style="padding: 20px 0;">
                <p style="${baseStyles}">Hi ${data.name},</p>
                <p style="${baseStyles}">
                  Thank you for signing up! Please verify your email address to activate your account
                  and unlock all the benefits of Story Pros.
                </p>
                <p style="${baseStyles}">
                  <a href="${data.verification_link}" style="${buttonStyles}">Verify Email</a>
                </p>
                <p style="${baseStyles}">
                  Or copy and paste this link in your browser:
                </p>
                <p style="${baseStyles}; word-break: break-all; font-size: 12px;">
                  ${data.verification_link}
                </p>
                <p style="${baseStyles}">
                  This link expires in 24 hours.
                </p>
                <p style="${baseStyles}">
                  The Story Pros Team
                </p>
              </div>
              <div style="${footerStyles}">
                <p>You received this because you signed up for Story Pros.</p>
                <p><a href="#" style="color: ${brandColor}; text-decoration: none;">Unsubscribe</a></p>
              </div>
            </div>
          </div>
        `,
      };
    }

    case "weekly_digest": {
      return {
        subject: "Your Story Pros Weekly Digest",
        html: `
          <div style="${containerStyles}">
            <div style="${cardStyles}">
              <div style="${headerStyles}">
                <h1 style="margin: 0; font-size: 28px;">Your Weekly Digest</h1>
              </div>
              <div style="padding: 20px 0;">
                <p style="${baseStyles}">Hi ${data.name},</p>
                <p style="${baseStyles}">
                  Here's what's been happening in the Story Pros community this week!
                </p>
                <h3 style="${baseStyles}; color: ${brandColor};">Community Growth</h3>
                <p style="${baseStyles}">
                  <strong>${data.recent_signups || 0}</strong> new creators joined this week.
                  You're now at position <strong>#${data.user_position || 'TBD'}</strong> out of <strong>${data.total_users || 'TBD'}</strong> waitlist members!
                </p>
                <h3 style="${baseStyles}; color: ${brandColor};">Your Progress</h3>
                <p style="${baseStyles}">
                  You have <strong>${data.points || 0}</strong> points. Keep sharing your referral code
                  to climb higher and unlock exclusive tier rewards!
                </p>
                <a href="https://empowereddld.com/storypros/dashboard" style="${buttonStyles}">Check Your Dashboard</a>
                <p style="${baseStyles}">
                  The Story Pros Team
                </p>
              </div>
              <div style="${footerStyles}">
                <p>You received this as a subscriber to the Story Pros waitlist.</p>
                <p><a href="#" style="color: ${brandColor}; text-decoration: none;">Unsubscribe</a></p>
              </div>
            </div>
          </div>
        `,
      };
    }

    case "nudge": {
      return {
        subject: "You're so close to unlocking the next tier!",
        html: `
          <div style="${containerStyles}">
            <div style="${cardStyles}">
              <div style="${headerStyles}">
                <h1 style="margin: 0; font-size: 28px;">Keep the Momentum Going!</h1>
              </div>
              <div style="padding: 20px 0;">
                <p style="${baseStyles}">Hey ${data.name},</p>
                <p style="${baseStyles}">
                  You're incredibly close to unlocking the next tier! Just a few more referrals
                  and you'll claim exclusive rewards and move up the waitlist.
                </p>
                <p style="${baseStyles}">
                  <strong>Your Progress:</strong> ${data.progress_percentage || '0'}% to the next tier
                </p>
                <p style="${baseStyles}">
                  Share your referral code with 1-2 more friends and you'll unlock amazing benefits.
                  Your friends get early access, and you get exclusive rewards. Win-win!
                </p>
                <a href="https://empowereddld.com/storypros/dashboard?action=share" style="${buttonStyles}">Share Your Code</a>
                <p style="${baseStyles}">
                  The Story Pros Team
                </p>
              </div>
              <div style="${footerStyles}">
                <p>You received this to help you progress in the Story Pros waitlist.</p>
                <p><a href="#" style="color: ${brandColor}; text-decoration: none;">Unsubscribe</a></p>
              </div>
            </div>
          </div>
        `,
      };
    }

    case "announcement": {
      return {
        subject: data.subject || "Exciting News from Story Pros!",
        html: `
          <div style="${containerStyles}">
            <div style="${cardStyles}">
              <div style="${headerStyles}">
                <h1 style="margin: 0; font-size: 28px;">${data.title || 'Exciting News!'}</h1>
              </div>
              <div style="padding: 20px 0;">
                <p style="${baseStyles}">Hi ${data.name},</p>
                <div style="${baseStyles}">
                  ${data.content || 'We have exciting news to share with you!'}
                </div>
                ${
                  data.cta_text && data.cta_url
                    ? `<a href="${data.cta_url}" style="${buttonStyles}">${data.cta_text}</a>`
                    : ""
                }
                <p style="${baseStyles}">
                  The Story Pros Team
                </p>
              </div>
              <div style="${footerStyles}">
                <p>You received this announcement as a Story Pros waitlist member.</p>
                <p><a href="#" style="color: ${brandColor}; text-decoration: none;">Unsubscribe</a></p>
              </div>
            </div>
          </div>
        `,
      };
    }

    case "email2_points_tiers": {
      const referralLink = data.referral_link || `https://empowereddld.com/storypros?ref=${data.referral_code || ""}`;
      return {
        subject: "How to climb: your Story Pros points & tiers",
        html: `
          <div style="${containerStyles}">
            <div style="${cardStyles}">
              <div style="${headerStyles}">
                <h1 style="margin: 0; font-size: 28px;">How Points & Tiers Work</h1>
              </div>
              <div style="padding: 20px 0;">
                <p style="${baseStyles}">Hi ${data.name},</p>
                <p style="${baseStyles}">
                  Yesterday you joined Story Pros as a founding member. Today, here's exactly how to climb,
                  unlock rewards, and help shape the app we're building for kids who need extra support
                  with language and storytelling.
                </p>

                <p style="${baseStyles}">
                  In case you missed it, here's our welcome video: <a href="https://empowereddld.com/storypros" style="color: ${brandColor};">Watch it here</a>.
                  If it resonates, share it with one person who needs to see it.
                </p>

                <h2 style="${baseStyles}; color: ${brandColor}; font-size: 20px; margin-top: 28px;">Earn points</h2>
                <ul style="${baseStyles}">
                  <li><strong>+10</strong> for joining (already yours)</li>
                  <li><strong>+15</strong> when you confirm your email</li>
                  <li><strong>+10</strong> for completing your profile</li>
                  <li><strong>+8</strong> each for following us on Instagram, Facebook, and YouTube</li>
                  <li><strong>+25</strong> every time a friend joins through your link</li>
                  <li><strong>+50 bonus</strong> if a Speech-Language Pathologist joins through you</li>
                  <li><strong>+3</strong> per share, <strong>+1</strong> per click on your link</li>
                </ul>

                <h2 style="${baseStyles}; color: ${brandColor}; font-size: 20px; margin-top: 28px;">Unlock the 6 tiers</h2>
                <ul style="${baseStyles}">
                  <li><strong>Tier 1</strong> — Founding Member badge + name on the Early Supporters Wall</li>
                  <li><strong>Tier 2</strong> — Early Access on launch day, before the public</li>
                  <li><strong>Tier 3</strong> — 75 bonus Story Coins for in-app extras</li>
                  <li><strong>Tier 4</strong> — VIP Beta Access (test the app and shape it before launch)</li>
                  <li><strong>Tier 5</strong> — Founder Pricing locked at $5.99/mo for life (vs $7.99)</li>
                  <li><strong>Tier 6</strong> — Founding Elite: named in founder credits forever, signed Dan & Daria book, and DLD-themed merch (first 50 only)</li>
                </ul>

                <p style="${baseStyles}">
                  <strong>Your referral link:</strong><br/>
                  <a href="${referralLink}" style="color: ${brandColor}; word-break: break-all;">${referralLink}</a>
                </p>

                <p style="${baseStyles}">
                  The fastest way to climb is to share that welcome video with the link. People watch,
                  they get it, and they join.
                </p>

                <a href="https://empowereddld.com/storypros/dashboard" style="${buttonStyles}">View Your Progress</a>

                <p style="${baseStyles}">
                  Thank you for being here. Every share helps another family find Story Pros at launch.
                </p>
                <p style="${baseStyles}">
                  Warmly,<br/>
                  Camesha & Jinean<br/>
                  The Story Pros Team
                </p>
              </div>
              <div style="${footerStyles}">
                <p>You received this because you're a Story Pros founding member.</p>
                <p><a href="https://empowereddld.com/unsubscribe" style="color: ${brandColor}; text-decoration: none;">Unsubscribe</a></p>
              </div>
            </div>
          </div>
        `,
      };
    }

    default: {
      return {
        subject: "Story Pros",
        html: `
          <div style="${containerStyles}">
            <div style="${cardStyles}">
              <p style="${baseStyles}">Hello ${data.name || 'there'},</p>
              <p style="${baseStyles}">Thank you for being part of Story Pros!</p>
            </div>
          </div>
        `,
      };
    }
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: EmailData = await req.json();
    const { template, to, data } = payload;

    if (!template || !to) {
      return new Response(
        JSON.stringify({ error: "template and to are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get email content
    const { subject, html } = getEmailTemplate(template, data);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Send email via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Story Pros <hello@mail.empowereddld.com>",
        reply_to: "hello@empowereddld.com",
        to,
        subject,
        html,
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      console.error("Resend API error:", resendError);
      throw new Error(`Resend API failed: ${resendResponse.statusText}`);
    }

    const resendData: any = await resendResponse.json();
    const resendId = resendData.id;

    // Log email to database
    const { error: logError } = await supabase.from("waitlist_emails").insert({
      recipient_email: to,
      template,
      subject,
      resend_id: resendId,
      status: "sent",
    });

    if (logError) {
      console.error("Failed to log email:", logError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        resend_id: resendId,
        template,
        to,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to send email" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
