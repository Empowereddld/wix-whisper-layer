# Story Pros Dashboard — Design, Spacing & UX Audit

## Goal

1. Make the inline "Preview Post" feel compact (your main complaint).
2. Audit the entire dashboard top-to-bottom and fix the friction points that show up at desktop **and** mobile widths.

The page reads well in content, but several sections fight for attention or take more vertical space than they need. The pass below is style-only — no copy or feature changes unless flagged.

---

## 1. Shrink the inline Preview (your specific ask)

In `SharePostFlow.tsx` the preview card currently:

- Uses `max-w-md` (448px), which is wider than most social posts feel.
- Renders the full image at native ratio with no height cap, so for tall vertical posters (POST_01, POST_02, POST_06) it explodes to ~600–800px tall.
- Uses default `p-3` text padding that feels loose under a tall image.

Changes:

- Cap the preview card to a phone-feed feel: `max-w-[320px]`, image clipped to `max-h-[360px]` with `object-cover` + `aspect-[4/5]` so all 6 vertical posters look consistent.
- Reduce caption padding to `p-3` with `text-[13px] leading-snug`.
- Add a small "Preview" pill header inside the card instead of the separate label above, so the whole block is tighter.
- Keep the `Hide preview` toggle as is.

Result: the preview shrinks to roughly the size of an Instagram post tile in your feed — small enough to feel like a sanity check, not a second hero.

## 2. Featured image (Step 1) is also too tall

Same root cause: vertical 2:3 posters in a `sm:aspect-[4/3]` container with `max-h-[420px]` end up ~420px on desktop, dominating the section.

- Tighten to `max-h-[340px]` desktop / `max-h-[300px]` mobile.
- Switch the container to `aspect-[4/5]` so vertical art fits without huge letterboxed gray bars.
- Center the image with a soft `bg-muted/40` instead of solid `bg-muted` so the letterboxing is less obvious.

## 3. Action button row is too wide on desktop

Currently 4 buttons stretch full width (`Copy Caption & Image` is forced to `min-w-[220px]`, then 3 more outline/ghost buttons next to it). On a 1024–1280px card this row sprawls.

- Group as: primary (Copy Caption & Image) on its own row at full width on mobile, auto width on desktop.
- Secondary cluster (Share, Download Image, Preview Post) right-aligned next to it on desktop, wrapping under the primary on mobile.
- Reduce gap from `gap-2` to `gap-2 sm:gap-3` and add a subtle `border-t pt-4` above the row so it reads as "actions" not "more content".

## 4. Share & Earn section feels redundant next to Share a Post

The "Share & Earn Referrals" card has 6 platform buttons + a script carousel. Right under it sits "Share a Post" which has Copy/Share/Download. They're doing different jobs but visually they look like two share blocks back-to-back.

Lightweight fix (no restructure):

- Rename "Share & Earn Referrals" subtitle to make it clear it's for **quick text shares** ("Tap a platform to fire off a quick text share with a ready-made caption").
- Add a small `text-xs` hint at the top of "Share a Post" — "Want a richer post with an image? Use this." — so users know which one to pick.
- Tighten internal spacing: `mt-6 pt-6` → `mt-5 pt-5` between the platform grid and the ScriptCarousel.

## 5. Top of the page has 4 stacked status bars

Top bar (sign out) → User Header → Waitlist Position spotlight → Verify-email banner. On mobile that's ~280px before any real content.

- Keep all 4 (each is doing a distinct job) but trim:
  - User Header `py-6` → `py-4 sm:py-5`
  - Waitlist spotlight `py-4` stays, but reduce the title font on mobile from `text-xl` to `text-lg` so the bar is shorter.
  - Verify-email banner: tighten to `py-2.5` and put the strong sentence + button on one line at `sm:` breakpoint; stack only on mobile.

## 6. Tier Progress + Referrals row balance

On desktop the Referrals card is mostly empty (single big number, one helper line). On mobile it stacks fine.

- Add a tiny "Recent referrals" sparkline-style row under the number (just text: "Last 7 days: +N") when count > 0. This isn't new data — it uses what `wl.inviteCount` already gives, gracefully shows nothing extra when 0.
- If you'd rather not add anything, alternative: drop the Referrals card to `md:col-span-1` of a 4-col grid and let Tier Progress take 3. (I'll do the small text addition unless you say otherwise.)

## 7. How to Earn Points card

Centered narrow column inside a wide card leaves big empty side gutters on desktop.

- Switch inner container from `max-w-md mx-auto` to a 2-column grid at `md:` (one-time earns left, repeatables right) with a divider. Mobile stays single-column.
- Drops the section height by ~40% on desktop.

## 8. Referral Link card

The mock "Preview when shared" social-card mock here is good, but on mobile the `aspect-[1.91/1]` image + 3 lines of text + 2 helper paragraphs make the section taller than the actual referral link box that's the point of the card.

- Move the share-preview mock behind a `Show preview` collapsible (closed by default on mobile, open on desktop).
- Or: shrink it to `max-w-sm` and reduce the image aspect from `1.91/1` to `2/1` so it's flatter.

## 9. Follow Us & Earn Points

Three buttons in a `grid-cols-3` with hidden labels under `sm:` — on a 360px phone the buttons become tiny icon-only circles, which makes "+pts" reward language invisible.

- Show points always (icon + `+25` even on mobile), drop the label only.
- Increase `h-12` → `h-14` for proper touch targets (per your 44px memory rule we're already at 48; this nudges to 56 for thumb comfort).

## 10. Interactive Story Preview iframe

`h-[600px] sm:h-[900px]` is intentionally large but on a 360×800 phone it eats the entire viewport.

- Cap mobile to `h-[520px]` and add a small "Open in full screen ↗" button above the iframe that opens the same URL in a new tab. (Just a link, no new feature work.)

## 11. Impact + Coming Up cards at bottom

These two cards both use rounded purple gradients and stack — feels like a soft outro but the gap between them is `space-y-4` (mobile) which is too tight for two visually heavy cards.

- Bump bottom-section spacing: wrap the last 3 cards (`Impact`, `Coming up`) in `space-y-6 sm:space-y-8`.
- Add `mb-2` to the bottom `<div className="h-8" />` so there's clean breathing room before the page ends.

## 12. Global spacing rhythm

Page content currently uses `space-y-4 sm:space-y-6` between every card. After the changes above, sections vary in weight; bumping that to `space-y-5 sm:space-y-7` makes the rhythm feel intentional without ballooning the page.

---

## Files touched

- `src/components/waitlist/SharePostFlow.tsx` — items 1, 2, 3
- `src/pages/StoryProsDashboard.tsx` — items 4, 5, 6, 7, 8, 9, 10, 11, 12

## What I will NOT change without asking

- Any copy/wording (other than the small subtitle nudge in item 4).
- Section ordering on the page.
- Tier logic, point values, RewardsInventory internals, ScriptCarousel internals.
- Backend, hooks, or Supabase calls.

## Out of scope (flag only)

- The `coinBalance` calc still uses only `COIN_DROPS[2]` — looks like a stub. Not touching unless you want it fixed.
- The Profile dropdown's "Verified ✓ (+50 pts awarded)" line could become a proper badge — not touching this round.
