# StoryBuilders Admin Dashboard - Quick Start Guide

## Access
- **URL:** `/admin/storybuilders` (requires admin login)
- **Location in Sidebar:** Under "StoryBuilders" in the admin navigation

## Main Dashboard Areas

### 1. Overview Tab
**What You See:**
- Total signups, verification rate, average referrals per user
- Week and today's signup counts
- 30-day signup trend line chart
- Top 5 referrers with their contact info and tier

**Use When:** You want a high-level view of waitlist health and performance

### 2. Users Tab
**What You See:**
- Full list of all waitlist users
- Sortable/searchable table with 10 columns:
  - Name, Email, Referral Code, Points, Tier, Referrals, Verified, Flagged, Joined Date

**Quick Actions:**
- Search by name, email, or referral code
- Filter by tier (dropdown)
- Sort by Points, Name, or Date
- Export all visible users to CSV
- Send bulk email to selected recipients
- Flag/Unflag individual users
- Click any row to open full user details

**Click User for:**
- Full profile view
- Points and tier progression bar
- Referral code and link (copy buttons)
- Send email from templates
- Flag status toggle
- Manually adjust points

### 3. Referrals Tab
**What You See:**
- Total referral chains active
- Total referrals made
- Average referrals per user
- Metrics on referral network health

**Use When:** Analyzing referral performance and growth

### 4. Fraud Tab
**What You See:**
- Flagged users with risk scores
- Fraud detection reason
- Date detected
- Risk level coloring (red = high, orange = medium)

**Quick Actions:**
- Filter by risk level (all, high 80+, medium 50-79)
- Dismiss individual fraud alerts
- Click email to find user

**Use When:** Reviewing suspicious activity and manual verification

### 5. Emails Tab
**What You See:**
- Last 100 emails sent to users
- Recipient, template type, status, sent date
- Open and click tracking timestamps

**Quick Actions:**
- Click "Compose Email" to send new batch
- Filter by status or template type
- See delivery and engagement metrics

**Use When:** Checking email performance or sending announcements

### 6. Suggestions Tab
**What You See:**
- 4-column Kanban board: New | Under Review | Planned | Done
- Each card shows:
  - Title and description (expandable)
  - Category badge
  - Vote count
  - Submitter

**Actions:**
- Expand any card to see full details
- Change status via dropdown (appears when expanded)
- See vote count and submission date

**Use When:** Managing community feature requests and feedback

### 7. Settings Tab
**What You See:**
- Placeholder for future settings
- Will control tier rewards, point values, launch dates, community milestones

---

## Common Workflows

### Send Email to All Verified Users
1. Go to **Users** tab
2. Click "Email" button in top right
3. Select recipient filter: "Verified Only"
4. Choose template (or customize)
5. Edit subject and body if needed
6. Click "Preview" to check it
7. Click "Send to X" to confirm and dispatch
8. Check **Emails** tab later to track opens/clicks

### Find a Specific User
1. Go to **Users** tab
2. Type their name, email, or referral code in search box
3. Click on their row
4. View full profile in modal

### Export User List
1. Go to **Users** tab
2. Apply any filters (tier, verification status, etc.)
3. Click "Export CSV"
4. File downloads as `storybuilders-waitlist-[timestamp].csv`

### Adjust a User's Points
1. Go to **Users** tab
2. Click on the user row
3. In the Points section, click "Edit Points"
4. Enter new point value
5. Click "Save"
6. Modal closes and user is updated

### Review Fraud Alerts
1. Go to **Fraud** tab
2. Use risk level filter if needed
3. Review the reason and email
4. If legitimate, click "Dismiss"
5. If suspicious, find user in Users tab and Flag them

### Move Suggestion to Next Stage
1. Go to **Suggestions** tab
2. Click any card to expand it
3. Use the Status dropdown (appears when expanded)
4. Select new status: New → Under Review → Planned → Done
5. Card moves to new column automatically

---

## Key Metrics to Monitor

### Health Indicators
- **Total Signups:** Overall waitlist size
- **Verified %:** Email verification rate (higher is better)
- **Avg Referrals:** How many others each person is inviting (growth indicator)
- **This Week:** Signup velocity
- **Top Referrers:** Who's driving growth (reward these users!)

### Warning Signs
- Verification rate dropping (email verification issue?)
- Low average referrals (engagement problem?)
- Many fraud alerts (bot activity?)
- Emails bouncing (bad data?)

---

## Tips & Tricks

### Filters Work Together
- Search for "John" AND filter by "Champion" tier → Find all Champions named John
- Filters are additive, not exclusive

### Bulk Operations
- Export before any major change to have a backup
- Emails are sent in batches automatically
- Large exports may take 10-30 seconds

### Email Personalization
- Use `{name}` in subject or body to auto-insert first names
- Templates come pre-filled; customize as needed
- Preview shows "John" as sample name

### User Details Modal
- Use copy buttons for referral code and link
- Adjust points one at a time for individual users
- Flag for manual review if something seems off
- Can send emails directly from this modal

### Table Management
- Click column header to sort (if clickable)
- Use search + filters before export for targeted CSVs
- Scroll right on mobile to see all columns
- Click row to see full details

---

## Status Badges

### Verification Status
- ✓ **Green checkmark** = Email verified
- ✗ **Gray X** = Not yet verified

### Flagged Status
- ⚠️ **Warning icon** = User flagged for review

### Tier Colors
- Gray = Storyteller (0 points)
- Purple = Advocate (35+ points)
- Blue = Champion (85+ points)
- Amber = Hero (135+ points)
- Red = Legend (260+ points)
- Deep Purple = Founding Elite (510+ points)

### Email Status
- Green badge = "Sent"
- Red badge = "Failed"
- Blue badge = "Pending"

### Fraud Risk Level
- Red badge = High (80+)
- Orange badge = Medium (50-79)
- Gray badge = Low (0-49)

---

## Troubleshooting

### Table Is Empty
- Check internet connection
- Verify you're signed in as admin
- Try refreshing the page
- Check Supabase status

### Email Not Sending
- Confirm recipients exist (check count)
- Try sending to verified-only first
- Check the Emails tab for error status
- May take 1-2 minutes to process large batches

### Can't Find a User
- Try searching by email instead of name
- Try partial email (e.g., "john@" instead of full address)
- Check if they're in a specific tier filter
- Use browser Find (Ctrl+F) to search the current table

### Chart Not Loading
- Ensure table has data (check user count)
- Wait for initial load to complete
- Scroll down if chart is below fold
- Try refreshing the page

### Fraud Alerts Too Noisy
- Filter to "High Risk" only to focus on real issues
- Dismiss obviously legitimate users
- Consider lowering sensitivity in backend (future feature)

---

## Best Practices

1. **Regular Exports**
   - Export user list weekly as backup
   - Save with date in filename

2. **Flag for Review**
   - Flag any suspicious patterns
   - Document why you flagged them
   - Review flagged users weekly

3. **Email Cadence**
   - Don't email same users too frequently
   - Use different templates for variety
   - Check open rates before sending again

4. **Suggestion Management**
   - Respond to highly-voted suggestions
   - Move through workflow regularly
   - Share "Done" updates with community

5. **Performance Monitoring**
   - Check overview metrics daily
   - Watch for sudden drops or spikes
   - Review fraud alerts weekly
   - Archive old emails monthly

---

## Keyboard Shortcuts

- **Search Focus:** Click search box, type, press Enter
- **Close Modal:** Press Escape
- **Table Navigation:** Arrow keys to move between rows
- **Copy:** Click copy button next to code/link
- **Scroll:** Mouse wheel or track pad

---

## Support

For issues or questions:
1. Check the main documentation: `ADMIN_STORYBUILDERS_DASHBOARD.md`
2. Verify Supabase is online
3. Check browser console for errors (F12)
4. Reach out to engineering team with error details

---

## Version
- **Created:** April 2026
- **Last Updated:** April 2026
- **Dashboard Version:** 1.0

Enjoy managing the StoryBuilders waitlist! 🚀
