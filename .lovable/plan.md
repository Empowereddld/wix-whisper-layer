# Batch 4 Plan

Same approach as Batches 1-3: do them in order, confirm each before moving on.

## Findings before we change anything

- **Realtime publication confirmed**: `storybuilders_waitlist` IS in the `supabase_realtime` publication. RLS is enabled and the only SELECT policy is admin-only, so Postgres Changes will only deliver row payloads to subscribers whose JWT satisfies `has_role(auth.uid(),'admin')`. Anon and signed-in non-admin subscribers receive zero events. That said, the scanner flags this because (a) the table contains very sensitive fields (`email`, `verification_token`, `deleted_reason`), and (b) any future loosening of the SELECT policy would silently start broadcasting them. The safest move is to remove the table from the publication. Trade-off documented below.
- **suppressed_emails**: there are two INSERT policies — `"Anyone can unsubscribe"` (anon + authenticated, `WITH CHECK true`) and `"Service role can insert suppressed emails"`. Dropping the first leaves the service-role path intact, which is what `email-unsubscribe` uses.
- **resources.file_url leak confirmed**: 5 rows currently store `resources-private/...` paths in the anon-readable column. `generate-download-url` already handles the `resources-private/` prefix correctly, so the server side is fine — only the public column needs to be scrubbed.
- **Client coupling**: `src/lib/secureDownload.ts` decides whether to call the edge function by checking `fileUrl.startsWith("resources-private/")`. Once we hide that path from anon, the client needs a different signal. We'll add an `is_private` boolean column for the client to read.

## Fix 9 — Realtime on storybuilders_waitlist

**Change**: a schema-only migration that runs `ALTER PUBLICATION supabase_realtime DROP TABLE public.storybuilders_waitlist`.

**Trade-off**: three components currently subscribe to live changes on this table:
- `src/components/waitlist/ReferralTracker.tsx` (live referral count)
- `src/components/waitlist/ActivityFeed.tsx` (live activity feed)
- `src/hooks/useStorybuildersWaitlist.ts` (dashboard auto-refresh)

After this change, those `.subscribe()` calls will still succeed but no events will arrive. The data stays correct on initial load and on manual refresh / route changes — it just won't update live. The user explicitly said "either disable Realtime on that table or ensure RLS filters apply", so this matches the stated acceptance criteria. We are NOT touching the components themselves in this batch (out of scope per "don't touch anything outside these fixes").

**Confirm**: re-run `SELECT * FROM pg_publication_tables WHERE pubname='supabase_realtime'` and verify `storybuilders_waitlist` is gone.

## Fix 10 — Lock down suppressed_emails INSERT

**Change**: a schema-only migration that drops the `"Anyone can unsubscribe"` INSERT policy. The `"Service role can insert suppressed emails"` policy stays, so `email-unsubscribe` (which uses the service role key) keeps working.

I checked `supabase/functions/email-unsubscribe/index.ts` is in the function list and uses the service role pattern, so no function code changes are needed. If when I open it I find it's using the anon key for the insert, I'll flip it to service role inside this same fix — that would be the only client-side touch and it's required for the policy drop to not break unsubscribe.

**Confirm**: re-run the security scan or `supabase--linter`, and read `pg_policies` for `suppressed_emails` to verify the anon policy is gone.

## Fix 11 — Strip private file paths from the public resources table

**Schema migration**:
1. `ALTER TABLE public.resources ADD COLUMN private_file_path text` (admin/service-role only — same table RLS already covers writes; reads are gated by the existing "Anyone can view resources" SELECT, which we will narrow below).
2. `ALTER TABLE public.resources ADD COLUMN is_private boolean NOT NULL DEFAULT false`.
3. Backfill: for every row where `file_url LIKE 'resources-private/%'`, copy `file_url` into `private_file_path`, set `is_private = true`, and set `file_url = NULL`.
4. Replace the `"Anyone can view resources"` policy with one that returns all columns except `private_file_path` to anon/authenticated. Postgres RLS can't hide individual columns, so we'll instead:
   - Keep RLS on `resources` as-is for SELECT (anon can read rows), AND
   - `REVOKE SELECT (private_file_path) ON public.resources FROM anon, authenticated;`
   - `GRANT SELECT (private_file_path) ON public.resources TO service_role;` (admins read via service role / RPC; the admin UI doesn't need this column to render the list — see step 6).

**Edge function change** (`supabase/functions/generate-download-url/index.ts`):
- Update the `select` to `"id, file_url, private_file_path, is_private, title"`.
- Prefer `private_file_path` when `is_private = true`; fall back to the legacy `file_url` path-prefix logic so we don't break any unmigrated rows.

**Client change** (`src/lib/secureDownload.ts`):
- Change the signature from `(resourceId, fileUrl)` to `(resourceId, opts: { fileUrl: string | null; isPrivate: boolean })`.
- Route to the edge function when `isPrivate === true`; otherwise open `fileUrl` directly.
- Update the two callers (`src/pages/hub/ResourceDetail.tsx:88`, `src/pages/hub/HubDashboard.tsx:85`) to pass `{ fileUrl: r.file_url, isPrivate: r.is_private }`.

**Admin UI**: `AdminResources.tsx` only uploads to the public `resources` bucket (writes a public URL into `file_url`). It doesn't touch private rows, so no admin-side changes needed for this batch. If admins later need to attach private files, that's a separate workstream.

**Confirm**:
- `SELECT id, file_url, private_file_path, is_private FROM resources WHERE is_private;` — verify `file_url` is NULL and `private_file_path` is populated for the 5 known rows.
- `supabase--read_query` as anon (simulated via a query that selects `private_file_path` from `resources`) should fail with a permission error; selecting `file_url` should still succeed for those rows but return NULL.
- Smoke check: open one paid resource detail page → "Download" → confirm the edge function still issues a signed URL.

## Scope guardrails

- No other files touched.
- No data writes beyond the one-time backfill of `private_file_path` / `is_private` inside the Fix 11 migration.
- The 68 warnings (SECURITY DEFINER EXECUTE grants, search_path, public bucket listing, extension-in-public) are explicitly NOT in scope.
- No changes to the live components that subscribe to Realtime on `storybuilders_waitlist` — they will silently stop receiving live updates, as accepted in Fix 9.
