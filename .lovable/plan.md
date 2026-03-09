

## Plan: Complete Admin Panel for Empowered DLD

This is a comprehensive admin dashboard with 9 sections for internal use. I'll create a protected admin area with role-based access control using a **separate user_roles table** (per security best practices).

### Database Changes Required

**New Tables:**
1. `user_roles` — admin role tracking (admin | moderator | user)
2. `blog_posts` — title, slug, body, featured_image_url, status, published_at
3. `orders` — shell table for future e-commerce (order_id, customer_name, email, product, amount, status)
4. `discount_codes` — shell table (code, percent_off, expiry_date, uses_remaining, is_active)
5. `email_campaigns` — subject, body, audience, sent_at, recipient_count
6. `audit_logs` — admin_id, action, timestamp (read-only log)
7. `user_notes` — user_id, note, created_by, created_at

**New Storage Buckets:**
- `resources` — for PDF uploads
- `thumbnails` — for resource/blog thumbnails

**Security:**
- Create `has_role()` security definer function to check admin status
- RLS policies on all tables restricting admin actions to admin users only

### File Structure

```text
src/
├── pages/admin/
│   ├── AdminDashboard.tsx      (/admin)
│   ├── AdminResources.tsx      (/admin/resources)
│   ├── AdminUsers.tsx          (/admin/users)
│   ├── AdminAnalytics.tsx      (/admin/analytics)
│   ├── AdminBlog.tsx           (/admin/blog)
│   ├── AdminOrders.tsx         (/admin/orders)
│   ├── AdminDiscounts.tsx      (/admin/discounts)
│   ├── AdminEmails.tsx         (/admin/emails)
│   └── AdminAuditLog.tsx       (/admin/audit)
├── components/admin/
│   ├── AdminLayout.tsx         (sidebar + header shell)
│   ├── AdminSidebar.tsx        (collapsible nav)
│   ├── AdminProtectedRoute.tsx (role check wrapper)
│   ├── ResourceForm.tsx        (add/edit resource modal)
│   ├── UserDetailDrawer.tsx    (user profile + downloads)
│   ├── PostForm.tsx            (add/edit blog post)
│   └── StatsCard.tsx           (dashboard metric cards)
└── hooks/
    ├── useAdminStats.ts        (dashboard metrics)
    ├── useAdminResources.ts    (CRUD with all resources)
    ├── useAdminUsers.ts        (user list + search)
    └── useAuditLog.ts          (log admin actions)
```

### Route Updates (App.tsx)

```text
/admin                → AdminDashboard
/admin/resources      → AdminResources
/admin/users          → AdminUsers
/admin/analytics      → AdminAnalytics
/admin/blog           → AdminBlog
/admin/orders         → AdminOrders
/admin/discounts      → AdminDiscounts
/admin/emails         → AdminEmails
/admin/audit          → AdminAuditLog
```

All routes wrapped in `AdminProtectedRoute` which checks `has_role(auth.uid(), 'admin')`.

### Key Features by Section

1. **Dashboard** — Stats cards (total users, downloads, resources) + recent signups table + top downloads table
2. **Resource Manager** — Full CRUD, thumbnail/file upload to Supabase storage, publish toggle, search/filter
3. **User Manager** — Paginated user table, click-to-open drawer with downloads + notes, CSV export
4. **Analytics** — Recharts line/bar/pie charts pulling live data with date range toggles
5. **Blog** — Simple post CRUD with rich text (textarea for MVP), slug auto-generation
6. **Orders/Discounts** — Shell tables with empty states ("No orders yet")
7. **Emails** — Audience selector, subject/body fields, sent history table
8. **Audit Log** — Read-only table of admin actions

### Design Approach

- **Sidebar:** Fixed left nav with icons + labels, collapsible to icon-only on small screens
- **Tables:** Paginated (25 rows), sortable, with search/filter controls
- **Modals/Drawers:** Sheet component for forms (add/edit resource, user details)
- **Muted palette:** Same brand colors but softer/more neutral for backend feel
- **Loading/Empty states:** Skeletons on load, friendly empty state messages

### Implementation Order

1. Database migration (all tables, functions, RLS, storage buckets)
2. AdminProtectedRoute + AdminLayout + AdminSidebar
3. AdminDashboard with stats hooks
4. Resource Manager (most critical feature)
5. User Manager + CSV export
6. Analytics with Recharts
7. Blog Manager
8. Shell pages (Orders, Discounts, Emails, Audit)

