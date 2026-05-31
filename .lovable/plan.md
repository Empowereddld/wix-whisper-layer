# Tier 1: Waitlist Email Monitoring

Ship the alert system + smoke-test habit. No dashboard, no automated tests.

## 1. Migration — `waitlist_healthcheck_monitoring.sql`

Two new tables (auth-only, RLS on, GRANTs included):

- **`waitlist_healthcheck_state`** — single row, 4 timestamp columns for per-check 6-hour cooldown (`check1_last_alert_at`, `check2_last_alert_at`, `check3_last_alert_at`, `check4_last_alert_at`).
- **`waitlist_healthcheck_runs`** — append-only paper trail. Columns: `id`, `ran_at`, `checks_tripped` (jsonb of which checks tripped + counts), `alert_sent` (bool), `alert_send_error` (text, null on success). Independent of email delivery so you can audit even when Resend is down.

## 2. Expanded `supabase/functions/waitlist-email-healthcheck/index.ts`

Runs all 4 checks every invocation. Thresholds tightened:

| # | Check | Threshold |
|---|---|---|
| 1 | Stuck unverified (>26h, no reminder 1) | **> 2** |
| 2 | Verified >30min, no Welcome sent | **> 0** |
| 3 | Reminder sent to already-verified user | **> 0** |
| 4 | Bounces/complaints/dlq in 24h, or auth-gate 403 | **> 5 / any 403** |

Per-check 6-hour cooldown via `waitlist_healthcheck_state`. Every run writes one row to `waitlist_healthcheck_runs` regardless of outcome.

**Alert delivery (consolidated digest):** If one or more checks trip and none are cooling down, send **one** email to `hello@empowereddld.com` via existing `send-email` (Resend). Subject: `[ALERT] Waitlist health: N check(s) failing`. Body lists each tripped check with count + suggested action.

**Monitor-the-monitor fallback:** If alert email send fails (Resend down, 5xx), function returns **HTTP 500** and writes `alert_sent=false` + `alert_send_error` to the runs row. The hourly cron retains the failure in pg_cron's `cron.job_run_details` (visible via DB), giving you an independent trail even if no email ever arrived.

## 3. Cron update

Switch existing `waitlist-email-healthcheck` pg_cron from daily → **hourly** via insert tool.

## 4. `EMAIL_SMOKE_TEST.md` (new, repo root)

Top section (future-you note):
- This system runs hourly. **Normal = silence in your inbox.**
- **Concerning = email with subject starting `[ALERT] Waitlist health:`** — open it, it lists what tripped and what to check.
- If you suspect silent failure (no alerts for weeks + something feels off), query `waitlist_healthcheck_runs` for recent rows where `alert_sent=false`.

Then the 5-step manual smoke test (run before any waitlist/email change ships):
1. Sign up with a real Gmail
2. Receive verification email within 2 min
3. Click link → land on dashboard
4. Receive Welcome email within 2 min
5. Admin row shows `email_verified=true`, `welcome_sent_at` set, `points >= 25`; retry signup shows friendly "already verified" state

## Build order

1. Migration (2 tables + GRANTs + RLS)
2. Expand edge function
3. Update pg_cron to hourly (insert tool)
4. Write `EMAIL_SMOKE_TEST.md`
5. Deploy edge function
6. Manually invoke function once; confirm HTTP 200 and one row in `waitlist_healthcheck_runs`

## Files changed

```
supabase/migrations/<ts>_waitlist_healthcheck_monitoring.sql   NEW
supabase/functions/waitlist-email-healthcheck/index.ts         EXPANDED
EMAIL_SMOKE_TEST.md                                            NEW
pg_cron job                                                    UPDATED (hourly)
```

## After it ships

Live with it 2 weeks. Useful and quiet → done. Still feeling exposed → revisit Tier 2 with real data.
