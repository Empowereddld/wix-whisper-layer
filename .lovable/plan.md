# Story Pros email flow — live check + next steps

## What I found (live)

**Pipeline is healthy overall.** Story Pros sends go through Resend from `hello@mail.empowereddld.com`, independent of the failed `notify.empowereddld.com` domain.

- Verification + Welcome (Email 1): last 3 verified signups (7/17, 7/21, 7/22) all have `welcome_sent_at` set within seconds of verify. Working.
- Day-2 follow-up (Email 2 "Points & Tiers"): 203 sent historically, but **1 pending failure right now** — epfenick@gmail.com. Edge logs show `403 Forbidden — Blocked unauthorized send-waitlist-email call (template=email2_points_tiers)`.
- Root cause: `send-waitlist-email2` (the cron dispatcher) invokes `send-waitlist-email` via `supabase.functions.invoke`, which relies on the service-role key matching. After the recent signing-keys/key rotation, that check is no longer reliable. The dispatcher already has `CRON_SECRET` but doesn't forward it.
- `waitlist_healthcheck_runs` table is empty — the hourly monitor described in EMAIL_SMOKE_TEST.md isn't producing rows. Worth a quick look but out of scope for this fix.

## Should we fix notify.empowereddld.com?

**No urgency, but yes eventually — and cheaply.**

- Today nothing in production depends on it. Story Pros waitlist, hub welcome, webhook events all send via Resend on `mail.empowereddld.com`.
- It only matters if we later want Lovable-managed auth emails or app emails on that subdomain. If we don't plan to, we can just delete the failed domain to stop it showing "Failed" in settings.
- If we do want to keep it as a future option, re-verification requires adding these DNS records at the registrar (nameserver pair is per-domain, exact values shown in Project Settings → Email): one TXT `_lovable-email.empowereddld.com` and NS records for `notify.empowereddld.com` pointing to `ns3.lovable.cloud` / `ns4.lovable.cloud`.

Recommendation: delete the failed `notify.` domain now to remove the red status, and revisit only if we ever move off Resend.

## Fix (small, day-2 email only)

Edit `supabase/functions/send-waitlist-email2/index.ts`: when calling `supabase.functions.invoke("send-waitlist-email", ...)`, pass the cron secret explicitly so the trusted-caller check always succeeds regardless of key rotation:

```ts
await supabase.functions.invoke("send-waitlist-email", {
  headers: { "x-cron-secret": Deno.env.get("CRON_SECRET")! },
  body: { template: "email2_points_tiers", to: user.email, data: {...} },
});
```

Then manually re-trigger the day-2 dispatcher once so epfenick's pending Email 2 goes out.

## Out of scope (flag for later)

- `waitlist_healthcheck_runs` is empty — the hourly monitor may not be scheduled anymore. Worth a separate check so alerts actually fire next time something breaks.
- Deleting the failed `notify.empowereddld.com` domain is a Settings action, not a code change — I'll walk you through it if you want to do it now.

Approve and I'll apply the one-line fix and re-run the dispatcher.
