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
    referral_link?: string;
    verification_link?: string;
    video_link?: string;
    points_to_next?: number;
    founder_slot_number?: number;
    referral_count?: number;
    guide_download_url?: string;
    dashboard_url?: string;
    tier_name?: string;
    tier_reward?: string;
    recent_signups?: number;
    user_position?: number;
    total_users?: number;
    [key: string]: any;
  };
}

const SIGN_OFF = "Camesha, Jinean and The Story Pros Team";
const SITE_BASE = "https://empowereddld.com";
const DEFAULT_DASHBOARD = `${SITE_BASE}/storypros/dashboard`;
const DEFAULT_VIDEO = `https://youtu.be/S4ke41x89s0`;
const DEFAULT_GUIDE = `${SITE_BASE}/hub/resource/d9836a63-003e-44bc-9da4-a27d6d478d1a`;
const LOGO_URL = `${SITE_BASE}/email-assets/logo-storypros.png`;

function getEmailTemplate(
  template: string,
  data: EmailData["data"] = {},
  recipientEmail: string = ""
): { subject: string; html: string } {
  const brandColor = "#5B2D8E";
  const brandColorDeep = "#3F1B6B";
  const brandAccent = "#FBBF24";
  const lightBackground = "#F4EEFB";
  const cardBackground = "#FFFFFF";
  const textColor = "#2A2438";
  const mutedText = "#6B6478";

  const baseStyles = `
    font-family: 'Nunito', 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    line-height: 1.65;
    color: ${textColor};
    font-size: 15px;
    margin: 0 0 16px;
  `;

  // Legacy header (kept in case any non-tier template still references it)
  const headerStyles = `
    background: linear-gradient(135deg, ${brandColor} 0%, #7C3FB8 100%);
    color: white;
    padding: 36px 24px;
    text-align: center;
  `;

  const buttonStyles = `
    display: inline-block;
    background: ${brandColor};
    color: #ffffff !important;
    padding: 15px 34px;
    text-decoration: none;
    border-radius: 999px;
    font-weight: 700;
    margin: 22px 0;
    font-size: 15px;
    letter-spacing: 0.2px;
    box-shadow: 0 6px 14px rgba(91, 45, 142, 0.28);
  `;

  const secondaryButtonStyles = `
    display: inline-block;
    background: #FFFFFF;
    color: ${brandColor} !important;
    padding: 13px 28px;
    text-decoration: none;
    border-radius: 999px;
    font-weight: 700;
    margin: 8px 6px;
    font-size: 15px;
    letter-spacing: 0.2px;
    border: 2px solid ${brandColor};
  `;

  const primaryInlineButtonStyles = `
    display: inline-block;
    background: ${brandColor};
    color: #ffffff !important;
    padding: 13px 28px;
    text-decoration: none;
    border-radius: 999px;
    font-weight: 700;
    margin: 8px 6px;
    font-size: 15px;
    letter-spacing: 0.2px;
    box-shadow: 0 6px 14px rgba(91, 45, 142, 0.28);
  `;

  const footerStyles = `
    text-align: center;
    color: ${mutedText};
    font-size: 12px;
    margin-top: 8px;
    padding: 24px 28px 32px;
    background: #FAF7FE;
    border-top: 1px solid #EFE6FA;
  `;

  const containerStyles = `
    max-width: 620px;
    margin: 0 auto;
    background: ${lightBackground};
    padding: 28px 16px;
  `;

  // White card now wraps logo strip + hero + body + footer with no inner padding.
  const cardStyles = `
    background: ${cardBackground};
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 12px 32px rgba(91, 45, 142, 0.14);
  `;

  // Padding for the body content area (between hero and footer)
  const bodyPad = `padding: 32px 36px 8px;`;

  const scriptBlock = `
    background: #F8F3FE;
    border: 1px solid #ECE0FA;
    padding: 16px 20px;
    margin: 14px 0;
    color: #3F1B6B;
    border-radius: 10px;
    font-size: 14.5px;
    line-height: 1.6;
  `;

  const dividerStyles = `border: none; border-top: 1px solid #EFE6FA; margin: 30px 0;`;

  const tierLine = (label: string, reward: string, isCurrent = false) =>
    `<li style="margin-bottom: 8px;"><strong>${label}</strong> — ${reward}${isCurrent ? " <span style=\"color: " + brandColor + "; font-weight: 700;\">(you are here)</span>" : ""}</li>`;

  const ctaPair = (referralLink: string, dashboard: string) => `
    <div style="text-align: center; margin: 28px 0 8px;">
      <a href="${referralLink}" style="${primaryInlineButtonStyles}">Share your link</a>
      <a href="${dashboard}" style="${secondaryButtonStyles}">See your dashboard</a>
    </div>
  `;

  // Logo strip + purple hero band. Used by all 6 tier-celebration emails.
  const tierHero = (tierLabel: string, subhead: string) => `
    <div style="background: #FFFFFF; padding: 22px 24px 18px; text-align: center; border-bottom: 1px solid #F1E8FB;">
      <img src="${LOGO_URL}" alt="Story Pros" width="160" style="display: inline-block; max-width: 160px; height: auto; border: 0;" />
    </div>
    <div style="background: linear-gradient(135deg, ${brandColorDeep} 0%, ${brandColor} 55%, #7C3FB8 100%); color: #ffffff; padding: 38px 28px; text-align: center;">
      <div style="display: inline-block; background: rgba(251, 191, 36, 0.18); color: ${brandAccent}; font-size: 12px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; padding: 6px 14px; border-radius: 999px; margin-bottom: 14px;">You unlocked a new tier</div>
      <h1 style="margin: 0; font-size: 30px; font-weight: 800; line-height: 1.2; color: #ffffff;">${tierLabel}</h1>
      <p style="margin: 10px 0 0; font-size: 15px; line-height: 1.5; color: #F4EEFB; opacity: 0.95;">${subhead}</p>
    </div>
  `;

  const unsubscribeUrl = recipientEmail
    ? `${SITE_BASE}/unsubscribe?email=${encodeURIComponent(recipientEmail)}`
    : `${SITE_BASE}/unsubscribe`;
  const footerBlock = `
    <div style="${footerStyles}">
      <img src="${LOGO_URL}" alt="Story Pros" width="96" style="display: inline-block; max-width: 96px; height: auto; opacity: 0.9; margin-bottom: 12px; border: 0;" />
      <p style="margin: 0 0 10px; color: ${mutedText};"><em>P.S. If this email landed in your Promotions or Updates tab, drag it over to your Primary inbox so you don't miss the next one. It really helps.</em></p>
      <p style="margin: 12px 0 6px;">You're receiving this as a Story Pros founding member.</p>
      <p style="margin: 0;"><a href="${unsubscribeUrl}" style="color: ${brandColor}; text-decoration: none;">Unsubscribe</a></p>
    </div>
  `;

  const name = data.name || "there";
  const referralLink =
    data.referral_link ||
    (data.referral_code ? `${SITE_BASE}/storypros?ref=${data.referral_code}` : `${SITE_BASE}/storypros`);
  const dashboard = data.dashboard_url || DEFAULT_DASHBOARD;
  const videoLink = data.video_link || DEFAULT_VIDEO;
  const pointsToNext = data.points_to_next ?? 0;
  const guideUrl = data.guide_download_url || DEFAULT_GUIDE;

  switch (template) {
    // ============================================================
    // EMAIL 1 — Welcome (immediate on signup)
    // ============================================================
    case "welcome": {
      // Plain-text-feeling layout: no banner, no card, no styled buttons,
      // no script boxes. Just simple paragraphs and inline links so Gmail
      // is more likely to deliver this to Primary instead of Promotions.
      const plainContainer = `
        max-width: 580px;
        margin: 0 auto;
        padding: 24px 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        font-size: 15px;
        line-height: 1.55;
        color: #222;
        background: #ffffff;
      `;
      const plainP = `margin: 0 0 14px;`;
      const plainLink = `color: ${brandColor}; text-decoration: underline;`;
      const plainFooter = `margin-top: 28px; font-size: 12px; color: #888;`;

      return {
        subject: `You're in, ${name}`,
        html: `
          <div style="${plainContainer}">
            <p style="${plainP}">Hi ${name},</p>

            <p style="${plainP}">You're in. Welcome to Story Pros as one of our founding members.</p>

            <p style="${plainP}">Story Pros is an interactive storytelling app designed for children ages 5 to 12 with Developmental Language Disorder and other communication challenges. It helps children understand stories, retell them in their own words, organize their thoughts, and build the language skills they need to express themselves clearly and confidently, step by step, with structured support.</p>

            <p style="${plainP}">If you'd like a quick intro, here's our welcome video: <a href="${videoLink}" style="${plainLink}">${videoLink}</a></p>

            <p style="${plainP}"><strong>What you just joined</strong></p>

            <ul style="${plainP}; padding-left: 20px; margin: 0 0 16px;">
              <li style="margin-bottom: 8px;"><strong>The app waitlist.</strong> A structured, playful tool your child can use at home to build storytelling and narrative language skills, step by step.</li>
              <li style="margin-bottom: 8px;"><strong>Monthly Live Community Circles.</strong> Once a month, we host a live Zoom gathering for Story Pros kids, facilitated by us (Camesha, an elementary school teacher, and Jinean, a speech-language pathologist). So many children who struggle with language also struggle with feeling like they're the only one. They're not. And this is where they get to see that for themselves.</li>
            </ul>

            <p style="${plainP}">Your Story Pros membership includes both. App access and live Zoom community. All for $9.99/month.</p>

            <p style="${plainP}"><strong>You're not just on a waitlist.</strong></p>

            <p style="${plainP}">You're part of the group helping bring Story Pros to life. The more people who join through you, the more you unlock: early access at launch, bonus Coins, a signed Dan & Daria book, founder pricing, and DLD-themed merch.</p>

            <p style="${plainP}">Your referral link:<br/><a href="${referralLink}" style="${plainLink}; word-break: break-all;">${referralLink}</a></p>

            <p style="${plainP}">Every person who joins through your link moves you forward, unlocks rewards, and helps more families find Story Pros when we launch.</p>

            <p style="${plainP}"><strong>Not sure what to say? Try one of these:</strong></p>

            <p style="${plainP}">"Hey, I'm on the early list for Story Pros. It's an app and monthly community for kids who need extra support with storytelling and language. Built by speech-language pathologists and teachers. Thought of you: ${referralLink}"</p>

            <p style="${plainP}">"I found something I think you'll want to see. It's called Story Pros, a membership that gives kids structured storytelling practice plus a monthly live gathering with other families. I'm in and would love for you to join me: ${referralLink}"</p>

            <p style="${plainP}">In a couple of hours, we'll send you the full breakdown of how points and tiers work so you know exactly how to climb.</p>

            <p style="${plainP}">We're so glad you're here.</p>

            <p style="${plainP}">Warmly,<br/>${SIGN_OFF}</p>

            <p style="${plainP}; margin-top: 28px;"><em>P.S. If this email landed in your Promotions or Updates tab, drag it over to your Primary inbox so you don't miss the next one. It really helps.</em></p>

            <div style="${plainFooter}">
              <p style="margin: 0 0 6px;">You're receiving this because you joined the Story Pros waitlist.</p>
              <p style="margin: 0;"><a href="${unsubscribeUrl}" style="color: #888; text-decoration: underline;">Unsubscribe</a></p>
            </div>
          </div>
        `,
      };
    }

    // ============================================================
    // EMAIL 2 — How Points Work (24h after signup)
    // ============================================================
    case "email2_points_tiers": {
      const verifyLink = data.verification_link || dashboard;
      const plainContainer = `
        max-width: 580px;
        margin: 0 auto;
        padding: 24px 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        font-size: 15px;
        line-height: 1.55;
        color: #222;
        background: #ffffff;
      `;
      const plainP = `margin: 0 0 14px;`;
      const plainLink = `color: ${brandColor}; text-decoration: underline;`;
      const plainFooter = `margin-top: 28px; font-size: 12px; color: #888;`;

      return {
        subject: `Welcome back, ${name}. Here's how Story Pros points work.`,
        html: `
          <div style="${plainContainer}">
            <p style="${plainP}">Hi ${name},</p>

            <p style="${plainP}">Yesterday you joined the Story Pros community. Welcome back.</p>

            <p style="${plainP}">Before we get into the points breakdown, a quick reminder of what your Story Pros membership includes: full app access for your child plus Monthly Live Community Circles on Zoom, where kids get to see they're not the only one, facilitated by us. The app builds the skills. The community builds the belonging. Both are included at $9.99/month.</p>

            <p style="${plainP}">Now, here's how the points and tiers work, and the easiest moves you can make right now.</p>

            <p style="${plainP}">You already have <strong>10 points</strong> for signing up. Verifying your email adds another <strong>15</strong> if you haven't yet:</p>

            <p style="${plainP}"><a href="${verifyLink}" style="${plainLink}">Verify my email (+15 points)</a></p>

            <p style="${plainP}"><strong>How you earn points</strong></p>

            <p style="${plainP}">One-time actions:</p>
            <ul style="${plainP}; padding-left: 20px;">
              <li>Sign up: +10 (already yours)</li>
              <li>Verify your email: +15</li>
              <li>Complete your profile: +10</li>
              <li>Follow us on Instagram: +8</li>
              <li>Follow us on Facebook: +8</li>
              <li>Subscribe on YouTube: +8</li>
              <li>First share bonus: +5</li>
              <li>First referral bonus: +10</li>
            </ul>

            <p style="${plainP}">Repeatable actions:</p>
            <ul style="${plainP}; padding-left: 20px;">
              <li>Refer a friend (they sign up): +25 each</li>
              <li>Refer a Speech-Language Professional: +50 each</li>
              <li>Share your link: +1 per share (max 5/day)</li>
              <li>Someone taps your link: +3 per tap (max 15/day)</li>
            </ul>

            <p style="${plainP}">The one-timers are your fastest early wins. The repeatables are how you climb to the top tiers.</p>

            <p style="${plainP}"><strong>What you unlock</strong></p>

            <ul style="${plainP}; padding-left: 20px;">
              <li><strong>Tier 1 (0 pts):</strong> Development Updates plus your name on the Early Supporters Wall as a founding member</li>
              <li><strong>Tier 2 (35 pts):</strong> Our paid digital guide "Executive Function Skills for Your Child", free as a thank you</li>
              <li><strong>Tier 3 (75 pts):</strong> Bonus Story Coins to spend inside the app at launch</li>
              <li><strong>Tier 4 (130 pts):</strong> VIP Beta Access. Test Story Pros before launch and help shape the final product.</li>
              <li><strong>Tier 5 (250 pts):</strong> Founder Pricing locked in for life: $7.99/month instead of $9.99. Heads up, points double from here on to help you push toward Tier 6.</li>
              <li><strong>Tier 6 (500 pts):</strong> A signed Dan & Daria book plus DLD-themed merch. Limited to the first 50 members to reach Tier 6. After those 50 slots are claimed, Tier 6 still unlocks 100 Story Coins to spend at launch.</li>
            </ul>

            <p style="${plainP}"><strong>Quickest ways to move forward</strong></p>

            <ul style="${plainP}; padding-left: 20px;">
              <li>Complete your profile (+10 pts, takes 30 seconds)</li>
              <li>Follow us on Instagram, Facebook, or YouTube (+8 pts each)</li>
              <li>Share your referral link (+25 pts every time someone joins, plus a +10 bonus on your first referral)</li>
            </ul>

            <p style="${plainP}">Your referral link:<br/><a href="${referralLink}" style="${plainLink}; word-break: break-all;">${referralLink}</a></p>

            <p style="${plainP}">Or jump straight to your dashboard: <a href="${dashboard}" style="${plainLink}">${dashboard}</a></p>

            <p style="${plainP}"><strong>Two scripts, if you'd like something to paste</strong></p>

            <p style="${plainP}">For a friend or family member:</p>
            <p style="${plainP}">"Hey! Found a new app and community I think you'd want to know about. Story Pros helps kids retell stories, put their thoughts in order, and find the right words, plus there's a monthly live group for kids on Zoom. I just joined: ${referralLink}"</p>

            <p style="${plainP}">For a teacher or therapist:</p>
            <p style="${plainP}">"I came across something called Story Pros. It's an app and monthly community built by speech-language pathologists and teachers that helps kids with storytelling and narrative language. Thought you'd want a look: ${referralLink}"</p>

            <p style="${plainP}">Talk soon,<br/>${SIGN_OFF}</p>

            <p style="${plainP}; margin-top: 28px;"><em>P.S. If this email landed in your Promotions or Updates tab, drag it over to your Primary inbox so you don't miss the next one. It really helps.</em></p>

            <div style="${plainFooter}">
              <p style="margin: 0 0 6px;">You're receiving this as a Story Pros founding member.</p>
              <p style="margin: 0;"><a href="${unsubscribeUrl}" style="color: #888; text-decoration: underline;">Unsubscribe</a></p>
            </div>
          </div>
        `,
      };
    }

    // ============================================================
    // EMAIL 3 — Tier 2 Reached (35 pts)
    // ============================================================
    case "email3_tier2": {
      return {
        subject: `Your free guide is ready, ${name}`,
        html: `
          <div style="${containerStyles}">
            <div style="${cardStyles}">
              ${tierHero("Tier 2 Unlocked", "Your free guide is ready.")}

              <div style="${bodyPad}">
                <p style="${baseStyles}">Hi ${name},</p>

                <p style="${baseStyles}">
                  You did it. You just crossed <strong>35 points</strong> and unlocked <strong>Tier 2</strong>.
                </p>

                <p style="${baseStyles}">
                  As a thank you, the <strong>"Executive Function Skills for Your Child"</strong> guide is
                  yours, on us. It's normally a paid product in our resource library, but at Tier 2 it's free.
                </p>

                <div style="text-align: center;">
                  <a href="${guideUrl}" style="${buttonStyles}">Download your guide</a>
                </div>

                <p style="${baseStyles}">
                  Inside you'll find practical strategies to help your child plan, focus, remember instructions,
                  and manage big feelings, the kind of skills that support storytelling, schoolwork, and
                  everyday life.
                </p>

                <hr style="${dividerStyles}" />

                <p style="${baseStyles}"><strong>What's next: Tier 3 (75 pts), 50 Story Coins</strong></p>

                <p style="${baseStyles}">
                  Story Coins are yours to spend inside the Story Pros app at launch on themes, characters,
                  and extras.
                </p>

                <p style="${baseStyles}">
                  You're <strong>${pointsToNext} points away</strong>. The fastest way there is referrals.
                  Every new person you bring in gets you 25 points.
                </p>

                <p style="${baseStyles}">
                  <strong>Your referral link:</strong><br/>
                  <a href="${referralLink}" style="color: ${brandColor}; word-break: break-all;">${referralLink}</a>
                </p>

                <p style="${baseStyles}"><strong>A few messages to copy and paste if you'd like:</strong></p>

                <div style="${scriptBlock}">
                  I'm on the early list for an app called Story Pros. It helps kids build the skills they
                  need to tell stories and express what's on their mind, plus there's a monthly live community
                  for families on Zoom. Worth a look: ${referralLink}
                </div>

                <div style="${scriptBlock}">
                  Hey! Found a new app and community I think you'd want to know about. Story Pros helps
                  kids retell stories, put their thoughts in order, and find the right words, plus there's
                  a monthly live group for kids on Zoom. I just joined: ${referralLink}
                </div>

                <p style="${baseStyles}; margin-bottom: 4px;"><strong>For a teacher or therapist:</strong></p>
                <div style="${scriptBlock}">
                  I came across something called Story Pros. It's an app and monthly community built by
                  speech-language pathologists and teachers that helps kids with storytelling and narrative
                  language. Thought you'd want a look: ${referralLink}
                </div>

                ${ctaPair(referralLink, dashboard)}

                <p style="${baseStyles}">Talk soon,<br/>${SIGN_OFF}</p>
              </div>

              ${footerBlock}
            </div>
          </div>
        `,
      };
    }

    // ============================================================
    // EMAIL 4 — Tier 3 Reached (75 pts)
    // ============================================================
    case "email4_tier3": {
      return {
        subject: `You just earned 50 Story Coins, ${name}`,
        html: `
          <div style="${containerStyles}">
            <div style="${cardStyles}">
              ${tierHero("Tier 3 Unlocked", "50 Story Coins are yours.")}

              <div style="${bodyPad}">
                <p style="${baseStyles}">Hi ${name},</p>

                <p style="${baseStyles}">
                  You did it. You just hit <strong>75 points</strong> and crossed into <strong>Tier 3</strong>.
                </p>

                <p style="${baseStyles}">Here's what that means:</p>

                <p style="${baseStyles}">
                  <strong>50 Story Coins are yours.</strong> They'll land in your account the moment Story
                  Pros launches, ready to spend on stories, characters, and extras inside the app.
                </p>

                <hr style="${dividerStyles}" />

                <p style="${baseStyles}"><strong>What's next: Tier 4 (130 pts), VIP Beta Access + Suggestion Board</strong></p>

                <p style="${baseStyles}">
                  At Tier 4, you'll be one of the first families inside Story Pros before it launches.
                  You'll test the app, use it with your child, and help shape the final product with real
                  feedback. You'll also unlock the Suggestion Board, where you can weigh in on what we
                  build next, both in the app and in our Monthly Live Community Circles.
                </p>

                <p style="${baseStyles}">You're <strong>${pointsToNext} points away</strong>.</p>

                <p style="${baseStyles}">
                  <strong>Your referral link:</strong><br/>
                  <a href="${referralLink}" style="color: ${brandColor}; word-break: break-all;">${referralLink}</a>
                </p>

                <p style="${baseStyles}"><strong>A message to copy and paste if you'd like:</strong></p>

                <div style="${scriptBlock}">
                  Hey!! Wanted to send you this. Story Pros is a new app and community built by
                  speech-language pathologists and teachers to help kids with storytelling and language
                  skills. I've been sharing it with people I care about: ${referralLink}
                </div>

                ${ctaPair(referralLink, dashboard)}

                <p style="${baseStyles}">Talk soon,<br/>${SIGN_OFF}</p>
              </div>

              ${footerBlock}
            </div>
          </div>
        `,
      };
    }

    // ============================================================
    // EMAIL 5 — Tier 4 Reached (130 pts)
    // ============================================================
    case "email5_tier4": {
      return {
        subject: `You get to test Story Pros before it launches, ${name}`,
        html: `
          <div style="${containerStyles}">
            <div style="${cardStyles}">
              ${tierHero("Tier 4 Unlocked", "VIP Beta Access is yours.")}

              <div style="${bodyPad}">
                <p style="${baseStyles}">Hi ${name},</p>

                <p style="${baseStyles}">This is a big one.</p>

                <p style="${baseStyles}">
                  You just crossed <strong>130 points</strong> and hit <strong>Tier 4</strong>, which means
                  you'll be one of the first families to try Story Pros before it opens to the public.
                </p>

                <p style="${baseStyles}">
                  You'll get to test the app, use it with your kids, and tell us what's working and what
                  isn't so we can shape the final version around real feedback from people who actually get it.
                </p>

                <p style="${baseStyles}">
                  <strong>You've also unlocked the Suggestion Board.</strong> This is where families who
                  are testing the app weigh in on what we build next, both in the app and in our Monthly
                  Live Community Circles. Your ideas help guide what we create, and your voice carries
                  real weight here.
                </p>

                <hr style="${dividerStyles}" />

                <p style="${baseStyles}"><strong>Here's everything you've unlocked so far:</strong></p>
                <ul style="${baseStyles}">
                  ${tierLine("Tier 1", "Development Updates + Early Supporters Wall")}
                  ${tierLine("Tier 2", "Free Executive Function guide")}
                  ${tierLine("Tier 3", "50 Bonus Story Coins")}
                  ${tierLine("Tier 4", "Early testing access + Suggestion Board", true)}
                </ul>

                <hr style="${dividerStyles}" />

                <p style="${baseStyles}"><strong>What's next: Tier 5 (250 pts), Founder Pricing</strong></p>

                <p style="${baseStyles}">
                  At 250 points, you lock in <strong>$7.99/month for life</strong> instead of the regular
                  $9.99. That's the lowest price Story Pros will ever be offered at, and it's yours to
                  keep as long as you stay subscribed. Heads up, points double from Tier 5 on to help
                  you push toward Tier 6.
                </p>

                <p style="${baseStyles}">You're <strong>${pointsToNext} points away</strong>.</p>

                <p style="${baseStyles}">
                  <strong>Your referral link:</strong><br/>
                  <a href="${referralLink}" style="color: ${brandColor}; word-break: break-all;">${referralLink}</a>
                </p>

                <p style="${baseStyles}"><strong>A message to copy and paste if you'd like:</strong></p>

                <div style="${scriptBlock}">
                  Hey, check this out. Story Pros is an app and monthly community that helps kids who
                  need extra support with storytelling and putting their thoughts into words. Built by
                  speech-language pathologists and teachers. You can get in early: ${referralLink}
                </div>

                ${ctaPair(referralLink, dashboard)}

                <p style="${baseStyles}">Talk soon,<br/>${SIGN_OFF}</p>
              </div>

              ${footerBlock}
            </div>
          </div>
        `,
      };
    }

    // ============================================================
    // EMAIL 6 — Tier 5 Reached (250 pts)
    // ============================================================
    case "email6_tier5": {
      return {
        subject: `You just hit Tier 5, ${name}.`,
        html: `
          <div style="${containerStyles}">
            <div style="${cardStyles}">
              ${tierHero("Tier 5 Unlocked", "Founder Pricing is locked in. For life.")}

              <div style="${bodyPad}">
                <p style="${baseStyles}">Hi ${name},</p>

                <p style="${baseStyles}">
                  You've done something most people don't. You didn't just sign up. You kept showing up,
                  kept sharing, kept going. That means everything to us.
                </p>

                <p style="${baseStyles}">
                  <strong>250 points.</strong> You're at <strong>Tier 5</strong>.
                </p>

                <p style="${baseStyles}">
                  <strong>Founder Pricing, locked in for life.</strong> Your subscription will be
                  <strong>$7.99/month forever</strong>, instead of the regular $9.99. That price stays
                  no matter how much we add to the app, the Community Circles, or any other features
                  down the road.
                </p>

                <p style="${baseStyles}">
                  <strong>Your points now count double.</strong> Every share, every referral, every follow.
                  Tier 6 is closer than it looks.
                </p>

                <hr style="${dividerStyles}" />

                <p style="${baseStyles}"><strong>Here's everything you've unlocked so far:</strong></p>
                <ul style="${baseStyles}">
                  ${tierLine("Tier 1", "Development Updates + Early Supporters Wall")}
                  ${tierLine("Tier 2", "Free Executive Function guide")}
                  ${tierLine("Tier 3", "50 Bonus Story Coins")}
                  ${tierLine("Tier 4", "Early testing access + Suggestion Board")}
                  ${tierLine("Tier 5", "Founder Pricing, locked for life + double points", true)}
                </ul>

                <hr style="${dividerStyles}" />

                <p style="${baseStyles}"><strong>One tier left: Tier 6 (500 pts)</strong></p>

                <p style="${baseStyles}">
                  A signed <strong>Dan & Daria book</strong> plus <strong>DLD-themed merch</strong>,
                  limited to the first 50 members to reach Tier 6. After those 50 slots are claimed,
                  Tier 6 still unlocks <strong>100 Story Coins</strong> to spend at launch.
                </p>

                <p style="${baseStyles}">
                  You're <strong>${pointsToNext} points</strong> away. Everything counts double now.
                </p>

                <p style="${baseStyles}">
                  <strong>Your referral link:</strong><br/>
                  <a href="${referralLink}" style="color: ${brandColor}; word-break: break-all;">${referralLink}</a>
                </p>

                <p style="${baseStyles}"><strong>A few messages to copy and paste if you'd like:</strong></p>

                <div style="${scriptBlock}">
                  I'm on the early list for an app called Story Pros. It helps kids build the skills they
                  need to tell stories and express what's on their mind, plus there's a monthly live community
                  for families on Zoom. Worth a look: ${referralLink}
                </div>

                <div style="${scriptBlock}">
                  Ok I have to share this with you. There's an app coming out that helps kids who have
                  a hard time explaining things or getting their words out. Speech-language pathologists
                  and teachers built it. Get in early with me: ${referralLink}
                </div>

                <div style="${scriptBlock}">
                  Have you heard of Story Pros? It's an app and monthly community built by speech-language
                  pathologists and teachers that helps kids with narrative language. They're giving early
                  access right now: ${referralLink}
                </div>

                ${ctaPair(referralLink, dashboard)}

                <p style="${baseStyles}">
                  Thank you for helping more children not just communicate... but connect.
                </p>

                <p style="${baseStyles}">${SIGN_OFF}</p>
              </div>

              ${footerBlock}
            </div>
          </div>
        `,
      };
    }

    // ============================================================
    // EMAIL 7 — Tier 6 Reached (Founder, first 50)
    // ============================================================
    case "email7_tier6_founder": {
      const slot = data.founder_slot_number ?? 1;
      const claimUrl = data.claim_url || `${SITE_BASE}/storypros/claim-founder`;
      return {
        subject: `You did it, ${name}. You're a Story Pros Founder.`,
        html: `
          <div style="${containerStyles}">
            <div style="${cardStyles}">
              ${tierHero("Tier 6 Unlocked", "Signed book and Founder merch headed your way.")}

              <div style="${bodyPad}">
                <p style="${baseStyles}">Hi ${name},</p>

                <p style="${baseStyles}"><strong>500 points. Tier 6. The final one.</strong></p>

                <p style="${baseStyles}">You're <strong>Founder #${slot} of 50</strong>.</p>

                <p style="${baseStyles}">
                  Every person you brought in is a family whose child will have access to something that
                  helps them put their thoughts into words and share their world. That's what your 500
                  points actually represent. Not numbers. Real kids. And you made that happen.
                </p>

                <p style="${baseStyles}"><strong>Here's what you've unlocked:</strong></p>

                <p style="${baseStyles}">
                  <strong>A signed Dan & Daria book.</strong> Personally signed, with a handwritten note
                  from us. This is the book that started everything for the kids and families we built
                  Story Pros for.
                </p>

                <p style="${baseStyles}">
                  <strong>DLD-themed Founder merch.</strong> A limited bundle made for the people who
                  helped us get this off the ground. You won't find it anywhere else.
                </p>

                <p style="${baseStyles}">
                  <strong>Founder status, locked for life.</strong> Your $7.99/month pricing stays forever.
                  Your name stays on the Early Supporters Wall. And you'll always be one of the first 50
                  people who made Story Pros real.
                </p>

                <hr style="${dividerStyles}" />

                <p style="${baseStyles}"><strong>Here's everything you've unlocked across your entire journey:</strong></p>
                <ul style="${baseStyles}">
                  ${tierLine("Tier 1", "Development Updates + Early Supporters Wall")}
                  ${tierLine("Tier 2", "Free Executive Function guide")}
                  ${tierLine("Tier 3", "50 Bonus Story Coins")}
                  ${tierLine("Tier 4", "Early testing access + Suggestion Board")}
                  ${tierLine("Tier 5", "Founder Pricing + double points")}
                  ${tierLine("Tier 6", "Signed Dan & Daria book + DLD-themed Founder merch", true)}
                </ul>

                <hr style="${dividerStyles}" />

                <div style="text-align: center;">
                  <a href="${claimUrl}" style="${buttonStyles}">Claim my Founder package</a>
                </div>

                <p style="${baseStyles}">
                  Tell us where to ship your signed book and merch, and how you'd like it inscribed. Takes
                  about 60 seconds. Once all 50 Founder slots are claimed, we ship everything together.
                </p>

                <p style="${baseStyles}">
                  Your link still works. And every person you bring in is still another child who gets
                  closer to being part of a community where they're not the only one.
                </p>

                <div style="text-align: center;">
                  <a href="${referralLink}" style="${primaryInlineButtonStyles}">Share Story Pros</a>
                </div>

                <p style="${baseStyles}">From the bottom of our hearts, thank you.</p>

                <p style="${baseStyles}">${SIGN_OFF}</p>
              </div>

              ${footerBlock}
            </div>
          </div>
        `,
      };
    }

    // ============================================================
    // EMAIL 7B — Tier 6 Reached (Legend, after 50 Founder slots claimed)
    // ============================================================
    case "email7b_tier6_legend": {
      const referralCount = data.referral_count ?? 0;
      return {
        subject: `You went all the way, ${name}.`,
        html: `
          <div style="${containerStyles}">
            <div style="${cardStyles}">
              ${tierHero("Tier 6 Unlocked", "500 points. Here's everything you've earned.")}

              <div style="${bodyPad}">
                <p style="${baseStyles}">Hi ${name},</p>

                <p style="${baseStyles}"><strong>500 points. Tier 6. The final one.</strong></p>

                <p style="${baseStyles}">
                  The 50 Founder slots are claimed, but reaching 500 points is its own achievement, and
                  it comes with real rewards. You earned every one of these.
                </p>

                <p style="${baseStyles}">You're officially a <strong>Story Pros Legend</strong>.</p>

                <hr style="${dividerStyles}" />

                <p style="${baseStyles}"><strong>Here's everything that's yours:</strong></p>

                <p style="${baseStyles}">
                  <strong>150 Story Coins total.</strong> 50 from Tier 3 plus 100 as a Legend bonus, all
                  ready to spend on premium content the moment the app launches.
                </p>

                <p style="${baseStyles}">
                  <strong>Founder Pricing, locked for life.</strong> $7.99/month, forever. It never goes
                  up, no matter how much we add to the app, the Community Circles, or any other features
                  down the road.
                </p>

                <p style="${baseStyles}">
                  <strong>Early testing access.</strong> You're in the app before the general public. No
                  waitlist. No delay.
                </p>

                <p style="${baseStyles}">
                  <strong>Legend badge, permanent.</strong> A distinct badge on your profile and the Early
                  Supporters Wall. Anyone who visits will see you went all the way.
                </p>

                <p style="${baseStyles}">
                  <strong>First in line for future merch drops.</strong> Whenever we release new Story
                  Pros gear, Legends get access before anyone else.
                </p>

                <p style="${baseStyles}">
                  <strong>A personal thank-you note.</strong> Signed by both of us, sent the week of launch.
                </p>

                <hr style="${dividerStyles}" />

                <p style="${baseStyles}"><strong>Here's everything you've unlocked across your entire journey:</strong></p>
                <ul style="${baseStyles}">
                  ${tierLine("Tier 1", "Development Updates + Early Supporters Wall")}
                  ${tierLine("Tier 2", "Free Executive Function guide")}
                  ${tierLine("Tier 3", "50 Story Coins")}
                  ${tierLine("Tier 4", "Early testing access + Suggestion Board")}
                  ${tierLine("Tier 5", "Founder Pricing + double points")}
                  ${tierLine("Tier 6", "Legend status + 100 bonus Story Coins + Legend badge", true)}
                </ul>

                <p style="${baseStyles}">
                  You brought <strong>${referralCount} families</strong> into this. That's ${referralCount}
                  children who will have access to a tool that helps them share more of their world, and
                  a community where they get to see they're not the only one.
                </p>

                <div style="text-align: center;">
                  <a href="${dashboard}" style="${buttonStyles}">See your dashboard</a>
                </div>

                <p style="${baseStyles}">
                  Your link still works. And every share still means another child who gets the support
                  they need to not just communicate... but connect.
                </p>

                <div style="text-align: center;">
                  <a href="${referralLink}" style="${primaryInlineButtonStyles}">Share Story Pros</a>
                </div>

                <p style="${baseStyles}">Thank you for going all the way.</p>

                <p style="${baseStyles}">${SIGN_OFF}</p>
              </div>

              ${footerBlock}
            </div>
          </div>
        `,
      };
    }

    // ============================================================
    // AUXILIARY TEMPLATES (unchanged from previous version)
    // ============================================================
    case "referral_joined": {
      // Plain-text-first to land in Primary, not Promotions.
      const plainP = `margin: 0 0 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.55; color: #222;`;
      const plainLink = `color: #6a47b8; text-decoration: underline;`;
      return {
        subject: `🎉 ${data.name} just joined using your link`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px 20px; color: #222;">
            <p style="${plainP}">Hey ${name || "there"},</p>
            <p style="${plainP}">
              Quick celebration: <strong>${data.name}</strong> just joined the Story Pros founding waitlist using your link.
            </p>
            <p style="${plainP}">
              You earned <strong>+25 points</strong>${data.points ? ` (you're now at <strong>${data.points}</strong> total)` : ""}. Every referral moves you closer to founder pricing and the bigger rewards.
            </p>
            <p style="${plainP}">
              See your updated dashboard: <a href="${dashboard}" style="${plainLink}">${dashboard}</a>
            </p>
            <p style="${plainP}">${SIGN_OFF}</p>
            <p style="${plainP}; font-size: 13px; color: #666;">
              P.S. If this email landed in Promotions or Spam, drag it to Primary so you don't miss the next tier-up.
            </p>
            ${footerBlock}
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
                </p>
                <p style="${baseStyles}">
                  <strong>Reward:</strong> ${data.tier_reward || "Coming soon!"}
                </p>
                <a href="${dashboard}" style="${buttonStyles}">View Your Rewards</a>
                <p style="${baseStyles}">${SIGN_OFF}</p>
              </div>
              ${footerBlock}
            </div>
          </div>
        `,
      };
    }

    // ============================================================
    // VERIFICATION EMAIL — sent immediately on signup (locked copy)
    // ============================================================
    case "verification": {
      const plainContainer = `max-width: 580px; margin: 0 auto; padding: 24px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.55; color: #222; background: #ffffff;`;
      const plainP = `margin: 0 0 14px;`;
      const plainLink = `color: ${brandColor}; text-decoration: underline;`;
      return {
        subject: `Verify your email to get started, ${name}`,
        html: `
          <div style="${plainContainer}">
            <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">One tap and your first 15 points are yours.</div>
            <p style="${plainP}">Hi ${name},</p>
            <p style="${plainP}">Thanks for signing up for Story Pros!</p>
            <p style="${plainP}">One quick step: tap the button below to verify your email and unlock your first 15 points.</p>
            <p style="${plainP}"><a href="${data.verification_link}" style="${plainLink}">Verify my email (+15 points)</a></p>
            <p style="${plainP}">Once you do, we'll send your full welcome with your referral link, your tier roadmap, and a video from our founders.</p>
            <p style="${plainP}">Warmly,<br/>Camesha, Jinean and The Story Pros Team</p>
          </div>
        `,
      };
    }

    // 24h reminder — locked copy
    case "verification_reminder_1": {
      const plainContainer = `max-width: 580px; margin: 0 auto; padding: 24px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.55; color: #222; background: #ffffff;`;
      const plainP = `margin: 0 0 14px;`;
      const plainLink = `color: ${brandColor}; text-decoration: underline;`;
      return {
        subject: `Still need to verify, ${name}`,
        html: `
          <div style="${plainContainer}">
            <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">Your 15 points are waiting.</div>
            <p style="${plainP}">Hi ${name},</p>
            <p style="${plainP}">Just a quick reminder to verify your email so we can send you everything you need to get started with Story Pros, including your referral link, your welcome video, and your first 15 points.</p>
            <p style="${plainP}"><a href="${data.verification_link}" style="${plainLink}">Verify my email (+15 points)</a></p>
            <p style="${plainP}">Camesha, Jinean and The Story Pros Team</p>
          </div>
        `,
      };
    }

    // 72h final reminder — locked copy. After this, no more emails.
    case "verification_reminder_2": {
      const plainContainer = `max-width: 580px; margin: 0 auto; padding: 24px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.55; color: #222; background: #ffffff;`;
      const plainP = `margin: 0 0 14px;`;
      const plainLink = `color: ${brandColor}; text-decoration: underline;`;
      return {
        subject: `Last chance to verify, ${name}`,
        html: `
          <div style="${plainContainer}">
            <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">We don't want you to miss out.</div>
            <p style="${plainP}">Hi ${name},</p>
            <p style="${plainP}">We noticed you haven't verified your email yet. We'd love to have you as part of Story Pros, but we can only send you your welcome, your referral link, and your rewards once you've confirmed.</p>
            <p style="${plainP}">This is our last reminder. Tap below and you're in.</p>
            <p style="${plainP}"><a href="${data.verification_link}" style="${plainLink}">Verify my email (+15 points)</a></p>
            <p style="${plainP}">Camesha, Jinean and The Story Pros Team</p>
          </div>
        `,
      };
    }
    // Dashboard recovery — sent when someone uses the
    // "Already signed up? Find my dashboard" flow on /storypros.
    case "dashboard_recovery": {
      const plainContainer = `max-width: 580px; margin: 0 auto; padding: 24px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.55; color: #222; background: #ffffff;`;
      const plainP = `margin: 0 0 14px;`;
      const plainLink = `color: ${brandColor}; text-decoration: underline;`;
      return {
        subject: `Here's your Story Pros dashboard, ${name}`,
        html: `
          <div style="${plainContainer}">
            <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">One tap to get back into your dashboard.</div>
            <p style="${plainP}">Hi ${name},</p>
            <p style="${plainP}">You asked us to help you find your Story Pros dashboard. Tap the link below to open it:</p>
            <p style="${plainP}"><a href="${data.dashboard_link}" style="${plainLink}">Open my dashboard</a></p>
            <p style="${plainP}">If you didn't request this, you can safely ignore this email.</p>
            <p style="${plainP}">Camesha, Jinean and The Story Pros Team</p>
          </div>
        `,
      };
    }

    case "weekly_digest": {
      return {
        html: `
          <div style="${containerStyles}">
            <div style="${cardStyles}">
              <div style="${headerStyles}">
                <h1 style="margin: 0; font-size: 28px;">Your Weekly Digest</h1>
              </div>
              <div style="padding: 20px 0;">
                <p style="${baseStyles}">Hi ${name},</p>
                <p style="${baseStyles}">
                  <strong>${data.recent_signups || 0}</strong> new families joined this week.
                  You're at position <strong>#${data.user_position || "TBD"}</strong> out of
                  <strong>${data.total_users || "TBD"}</strong>.
                </p>
                <p style="${baseStyles}">
                  You have <strong>${data.points || 0}</strong> points. Keep sharing to climb.
                </p>
                <a href="${dashboard}" style="${buttonStyles}">Check Your Dashboard</a>
                <p style="${baseStyles}">${SIGN_OFF}</p>
              </div>
              ${footerBlock}
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
                <h1 style="margin: 0; font-size: 28px;">Keep the Momentum Going</h1>
              </div>
              <div style="padding: 20px 0;">
                <p style="${baseStyles}">Hey ${name},</p>
                <p style="${baseStyles}">You're close to unlocking the next tier.</p>
                <p style="${baseStyles}">
                  Share your referral link with one or two more friends to get there.
                </p>
                <a href="${dashboard}" style="${buttonStyles}">Share Your Link</a>
                <p style="${baseStyles}">${SIGN_OFF}</p>
              </div>
              ${footerBlock}
            </div>
          </div>
        `,
      };
    }

    case "announcement": {
      return {
        subject: data.subject || "News from Story Pros",
        html: `
          <div style="${containerStyles}">
            <div style="${cardStyles}">
              <div style="${headerStyles}">
                <h1 style="margin: 0; font-size: 28px;">${data.title || "News from Story Pros"}</h1>
              </div>
              <div style="padding: 20px 0;">
                <p style="${baseStyles}">Hi ${name},</p>
                <div style="${baseStyles}">${data.content || ""}</div>
                ${
                  data.cta_text && data.cta_url
                    ? `<a href="${data.cta_url}" style="${buttonStyles}">${data.cta_text}</a>`
                    : ""
                }
                <p style="${baseStyles}">${SIGN_OFF}</p>
              </div>
              ${footerBlock}
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
              <p style="${baseStyles}">Hello ${name},</p>
              <p style="${baseStyles}">Thank you for being part of Story Pros!</p>
              ${footerBlock}
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

    const { subject, html } = getEmailTemplate(template, data, to);

    // Generate a plain-text alternative from the HTML. Including a text/plain
    // part alongside text/html significantly improves deliverability and makes
    // Gmail less likely to bucket the message into Promotions.
    const text = html
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<\/(p|div|h[1-6]|li|tr|br)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<li[^>]*>/gi, "- ")
      .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, "$2 ($1)")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]+/g, " ")
      .trim();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Suppression check: never send to bounced / complained / unsubscribed addresses.
    // Protects sender reputation (SPF/DKIM/DMARC alignment is moot if we keep
    // mailing addresses Gmail has already rejected).
    const normalizedTo = to.trim().toLowerCase();
    const { data: suppressed } = await supabase
      .from("suppressed_emails")
      .select("email, reason")
      .eq("email", normalizedTo)
      .maybeSingle();
    if (suppressed) {
      console.log(`Suppressed send to ${normalizedTo} (reason: ${suppressed.reason}, template: ${template})`);
      return new Response(
        JSON.stringify({ success: true, suppressed: true, reason: suppressed.reason }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }
    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Route through Lovable connector gateway (Resend is configured as a connector)
    const resendResponse = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "X-Connection-Api-Key": resendApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Camesha & Jinean at Story Pros <hello@mail.empowereddld.com>",
        reply_to: "hello@empowereddld.com",
        to,
        subject,
        html,
        text,
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      console.error("Resend API error:", resendError);
      throw new Error(`Resend API failed: ${resendResponse.statusText}`);
    }

    const resendData: any = await resendResponse.json();
    const resendId = resendData.id;

    // Best-effort logging — table may not exist; ignore failures so they don't block delivery
    try {
      const { error: logError } = await supabase.from("waitlist_emails").insert({
        recipient_email: to,
        template,
        subject,
        resend_id: resendId,
        status: "sent",
      });
      if (logError && logError.code !== "PGRST205") {
        console.error("Failed to log email:", logError);
      }
    } catch (_) { /* ignore */ }

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
