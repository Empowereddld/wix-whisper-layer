

## Upload & Secure Dan and Daria's Graphic Organizers PDF

### Current State
- Resource record exists (id: `31f2e93e-7b0e-4750-9be5-e8ef9ebc35f3`) with no `file_url`
- Product record exists: **$5.99 USD**, active
- The paywall UI is already wired up (Unlock button → PurchaseModal → purchases table → Download button)

### The Problem
The `resources` storage bucket is **public**. If we upload the PDF there, anyone with the direct URL can download it — completely bypassing the paywall. This defeats the purpose of charging for it.

### Plan

**Step 1 — Upload the PDF** to the existing `resources` bucket and update the `file_url` on the resource record.

**Step 2 — Secure paid file downloads** by switching from direct public URLs to **signed URLs generated server-side**:

1. Create a new backend function (`generate-download-url`) that:
   - Verifies the user is authenticated
   - Checks the `purchases` table to confirm the user has bought the resource (or it's free)
   - Generates a short-lived signed URL (e.g. 60 seconds) for the file
   - Returns it to the client

2. Move paid PDFs to a **private** storage bucket (or make the existing bucket private and keep free files accessible via signed URLs too for consistency).

3. Update the frontend download handler to call the backend function instead of opening `file_url` directly.

This ensures paid PDFs can only be downloaded by users who have completed a purchase.

### What stays the same
- The purchase flow (PurchaseModal, purchases table) — no changes needed
- The UI (price badges, Unlock/Download buttons) — no changes needed
- Free resources can continue working the same way (signed URLs work for them too)

### Technical Details

**Backend function** (`supabase/functions/generate-download-url/index.ts`):
- Accepts `resource_id` in the request body
- Uses the service role key to check purchases and generate signed URLs from the private bucket
- Returns `{ url: "..." }` or 403 if not purchased

**Database migration**: Create a private `resources-private` bucket for paid files (or toggle the existing bucket to private).

**Frontend change**: Update `handleDownload` in `ResourceDetail.tsx` and `ResourceCard.tsx` to call the backend function instead of `window.open(file_url)`.

