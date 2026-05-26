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

const SIGN_OFF = "Warmly, Camesha & Jinean";
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
  const footerBlockNoPS = `
    <div style="${footerStyles}">
      <img src="${LOGO_URL}" alt="Story Pros" width="96" style="display: inline-block; max-width: 96px; height: auto; opacity: 0.9; margin-bottom: 12px; border: 0;" />
      <p style="margin: 12px 0 6px;">You're receiving this as a Story Pros founding member.</p>
      <p style="margin: 0;"><a href="${unsubscribeUrl}" style="color: ${brandColor}; text-decoration: none;">Unsubscribe</a></p>
    </div>
  `;

  const name = data.name || "there";
  const referralLink =
    data.referral_link ||
    (data.referral_code ? `${SITE_BASE}/storypros?ref=${data.referral_code}` : `${SITE_BASE}/storypros`);
  const dashboardBase = data.dashboard_url || DEFAULT_DASHBOARD;
  // Always include ?ref=CODE on dashboard links sent in email so the dashboard
  // can hydrate the user's session even when they open the email in a browser
  // / device where localStorage is empty (Gmail in-app browsers, a different
  // computer, private windows). Without this, the dashboard mounts, sees no
  // local session, and bounces them back to /storypros.
  const dashboard = data.referral_code
    ? `${dashboardBase}${dashboardBase.includes("?") ? "&" : "?"}ref=${data.referral_code}`
    : dashboardBase;
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

            <p style="${plainP}">The Story Pros App helps children understand stories, retell them in their own words, put events in order, grow their vocabulary, and connect stories to their own lives.</p>

            <p style="${plainP}">If you'd like a quick intro, here's our welcome video: <a href="${videoLink}" style="${plainLink}">${videoLink}</a></p>

            <p style="${plainP}"><strong>One thing we want you to know.</strong></p>

            <p style="${plainP}">Your membership includes something we believe in deeply: monthly Live Community Circles on Zoom, hosted by us. So many children who struggle with language also struggle with feeling like they're the only one. They're not. And this is where they get to see that for themselves.</p>

            <p style="${plainP}"><strong>You're not just on a waitlist.</strong></p>

            <p style="${plainP}">You're part of the group helping bring the Story Pros App to life. The more people who join through your link, the more you unlock: early access, bonus Coins, founder pricing, and more.</p>

            <p style="${plainP}">Your referral link:<br/><a href="${referralLink}" style="${plainLink}; word-break: break-all;">${referralLink}</a></p>

            <p style="${plainP}"><strong>Not sure what to say? Try one of these:</strong></p>

            <p style="${plainP}">For a text: "I just joined the early list for Story Pros, an app and community for kids who need extra support with storytelling and language. Thought of you: ${referralLink}"</p>

            <p style="${plainP}">For email or messenger: "I found something I think you'll want to see. It's called Story Pros, a membership that gives kids structured storytelling practice plus a monthly live gathering with other families. I'm in and would love for you to join me: ${referralLink}"</p>

            <p style="${plainP}">In a couple of hours, we'll send you the full breakdown of how points and tiers work so you know exactly how to climb.</p>

            <p style="${plainP}">We're so glad you're here.</p>

            <p style="${plainP}">${SIGN_OFF}</p>

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
    // EMAIL 2 — How Points Work (1h after verification)
    // ============================================================
    case "email2_points_tiers": {
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
      const profileButton = `display: inline-block; background: ${brandColor}; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 999px; font-weight: 700; font-size: 15px; line-height: 1.2; mso-padding-alt: 14px 28px;`;
      const dashButton = profileButton;

      return {
        subject: `Here's how points and tiers work, ${name}.`,
        html: `
          <div style="${plainContainer}">
            <p style="${plainP}">Hi ${name},</p>

            <p style="${plainP}">A little while ago, you joined Story Pros as a founding member. Here's the breakdown we promised: how points work, what you unlock, and the fastest ways to move forward.</p>

            <p style="${plainP}">You already have 25 points (10 for signing up, 15 for verifying your email). Your next quick win: complete your profile for another 10.</p>

            <p style="${plainP}; text-align: center; margin: 24px 0;"><a href="${dashboard}" style="${profileButton}">Complete my profile (+10 points)</a></p>

            <p style="${plainP}"><strong>How you earn points</strong></p>

            <p style="${plainP}">One-time actions:</p>
            <ul style="${plainP}; padding-left: 20px;">
              <li>Sign up: +10 (already yours)</li>
              <li>Verify your email: +15 (already yours)</li>
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

            <p style="${plainP}">The one-timers are your fastest early wins. The repeatables are how you climb.</p>

            <p style="${plainP}"><strong>What you unlock</strong></p>

            <ul style="${plainP}; padding-left: 20px;">
              <li><strong>Tier 1 (0 pts):</strong> Development updates and your name on the Early Supporters Wall as a founding member.</li>
              <li><strong>Tier 2 (35 pts):</strong> Our paid digital guide "Executive Function Skills for Your Child," free as a thank you.</li>
              <li><strong>Tier 3 (75 pts):</strong> Bonus Story Coins to spend inside the app at launch.</li>
              <li><strong>Tier 4 (130 pts):</strong> VIP Beta Access. Test the Story Pros App before launch and help shape the final product.</li>
              <li><strong>Tier 5 (250 pts):</strong> Founder Pricing locked in for life.</li>
              <li><strong>Tier 6 (500 pts):</strong> A signed Dan & Daria book with a handwritten note. Limited to the first 20 members to reach Tier 6. After those 20 slots are claimed, Tier 6 still unlocks 100 Story Coins to spend at launch.</li>
            </ul>

            <p style="${plainP}">Every tier you reach, every person you refer, that's one more family finding out their child isn't alone.</p>

            <p style="${plainP}"><strong>Quickest ways to move forward right now</strong></p>

            <ul style="${plainP}; padding-left: 20px;">
              <li>Complete your profile (+10 pts, takes 30 seconds)</li>
              <li>Follow us on Instagram, Facebook, or YouTube (+8 pts each)</li>
              <li>Share your referral link (+25 pts every time someone joins, plus a +10 bonus on your first referral)</li>
            </ul>

            <p style="${plainP}">Your referral link:<br/><a href="${referralLink}" style="${plainLink}; word-break: break-all;">${referralLink}</a></p>

            <p style="${plainP}; text-align: center; margin: 20px 0;"><a href="${dashboard}" style="${dashButton}">Go to my dashboard</a></p>

            <p style="${plainP}"><strong>Know a teacher or therapist?</strong></p>

            <p style="${plainP}">This one's worth sharing with them:</p>

            <p style="${plainP}">"I came across something called Story Pros. It's an app and monthly community built by speech-language pathologists and teachers that helps kids with storytelling and narrative language. Thought you'd want a look: ${referralLink}"</p>

            <p style="${plainP}">${SIGN_OFF}</p>

            <p style="${plainP}; margin-top: 28px;"><em>P.S. If this email landed in your Promotions or Updates tab, drag it over to your Primary inbox so you don't miss the next one. It really helps.</em></p>

            <div style="${plainFooter}">
              <p style="margin: 0 0 6px;">You're receiving this as a Story Pros founding member.</p>
              <p style="margin: 0;"><a href="${unsubscribeUrl}" style="color: #888; text-decoration: underline;">Unsubscribe</a></p>
            </div>
          </div>
        `,
      };
    }

    case "email3_tier2": {
      const tier2Footer = `
        <div style="${footerStyles}">
          <img src="${LOGO_URL}" alt="Story Pros" width="96" style="display: inline-block; max-width: 96px; height: auto; opacity: 0.9; margin-bottom: 12px; border: 0;" />
          <p style="margin: 12px 0 6px;">You're receiving this as a Story Pros founding member.</p>
          <p style="margin: 0;"><a href="${unsubscribeUrl}" style="color: ${brandColor}; text-decoration: none;">Unsubscribe</a></p>
        </div>
      `;

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
                  As a thank you, the <strong>"Executive Function Skills for Your Child"</strong> guide is yours, on us. It's normally a paid product in our resource library, but at Tier 2 it's free.
                </p>

                <div style="text-align: center;">
                  <a href="${guideUrl}" style="${buttonStyles}">Download your guide</a>
                </div>

                <p style="${baseStyles}">
                  Inside you'll find practical strategies to help your child plan, focus, remember instructions, and manage big feelings, the kind of skills that support storytelling, schoolwork, and everyday life.
                </p>

                <hr style="${dividerStyles}" />

                <p style="${baseStyles}"><strong>What's next: Tier 3 (75 pts), 50 Story Coins</strong></p>

                <p style="${baseStyles}">
                  Story Coins are yours to spend inside the Story Pros app at launch on themes, characters, and extras.
                </p>

                <p style="${baseStyles}">
                  You're <strong>${pointsToNext} points away</strong>. The fastest way there is referrals. Every new person you bring in gets you 25 points.
                </p>

                <p style="${baseStyles}">
                  <strong>Your referral link:</strong><br/>
                  <a href="${referralLink}" style="color: ${brandColor}; word-break: break-all;">${referralLink}</a>
                </p>

                <p style="${baseStyles}"><strong>A few messages to copy and paste if you'd like:</strong></p>

                <div style="${scriptBlock}">
                  "I'm on the early list for an app called Story Pros. It helps kids build the skills they need to tell stories and express what's on their mind, plus there's a monthly live community for families on Zoom. Worth a look: ${referralLink}"
                </div>

                <div style="${scriptBlock}">
                  "Hey! Found a new app and community I think you'd want to know about. Story Pros helps kids retell stories, put their thoughts in order, and find the right words, plus there's a monthly live group for kids on Zoom. I just joined: ${referralLink}"
                </div>

                <p style="${baseStyles}; margin-bottom: 4px;"><strong>For a teacher or therapist:</strong></p>
                <div style="${scriptBlock}">
                  "I came across something called Story Pros. It's an app and monthly community built by speech-language pathologists and teachers that helps kids with storytelling and narrative language. Thought you'd want a look: ${referralLink}"
                </div>

                ${ctaPair(referralLink, dashboard)}

                <p style="${baseStyles}">Talk soon,<br/>Camesha, Jinean and The Story Pros Team</p>
              </div>

              ${tier2Footer}
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
        subject: `You just earned 50 Story Coins, ${name}.`,
        html: `
          <div style="${containerStyles}">
            <div style="${cardStyles}">
              ${tierHero("Tier 3 Unlocked", "50 Story Coins are yours.")}

              <div style="${bodyPad}">
                <p style="${baseStyles}">Hi ${name},</p>

                <p style="${baseStyles}">
                  You did it. You just hit <strong>75 points</strong> and crossed into <strong>Tier 3</strong>.
                </p>

                <p style="${baseStyles}">
                  <strong>50 Story Coins are yours.</strong> They'll land in your account the moment Story
                  Pros launches, ready to spend on stories, characters, and extras inside the app.
                </p>

                <hr style="${dividerStyles}" />

                <p style="${baseStyles}"><strong>What's next: Tier 4 (130 pts), VIP Beta Access + The Suggestion Box</strong></p>

                <p style="${baseStyles}">
                  At Tier 4, you'll be one of the first families inside Story Pros before it launches.
                  You'll test the app, use it with your child, and help shape the final product with real feedback.
                </p>

                <p style="${baseStyles}">
                  You'll also unlock the Suggestion Box, where you can submit ideas for what we build next
                  and vote on suggestions from other founding members. From story themes and characters to
                  app features and Community Circle topics, your voice helps shape the app your child will use.
                </p>

                <p style="${baseStyles}">You're <strong>${pointsToNext} points away</strong>.</p>

                <p style="${baseStyles}">
                  <strong>Your referral link:</strong><br/>
                  <a href="${referralLink}" style="color: ${brandColor}; word-break: break-all;">${referralLink}</a>
                </p>

                <p style="${baseStyles}"><strong>Something to share right now:</strong></p>

                <div style="${scriptBlock}">
                  For a text: "I found an app called Story Pros that helps kids build storytelling and
                  language skills, plus there's a monthly live community on Zoom. Thought of you: ${referralLink}"
                </div>

                <div style="${scriptBlock}">
                  For a friend or therapist: "I've been part of the early community for Story Pros. It's
                  built by speech-language pathologists and teachers to help kids with storytelling and
                  language. I'm helping shape the app before it launches and thought you'd want in: ${referralLink}"
                </div>

                ${ctaPair(referralLink, dashboard)}

                <p style="${baseStyles}">Warmly,<br/>${SIGN_OFF}</p>
              </div>

              ${footerBlockNoPS}
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
                  You'll get to test the app, use it with your child, and tell us what's working and what
                  isn't so we can shape the final version around real feedback from the families who'll use it.
                </p>

                <p style="${baseStyles}">
                  <strong>You've also unlocked the Suggestion Box.</strong> This is where families who
                  are testing the app weigh in on what we build next, from story themes and characters to
                  app features and Community Circle topics. Your ideas help guide what we create, and
                  your voice carries real weight here.
                </p>

                <p style="${baseStyles}">
                  <a href="${dashboard}" style="color: ${brandColor}; text-decoration: underline;">Head to your dashboard to submit your first suggestion.</a>
                </p>

                <hr style="${dividerStyles}" />

                <p style="${baseStyles}"><strong>Here's everything you've unlocked so far:</strong></p>
                <ul style="${baseStyles}">
                  ${tierLine("Tier 1", "Development Updates + Early Supporters Wall")}
                  ${tierLine("Tier 2", "Free Executive Function guide")}
                  ${tierLine("Tier 3", "50 Bonus Story Coins")}
                  ${tierLine("Tier 4", "Early testing access + Suggestion Box", true)}
                </ul>

                <hr style="${dividerStyles}" />

                <p style="${baseStyles}"><strong>What's next: Tier 5 (250 pts)</strong></p>

                <p style="${baseStyles}">
                  Something worth working toward. Reach 250 points to unlock it.
                </p>

                <p style="${baseStyles}">You're <strong>${pointsToNext} points away</strong>.</p>

                <p style="${baseStyles}">
                  <strong>Your referral link:</strong><br/>
                  <a href="${referralLink}" style="color: ${brandColor}; word-break: break-all;">${referralLink}</a>
                </p>

                <p style="${baseStyles}"><strong>Something to share right now:</strong></p>

                <div style="${scriptBlock}">
                  For a text: "I just got early access to test Story Pros before it launches. It's an app and community for kids who need support with storytelling and language. You can still get in: ${referralLink}"
                </div>

                <div style="${scriptBlock}">
                  For a friend or therapist: "I'm one of the first families testing Story Pros before it goes public. It's built by speech-language pathologists and teachers to help kids with storytelling and language. I get to give feedback and help shape the app. Thought you'd want in: ${referralLink}"
                </div>

                ${ctaPair(referralLink, dashboard)}

                <p style="${baseStyles}">Warmly,<br/>Camesha, Jinean and the Story Pros Team</p>
              </div>

              ${footerBlockNoPS}
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

                <p style="${baseStyles}"><strong>250 points. You're at Tier 5.</strong></p>

                <p style="${baseStyles}"><strong>Founder Pricing, locked in for life.</strong></p>

                <p style="${baseStyles}">
                  Your subscription will be <strong>$7.99/month forever</strong>, instead of the regular $9.99. That price stays
                  no matter how much we add to the app, the Community Circles, or any other features
                  down the road.
                </p>

                <p style="${baseStyles}"><strong>One more thing: your points now count double.</strong></p>

                <p style="${baseStyles}">
                  Every share, every referral, every follow. Tier 6 is closer than it looks.
                </p>

                <hr style="${dividerStyles}" />

                <p style="${baseStyles}"><strong>Here's everything you've unlocked so far:</strong></p>
                <ul style="${baseStyles}">
                  ${tierLine("Tier 1", "Development Updates + Early Supporters Wall")}
                  ${tierLine("Tier 2", "Free Executive Function guide")}
                  ${tierLine("Tier 3", "50 Bonus Story Coins")}
                  ${tierLine("Tier 4", "Early testing access + Suggestion Box")}
                  ${tierLine("Tier 5", "Founder Pricing, locked for life + double points", true)}
                </ul>

                <hr style="${dividerStyles}" />

                <p style="${baseStyles}"><strong>One tier left: Tier 6 (500 pts)</strong></p>

                <p style="${baseStyles}">
                  A signed <strong>Dan & Daria book</strong> with a handwritten note,
                  limited to the first 20 members to reach Tier 6. After those 20 slots are claimed,
                  Tier 6 still unlocks <strong>100 Story Coins</strong> to spend at launch.
                </p>

                <p style="${baseStyles}">
                  You're <strong>${pointsToNext} points</strong> away. Everything counts double now.
                </p>

                <p style="${baseStyles}">
                  <strong>Your referral link:</strong><br/>
                  <a href="${referralLink}" style="color: ${brandColor}; word-break: break-all;">${referralLink}</a>
                </p>

                <p style="${baseStyles}"><strong>Something to share right now:</strong></p>

                <div style="${scriptBlock}">
                  For a text: "I just locked in founder pricing for Story Pros, an app and community for kids who need support with storytelling and language. They're still letting people in early: ${referralLink}"
                </div>

                <div style="${scriptBlock}">
                  For a friend or therapist: "I've been part of the Story Pros founding community for a while now and just hit a milestone. It's built by speech-language pathologists and teachers to help kids with storytelling and language. I think you'd want to see this before it launches: ${referralLink}"
                </div>

                ${ctaPair(referralLink, dashboard)}

                <p style="${baseStyles}">
                  Thank you for helping more children not just communicate, but connect.
                </p>

                <p style="${baseStyles}">Warmly, Camesha, Jinean and the Story Pros Team</p>
              </div>

              ${footerBlockNoPS}
            </div>
          </div>
        `,
      };
    }

    // ============================================================
    // EMAIL 7 — Tier 6 Reached (Founder, first 20)
    // ============================================================
    case "email7_tier6_founder": {
      const slot = data.founder_slot_number ?? 1;
      const claimUrl = data.claim_url || `${SITE_BASE}/storypros/claim-founder`;
      return {
        subject: `You did it, ${name}. You're a Story Pros Founder.`,
        html: `
          <div style="${containerStyles}">
            <div style="${cardStyles}">
              ${tierHero("Tier 6 Unlocked", "A signed book is headed your way.")}

              <div style="${bodyPad}">
                <p style="${baseStyles}">Hi ${name},</p>

                <p style="${baseStyles}"><strong>500 points. Tier 6. The final one.</strong></p>

                <p style="${baseStyles}">You're <strong>Founder #${slot} of 20</strong>.</p>

                <p style="${baseStyles}">
                  Every person you brought in is a family whose child will have access to something that
                  helps them put their thoughts into words and share their world. That's what your 500
                  points represent. Not numbers. Real kids. And you made that happen.
                </p>

                <p style="${baseStyles}"><strong>Here's what you've unlocked:</strong></p>

                <p style="${baseStyles}">
                  <strong>A signed Dan & Daria book.</strong> Personally signed, with a handwritten note
                  from us. This is the book that started everything for the kids and families we built
                  Story Pros for.
                </p>

                <p style="${baseStyles}">
                  <strong>Founder status, locked for life.</strong> Your $7.99/month pricing stays forever.
                  Your name stays on the Early Supporters Wall. And you'll always be one of the first 20
                  people who made Story Pros real.
                </p>

                <hr style="${dividerStyles}" />

                <p style="${baseStyles}"><strong>Here's everything you've unlocked across your entire journey:</strong></p>
                <ul style="${baseStyles}">
                  ${tierLine("Tier 1", "Development Updates + Early Supporters Wall")}
                  ${tierLine("Tier 2", "Free Executive Function guide")}
                  ${tierLine("Tier 3", "50 Bonus Story Coins")}
                  ${tierLine("Tier 4", "Early testing access + Suggestion Box")}
                  ${tierLine("Tier 5", "Founder Pricing + double points")}
                  ${tierLine("Tier 6", "Signed Dan & Daria book", true)}
                </ul>

                <hr style="${dividerStyles}" />

                <div style="text-align: center;">
                  <a href="${claimUrl}" style="${buttonStyles}">Claim my Founder package</a>
                </div>

                <p style="${baseStyles}">
                  Tell us where to ship your signed book and how you'd like it inscribed. Takes
                  about 60 seconds. Once all 20 Founder slots are claimed, we ship everything together.
                </p>

                <hr style="${dividerStyles}" />

                <p style="${baseStyles}"><strong>What happens now?</strong></p>

                <p style="${baseStyles}">
                  You've reached the top of the waitlist. When Story Pros officially launches, you'll be
                  the first to know. We'll send you everything you need to get your child started, and
                  your Founder Pricing and Monthly Live Community Circles kick in from day one.
                </p>

                <p style="${baseStyles}">
                  Until then, your link still works. And every person you bring in is still another child
                  who gets closer to being part of a community where they're not the only one.
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
    // EMAIL 7B — Tier 6 Reached (after 20 Founder slots claimed)
    // ============================================================
    case "email7b_tier6_legend":
    case "email7b_tier6": {
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

                <p style="${baseStyles}"><strong>You made it to the top.</strong></p>

                <p style="${baseStyles}">
                  Not everyone gets here. You didn't just sign up and wait. You showed up, you shared,
                  you brought families in. That matters more than you know.
                </p>

                <p style="${baseStyles}">
                  You brought <strong>${referralCount} families</strong> into this. That's ${referralCount}
                  children who will have access to a tool that helps them put their thoughts into words
                  and share their world, and a community where they get to see they're not the only one.
                </p>

                <hr style="${dividerStyles}" />

                <p style="${baseStyles}"><strong>Here's what you've unlocked at Tier 6:</strong></p>

                <p style="${baseStyles}">
                  <strong>100 bonus Story Coins.</strong> Combined with the 50 you earned at Tier 3,
                  that's 150 Story Coins ready to spend the moment the app launches.
                </p>

                <p style="${baseStyles}">
                  <strong>Tier 6 badge, permanent.</strong> A distinct badge on your profile and the
                  Early Supporters Wall. Anyone who visits will see you went all the way.
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
                  ${tierLine("Tier 4", "Early testing access + Suggestion Box")}
                  ${tierLine("Tier 5", "Founder Pricing + double points")}
                  ${tierLine("Tier 6", "100 bonus Story Coins + Tier 6 badge (you are here)", true)}
                </ul>

                <p style="${baseStyles}"><strong>What happens now?</strong></p>

                <p style="${baseStyles}">
                  You've reached the top of the waitlist. When Story Pros officially launches, you'll
                  be the first to know. We'll send you everything you need to get your child started,
                  and your Founder Pricing and Monthly Live Community Circles kick in from day one.
                </p>

                <p style="${baseStyles}">
                  Until then, your link still works. And every person you bring in is still another
                  child who gets closer to finding their voice.
                </p>

                <div style="text-align: center;">
                  <a href="${referralLink}" style="${primaryInlineButtonStyles}">Share Story Pros</a>
                </div>

                <p style="${baseStyles}">Thank you for going all the way.</p>

                <p style="${baseStyles}">Warmly, Camesha, Jinean and the Story Pros Team</p>
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
      const referredName = data.referred_name || data.name || "Someone";
      const firstName = data.first_name || name;
      return {
        subject: `🎉 ${referredName} just joined using your link`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px 20px; color: #222;">
            <p style="${plainP}">Hey ${firstName},</p>
            <p style="${plainP}">
              Quick celebration: <strong>${referredName}</strong> just joined the Story Pros founding waitlist using your link.
            </p>
            <p style="${plainP}">
              You earned <strong>+25 points</strong>${data.points ? ` (you're now at <strong>${data.points}</strong> total)` : ""}. Every referral moves you closer to your next tier and the rewards that come with it.
            </p>
            <p style="${plainP}">
              See your updated dashboard: <a href="${dashboard}" style="${plainLink}">Go to my dashboard</a>
            </p>
            <p style="${plainP}">Warmly, Camesha, Jinean and the Story Pros Team</p>
            ${footerBlock}
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
      const verifyButton = `display: inline-block; background: ${brandColor}; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 999px; font-weight: 700; font-size: 15px; line-height: 1.2; mso-padding-alt: 14px 28px;`;
      return {
        subject: `Verify your email to get started, ${name}`,
        html: `
          <div style="${plainContainer}">
            <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">One tap and your first 15 points are yours.</div>
            <p style="${plainP}">Hi ${name},</p>
            <p style="${plainP}">Thanks for signing up for Story Pros!</p>
            <p style="${plainP}">One quick step: verify your email below to unlock your first 15 points.</p>
            <p style="${plainP}; text-align: center; margin: 24px 0;"><a href="${data.verification_link}" style="${verifyButton}">Verify my email (+15 points)</a></p>
            <p style="${plainP}">Once you do, we'll send your full welcome with your referral link, your tier roadmap, and a video from us.</p>
            <p style="${plainP}">Warmly,<br/>Camesha & Jinean</p>
          </div>
        `,
      };
    }

    // 24h reminder — locked copy
    case "verification_reminder_1": {
      const plainContainer = `max-width: 580px; margin: 0 auto; padding: 24px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.55; color: #222; background: #ffffff;`;
      const plainP = `margin: 0 0 14px;`;
      const verifyButton = `display: inline-block; background: ${brandColor}; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 999px; font-weight: 700; font-size: 15px; line-height: 1.2; mso-padding-alt: 14px 28px;`;
      return {
        subject: `Still need to verify, ${name}`,
        html: `
          <div style="${plainContainer}">
            <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">Your 15 points are waiting.</div>
            <p style="${plainP}">Hi ${name},</p>
            <p style="${plainP}">Just a quick reminder to verify your email so we can send you everything you need to get started with Story Pros, including your referral link, your welcome video, and your first 15 points.</p>
            <p style="${plainP}; text-align: center; margin: 24px 0;"><a href="${data.verification_link}" style="${verifyButton}">Verify my email (+15 points)</a></p>
            <p style="${plainP}">Warmly, Camesha, Jinean and the Story Pros Team</p>
          </div>
        `,
      };
    }

    // 72h final reminder — locked copy. After this, no more emails.
    case "verification_reminder_2": {
      const plainContainer = `max-width: 580px; margin: 0 auto; padding: 24px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.55; color: #222; background: #ffffff;`;
      const plainP = `margin: 0 0 14px;`;
      const verifyButton = `display: inline-block; background: ${brandColor}; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 999px; font-weight: 700; font-size: 15px; line-height: 1.2; mso-padding-alt: 14px 28px;`;
      return {
        subject: `Last chance to verify, ${name}`,
        html: `
          <div style="${plainContainer}">
            <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">This is our last reminder.</div>
            <p style="${plainP}">Hi ${name},</p>
            <p style="${plainP}">We noticed you haven't verified your email yet. We'd love to have you as part of Story Pros, but we can only send you your welcome, your referral link, and your rewards once you've confirmed.</p>
            <p style="${plainP}">This is our last reminder. Tap below and you're in.</p>
            <p style="${plainP}; text-align: center; margin: 24px 0;"><a href="${data.verification_link}" style="${verifyButton}">Verify my email (+15 points)</a></p>
            <p style="${plainP}">Warmly, Camesha, Jinean and the Story Pros Team</p>
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
            <p style="${plainP}">Camesha, Jinean and the Story Pros Team</p>
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

    // Triggered by send-nudge-emails cron when user is within 15 pts of
    // next tier and has been inactive for 4+ days. Sent once per tier.
    case "nudge": {
      const plainContainer = `max-width: 580px; margin: 0 auto; padding: 24px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.55; color: #222; background: #ffffff;`;
      const plainP = `margin: 0 0 14px;`;
      const plainLink = `color: ${brandColor}; text-decoration: underline; word-break: break-all;`;
      const pointsAway = data.points_to_next ?? 15;
      return {
        subject: `You're close, ${name}.`,
        html: `
          <div style="${plainContainer}">
            <p style="${plainP}">Hi ${name},</p>
            <p style="${plainP}">You're <strong>${pointsAway} points</strong> away from your next tier. That's closer than you think.</p>
            <p style="${plainP}">The fastest way there: share your referral link. Every person who joins through you earns you 25 points.</p>
            <p style="${plainP}">Your referral link: <a href="${referralLink}" style="${plainLink}">${referralLink}</a></p>
            <p style="${plainP}">For a quick text: "I'm on the early list for Story Pros, an app and community for kids who need support with storytelling and language. Worth a look: ${referralLink}"</p>
            <p style="${plainP}">Warmly, Camesha, Jinean and the Story Pros Team</p>
          </div>
        `,
      };
    }

    // One-time broadcast when Founder slots remaining hits 5. Sent to
    // verified users not yet at Tier 6.
    case "founder_scarcity": {
      const plainContainer = `max-width: 580px; margin: 0 auto; padding: 24px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.55; color: #222; background: #ffffff;`;
      const plainP = `margin: 0 0 14px;`;
      const plainLink = `color: ${brandColor}; text-decoration: underline; word-break: break-all;`;
      const slots = data.slots_remaining ?? 5;
      const userPoints = data.points ?? 0;
      return {
        subject: `Only ${slots} Founder slots left.`,
        html: `
          <div style="${plainContainer}">
            <p style="${plainP}">Hi ${name},</p>
            <p style="${plainP}">The first 20 people to reach Tier 6 (500 points) claim a signed Dan & Daria book with a handwritten note from us. Only <strong>${slots} slots</strong> are left.</p>
            <p style="${plainP}">You're at <strong>${userPoints} points</strong>. Every referral earns you 25. Every share, every follow, every action moves you closer.</p>
            <p style="${plainP}">Your referral link: <a href="${referralLink}" style="${plainLink}">${referralLink}</a></p>
            <p style="${plainP}">Warmly, Camesha, Jinean and the Story Pros Team</p>
          </div>
        `,
      };
    }

    // Triggered by send-inactivity-emails cron when user verified 14+ days
    // ago and hasn't earned points beyond the verification bonus. Sent once.
    case "inactivity_reengagement": {
      const plainContainer = `max-width: 580px; margin: 0 auto; padding: 24px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.55; color: #222; background: #ffffff;`;
      const plainP = `margin: 0 0 14px;`;
      const plainLink = `color: ${brandColor}; text-decoration: underline; word-break: break-all;`;
      return {
        subject: `We saved your spot, ${name}.`,
        html: `
          <div style="${plainContainer}">
            <p style="${plainP}">Hi ${name},</p>
            <p style="${plainP}">You joined the Story Pros founding community a little while ago and we're glad you're here. Your spot, your points, and your referral link are all still waiting for you.</p>
            <p style="${plainP}">If you're not sure where to start, the fastest way to climb is to share your link. Every person who joins through you earns you 25 points and gets you closer to your next tier.</p>
            <p style="${plainP}">Your referral link: <a href="${referralLink}" style="${plainLink}">${referralLink}</a></p>
            <p style="${plainP}">We're building something that helps children understand stories, retell them in their own words, and find the confidence to share their world. Every family you bring in is one more child who gets that chance.</p>
            <p style="${plainP}">Warmly, Camesha, Jinean and the Story Pros Team</p>
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

// Templates the public can request without authentication. Everything else
// (tier emails, founder scarcity, verification reminders, etc.) must be
// invoked by trusted cron jobs / internal edge functions (x-cron-secret) or
// by an admin user (JWT with admin role).
const PUBLIC_TEMPLATES = new Set(["invite"]);

async function isPrivilegedWaitlistCall(req: Request): Promise<boolean> {
  const cronSecret = Deno.env.get("CRON_SECRET");
  if (cronSecret && req.headers.get("x-cron-secret") === cronSecret) return true;

  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return false;

  // Direct service-role match (works for both legacy JWT and new sb_secret_* keys).
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (serviceKey && token === serviceKey) return true;

  // Legacy service-role JWT decode (kept for backward compatibility).
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      if (payload?.role === "service_role") return true;
    }
  } catch { /* fall through to admin check */ }

  // Otherwise check admin role for the authenticated user.
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: userRes } = await supabase.auth.getUser(token);
    if (!userRes?.user) return false;
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userRes.user.id)
      .eq("role", "admin")
      .maybeSingle();
    return !!roleRow;
  } catch {
    return false;
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

    // Template-level access control: anything outside the public allowlist
    // must come from a trusted caller (cron secret, service role, or admin).
    if (!PUBLIC_TEMPLATES.has(template)) {
      const allowed = await isPrivilegedWaitlistCall(req);
      if (!allowed) {
        console.warn(`Blocked unauthorized send-waitlist-email call (template=${template})`);
        return new Response(
          JSON.stringify({ error: "Forbidden: template requires privileged caller" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
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
