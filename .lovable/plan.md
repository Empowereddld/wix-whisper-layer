# Parent Guidebook campaign banner

## Landing page URL (confirmed)
`https://www.empowereddld.com/shop/parent-guidebook` exists and the $9.99 USD checkout is connected. One caveat: a real test purchase (download + receipt email) has not been done yet. The link will not be broken, but I recommend doing one test purchase before publishing the banner.

## What changes
- Banner text: "Not sure how to talk to your child about DLD? Our Parent Guidebook can help →"
- Background: deep burgundy #762C49 with white text (contrast about 9.6:1, well above the accessibility minimum).
- Whole banner links to the Parent Guidebook page; the X still dismisses only, without navigating.
- Same height, position, font, spacing and dismiss behaviour as today. On mobile the text wraps to two lines at the current small size instead of squeezing.
- During the campaign this message shows to everyone, replacing the Story Pros waitlist and referral messages. The banner stays hidden on the guidebook page itself (as now).
- The banner appears on every page, as it does today; nothing else on the homepage changes.

## Easy restore after 60 days
The original Story Pros banner (text, teal colour, logged-in variants) stays in the code untouched. The campaign is a single on/off switch, so switching back is a one-line change. Dismissals use a new key, so visitors who closed the Story Pros banner will still see the campaign once.

## Review
Preview only. I will check desktop and mobile (390px), then wait for your OK before publishing.

## Technical details
- `AnnouncementBar.tsx`: add `CAMPAIGN_ACTIVE` flag + `GUIDEBOOK_CAMPAIGN` config (text, `to`, `bg-campaign`, storage key); existing Story Pros logic kept as the fallback branch.
- `index.css` / `tailwind.config.ts`: add `--campaign: 336 46% 32%` token (#762C49).
- Update announcement-bar memory to record the approved temporary campaign wording.
