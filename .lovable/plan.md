## Goal

Give Tier-celebration Emails **3, 4, 5, 6, 7, and 7B** a nicer, on-brand visual treatment — with the Story Pros logo at the top and a consistent purple hero across all six. Email 1 (Welcome) and Email 2 (Points & Tiers) stay plain-text by design (Gmail Primary deliverability — see memory).

## What changes (visual only — body copy stays locked)

All six tier emails get the **same** upgraded shell:

1. **Story Pros logo** at the top of the hero (the attached "social/small size" lockup — purple wordmark + paper plane book mark on white).
2. **Same purple hero band** for all 6 — `linear-gradient(135deg, #5B2D8E → #7C3FB8)` (the existing brand gradient already used in the file). No per-tier color variation, just the tier name + one-line subhead.
3. **Refined card styling**: rounded 16px corners, soft purple-tinted shadow, generous 36px interior padding, white card on a `#F8F5FC` page background.
4. **Cleaner typography**: 28px hero title, 15px body, 1.65 line-height, slightly warmer text color (#2A2438), Nunito → DM Sans → system fallback.
5. **Better section dividers**: subtle horizontal rule with a small purple dot in the middle (instead of plain `border-top`).
6. **Upgraded buttons**: the existing primary/secondary CTA pair gets a subtle hover-ready treatment — primary gets a slight shadow, secondary gets a 2px border + white fill.
7. **Script blocks** (the "copy & paste this" boxes): swap the left-bar treatment for a soft purple-tinted background card with a small "Copy this" label tag in the top-right corner (visual only — still plain text inside).
8. **Footer**: keeps the same content (P.S. about Promotions tab + unsubscribe link) but with refined spacing and a small Story Pros logo mark.

## Important constraints (from memory)

- **DO NOT change any body copy.** Emails 3, 4, 5, 6, 7, 7B are all locked in memory. I will only swap the surrounding HTML shell, hero block, divider/button/script-block styles, and add the logo. Subject lines also stay locked.
- **DO NOT touch Emails 1, 2, verification, reminders, dashboard recovery, referral_joined, milestone_unlocked, weekly_digest, nudge, announcement.** Plain-text Welcome/Points stay plain-text on purpose.
- **No em dashes** in any new chrome copy I add (memory rule).

## Asset work

- Copy the uploaded logo image into `src/assets/logo-storypros.png` and `public/email-assets/logo-storypros.png`.
- Use the **public** copy in the email HTML (emails need an absolute, publicly-fetchable URL — `https://empowereddld.com/email-assets/logo-storypros.png`). The `src/assets` copy is for in-app use later.
- Use the "social / small size" lockup variant (purple "Story" + yellow "Pros" + book/plane mark) at ~140px wide, centered, with 24px padding above/below, on a white strip ABOVE the purple hero band. This avoids the white-on-purple readability issue and keeps the logo crisp.

## Implementation

Single file edit: `supabase/functions/send-waitlist-email/index.ts`

1. Add a `LOGO_URL` constant near the top (`https://empowereddld.com/email-assets/logo-storypros.png`).
2. Add a new `tierHero(tierLabel, subhead)` helper that returns the white-logo-strip + purple hero band as one block.
3. Add a new `tierCard` style block (rounded 16px, refined shadow, 36px padding).
4. Add a refined `dividerWithDot` helper.
5. Add a refined `scriptBlockV2` style.
6. Refresh `buttonStyles` / `secondaryButtonStyles` / `primaryInlineButtonStyles` (slight shadow + border tweaks) — these are only used by Emails 3–7B and the existing `ctaPair` helper, so the change is scoped.
7. Replace the inner shell of cases `email3_tier2`, `email4_tier3`, `email5_tier4`, `email6_tier5`, `email7_tier6_founder`, `email7b_tier6_legend` to use the new `tierHero` + `tierCard`. **Body paragraphs, scripts, and CTAs stay byte-identical.**
8. Leave Emails 1, 2, and all transactional/utility templates untouched.

## QA

After the change I will:
- Send a test of Email 3 to your admin inbox using the existing **Test Send** flow in `AdminEmails` (or via the `dispatch-tier-emails` test path) so you can eyeball it in Gmail.
- Confirm the logo loads (it has to be reachable at the public URL — I'll verify with a quick `curl -I` once published).
- Spot-check 2 more emails (Email 5 and Email 7) so we cover early/middle/late tiers.

## What you'll see when it's done

A consistent, branded look across all six tier-up emails: white logo strip on top → purple hero with the tier name → clean white card with your locked copy → refined CTA buttons → consistent footer. Same content, much nicer container.
