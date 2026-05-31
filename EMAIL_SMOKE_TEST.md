# Email Smoke Test

## How the alert system works (read this if you've been away)

There's an automated health monitor that runs **every hour** watching the waitlist email pipeline. It checks four things:

1. Are users getting stuck unverified with no reminder sent?
2. Are verified users missing their Welcome email?
3. Are reminders accidentally being sent to people who already verified?
4. Are emails bouncing, or is the auth gate to `send-waitlist-email` returning 403?

### What's normal vs. concerning

- **NORMAL = silence.** No emails from the monitor = everything's working. No news is good news here.
- **CONCERNING = an email arrives with subject starting `[ALERT] Waitlist health:`**
  - Open it. It lists which check(s) tripped, the count, and a suggested action.
  - Each check has a 6-hour cooldown so you won't get spammed if something stays broken.
- **PARANOID CHECK** (if you suspect a silent failure, e.g. no alerts in weeks but something feels off):
  - Look at the `waitlist_healthcheck_runs` table in the database.
  - Rows where `alert_sent = false` AND `checks_tripped` shows a tripped check mean an alert should have fired but the email send failed (likely Resend was down). Look at `alert_send_error`.
  - Also: cron's own `cron.job_run_details` records HTTP 500 from the monitor, so a missing-email + 500-status combo is a sure sign.

Alerts go to: **hello@empowereddld.com**

---

## Manual smoke test (run before shipping any waitlist or email change)

Takes ~5 minutes. Catches the recurring incident class before users see it.

1. **Sign up** with a real Gmail address (not a throwaway, not one already in the waitlist).
2. **Receive verification email** within 2 minutes. Open Gmail, find it, click the verification link.
3. **Land on the dashboard** at `/storypros/dashboard`. Should show your name, referral code, points.
4. **Receive Welcome email** within 2 minutes after verifying.
5. **Check the admin row** for that signup in the waitlist table:
   - `email_verified = true`
   - `verified_at` is set
   - `welcome_sent_at` is set
   - `points >= 25` (signup + verify bonus)
6. **Retry signup** with the same email. Should show the friendly "looks like you're already on the list" state, not an error.

If any step fails, fix it before merging. Don't trust "it worked last time."
