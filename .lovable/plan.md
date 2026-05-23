## Goal
Restore empowereddld.com — currently blank due to a stale production bundle built without `VITE_SUPABASE_URL`.

## Root cause
The deployed bundle (`index-Y07a9g8G.js`) was compiled before the Supabase env vars were present, so `createClient(undefined, undefined)` throws `supabaseUrl is required` and React never mounts. The current project state has the vars set correctly, so the bundle just needs to be rebuilt and re-deployed.

## Verification already done
- `.env` contains `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` (all set)
- `src/integrations/supabase/client.ts` reads those vars correctly (file is auto-generated, untouched)
- `supabase/config.toml` references project `haafpznzuazanylcelse`
- Lovable Cloud backend reports healthy
- No code changes needed

## Steps
1. **(You) Click Publish → Update** in the editor (top-right on desktop, or "…" menu → Publish on mobile). This triggers a fresh production build that bakes the current env vars into the bundle and deploys to empowereddld.com.
2. **(Me) After you publish**, I'll verify the live site by fetching it and confirming the bundle initializes without the `supabaseUrl is required` error.
3. If for any reason the new bundle still throws, I'll inspect the deployed JS to confirm whether the env vars actually got injected, and we'll escalate from there (could indicate a platform-level injection issue rather than a code issue).

## What I will NOT touch
- Security warnings panel
- `.env`, `src/integrations/supabase/client.ts`, `src/integrations/supabase/types.ts` (all auto-managed)
- Any feature code — this is purely a republish

## Confirmation
Per your request, I'm pausing here for your go-ahead. Reply "publish" (and click Publish → Update) and I'll verify the live site as soon as it's redeployed.
