## New resource to add

**Title:** Supporting a Child with DLD: A Guide for Tutors
**Audience tags:** Educators, Parents, Therapists
**Type:** Guide
**Status:** Published
**Card blurb (description):** A gentle, practical guide to help tutors understand DLD and support a child's learning, confidence, and communication.

The longer copy (short + full description + "Who Is This For") lives in the resource's description field so it shows on the resource detail modal.

## Will it look the same as the other resources?

Yes, identical. It uses the same `ResourceCard` component every other resource uses:

- Thumbnail image on top
- Title
- Audience chips (Educators · Parents · Therapists)
- 3-line truncated blurb
- Save / Download / View buttons

No new component, no custom styling, no layout variant. It slots into the Hub grid exactly like the existing resources. The only visual difference is the automatic "New" badge in the corner.

## About the "New" badge

Automatic and per-user, no manual expiry:

- Shows "New" to a signed-in user when the resource was created **after** their account was created **and** they haven't viewed it yet.
- Disappears for them as soon as they open or download it.
- For anyone who signs up after we add this, it won't show as "New".

Effectively: it stays "New" for each existing user until they click it. Nothing to configure.

## Steps

1. Wait for you to send the preview image and the PDF.
2. Upload the image to the `thumbnails` bucket and the PDF to the `resources` bucket.
3. Insert one row into the `resources` table with the fields above (`roles = ['educator','parent','slp']`, `resource_type = 'guide'`, `is_published = true`).
4. Verify it appears in the Hub dashboard for the relevant audiences and that the "New" badge shows for existing accounts.

## Not doing

- No schema changes (no new "tutor" tag, no manual "new until" field).
- No changes to card layout or copy elsewhere on the site.

Send over the preview image and PDF whenever ready and I'll do the upload + insert in one go.
