import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  BookOpen,
  Settings,
  Users,
  Share2,
  Mail,
  Shield,
  Lightbulb,
  Gift,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Printer,
  Home,
  BarChart3,
  Search,
  TrendingUp,
  Lock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  subsections: string[];
}

const sections: Section[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Home,
    subsections: ["System Architecture", "First-Time Setup", "Access Admin Dashboard"],
  },
  {
    id: "dashboard-overview",
    title: "Dashboard Overview",
    icon: BarChart3,
    subsections: ["Key Metrics", "Analytics Chart", "Quick Actions"],
  },
  {
    id: "managing-users",
    title: "Managing Users",
    icon: Users,
    subsections: ["Search & Filter", "Column Meanings", "User Details", "Adjust Points", "Flag Users", "Export CSV"],
  },
  {
    id: "referral-system",
    title: "Referral System",
    icon: Share2,
    subsections: ["How It Works", "Point Awards", "6-Tier System", "Queue Positioning"],
  },
  {
    id: "email-system",
    title: "Email System",
    icon: Mail,
    subsections: ["Email Templates", "Bulk Announcements", "Email Metrics", "Webhook Setup", "Troubleshooting"],
  },
  {
    id: "fraud-protection",
    title: "Fraud Protection",
    icon: Shield,
    subsections: ["Fraud Checks", "Flagged Users", "Disposable Emails", "IP Rate Limiting", "Approval Decisions"],
  },
  {
    id: "suggestion-box",
    title: "Suggestion Box",
    icon: Lightbulb,
    subsections: ["Kanban Workflow", "Stage Movement", "User Voting"],
  },
  {
    id: "tier-rewards",
    title: "Tier Rewards Fulfillment",
    icon: Gift,
    subsections: ["Tier 0", "Tier 1-2", "Tier 3-4", "Tier 5"],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    icon: AlertCircle,
    subsections: ["Common Issues", "Recalculate Positions", "Email Issues", "Duplicate Handling"],
  },
];

const CodeBlock = ({ code }: { code: string }) => (
  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
    <code>{code}</code>
  </pre>
);

const CollapsibleSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-border rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted transition-colors"
      >
        <h4 className="font-semibold">{title}</h4>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && <div className="p-4 border-t border-border">{children}</div>}
    </div>
  );
};

const AdminWaitlistGuide = () => {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AdminLayout>
      <div className="flex gap-6 max-w-7xl mx-auto print:flex-col">
        {/* Sticky Sidebar TOC */}
        <aside
          className={`hidden lg:block flex-shrink-0 transition-all duration-300 print:hidden ${
            sidebarOpen ? "w-64" : "w-16"
          }`}
        >
          <div className="sticky top-20 bg-muted/40 rounded-lg border border-border p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold text-sm ${!sidebarOpen ? "hidden" : ""}`}>Sections</h3>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                {sidebarOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>

            {sidebarOpen && (
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      activeSection === section.id
                        ? "bg-purple-500/20 text-purple-700 font-medium border-l-2 border-purple-500"
                        : "text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <section.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{section.title}</span>
                    </div>
                  </button>
                ))}
              </nav>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">StoryBuilders Waitlist Admin Guide</h1>
              <p className="text-muted-foreground mt-2">Everything you need to run the viral waitlist system</p>
            </div>
            <Button onClick={handlePrint} variant="outline" size="sm" className="print:hidden">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>

          {/* Getting Started */}
          <section id="getting-started" className="mb-12 scroll-mt-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Home className="h-6 w-6 text-purple-700" />
              </div>
              <h2 className="text-3xl font-bold">Getting Started</h2>
            </div>

            <CollapsibleSection title="System Architecture">
              <p className="text-muted-foreground mb-4">
                The StoryBuilders waitlist is built on a serverless stack with three main components:
              </p>
              <ul className="space-y-2 mb-4 text-sm">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-1 text-purple-500 flex-shrink-0" />
                  <span>
                    <strong>Frontend:</strong> React dashboard for user signups and admin management
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-1 text-purple-500 flex-shrink-0" />
                  <span>
                    <strong>Backend:</strong> Supabase PostgreSQL database + Supabase Edge Functions for serverless logic
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-1 text-purple-500 flex-shrink-0" />
                  <span>
                    <strong>Email:</strong> Resend API for email delivery with webhook tracking
                  </span>
                </li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="First-Time Setup Checklist">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Supabase Migration</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Run migrations to create tables: waitlist_users, referral_codes, email_logs, suggestion_box, fraud_flags
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Resend API Key</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Set RESEND_API_KEY in Supabase Edge Function environment variables
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Deploy Edge Functions</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Deploy: storybuilders-signup, verify-email-waitlist, send-waitlist-email, check-fraud, track-referral-click
                    </p>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Access Admin Dashboard">
              <p className="text-sm text-muted-foreground mb-4">
                Admins access the StoryBuilders waitlist dashboard at <code className="bg-muted px-2 py-1 rounded">/admin/storybuilders</code>. This
                requires:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside">
                <li>Valid admin user (created in auth system)</li>
                <li>AdminProtectedRoute wrapper ensures access control</li>
                <li>Full CRUD permissions on all waitlist tables</li>
              </ul>
            </CollapsibleSection>
          </section>

          {/* Dashboard Overview */}
          <section id="dashboard-overview" className="mb-12 scroll-mt-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-700" />
              </div>
              <h2 className="text-3xl font-bold">Dashboard Overview</h2>
            </div>

            <CollapsibleSection title="Key Metrics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-semibold mb-2">Total Signups</p>
                  <p className="text-muted-foreground">Count of all email submissions</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-semibold mb-2">Verification Rate (%)</p>
                  <p className="text-muted-foreground">Verified emails / total signups × 100</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-semibold mb-2">Average Referrals</p>
                  <p className="text-muted-foreground">Mean referral count per user</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-semibold mb-2">Conversion Rate (%)</p>
                  <p className="text-muted-foreground">Percentage of signups reaching Tier 5</p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Analytics Chart">
              <p className="text-sm text-muted-foreground mb-4">
                The dashboard displays a time-series line chart showing daily signups, verifications, and referrals over the past 30 days.
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside">
                <li>Green line = daily signups</li>
                <li>Blue line = email verifications</li>
                <li>Purple line = referral clicks</li>
                <li>Hover over points for exact values</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Quick Actions">
              <p className="text-sm text-muted-foreground mb-4">
                The Overview tab provides quick access to common tasks:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-purple-500" /> Browse Users tab
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-purple-500" /> Send Email Announcement
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-purple-500" /> Review Flagged Users
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-purple-500" /> View Suggestions
                </li>
              </ul>
            </CollapsibleSection>
          </section>

          {/* Managing Users */}
          <section id="managing-users" className="mb-12 scroll-mt-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-700" />
              </div>
              <h2 className="text-3xl font-bold">Managing Users</h2>
            </div>

            <CollapsibleSection title="Search & Filter">
              <p className="text-sm text-muted-foreground mb-4">
                Use the search bar at the top of the Users table to filter by:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside mb-4">
                <li>Email address (partial match)</li>
                <li>Display name</li>
                <li>Referral code</li>
              </ul>
              <p className="text-sm text-muted-foreground mb-4">Additional filters:</p>
              <ul className="space-y-2 text-sm list-disc list-inside">
                <li>Tier (0-5)</li>
                <li>Verification status (verified / unverified)</li>
                <li>Fraud status (flagged / clean)</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Column Meanings">
              <div className="space-y-3 text-sm">
                <div className="p-3 border-l-4 border-purple-500 bg-muted/50 rounded">
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground text-xs">User's email address with verification status icon</p>
                </div>
                <div className="p-3 border-l-4 border-purple-500 bg-muted/50 rounded">
                  <p className="font-medium">Name</p>
                  <p className="text-muted-foreground text-xs">Display name (editable)</p>
                </div>
                <div className="p-3 border-l-4 border-purple-500 bg-muted/50 rounded">
                  <p className="font-medium">Points</p>
                  <p className="text-muted-foreground text-xs">Total points earned (signup + verify + referrals)</p>
                </div>
                <div className="p-3 border-l-4 border-purple-500 bg-muted/50 rounded">
                  <p className="font-medium">Tier</p>
                  <p className="text-muted-foreground text-xs">0-5, determines reward eligibility</p>
                </div>
                <div className="p-3 border-l-4 border-purple-500 bg-muted/50 rounded">
                  <p className="font-medium">Queue Position</p>
                  <p className="text-muted-foreground text-xs">Order for tier rewards (1 = highest tier, first in queue)</p>
                </div>
                <div className="p-3 border-l-4 border-purple-500 bg-muted/50 rounded">
                  <p className="font-medium">Referrals</p>
                  <p className="text-muted-foreground text-xs">Number of successful referral conversions</p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="View User Details">
              <p className="text-sm text-muted-foreground mb-4">
                Click a user row to open their detail modal. You can see:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside mb-4">
                <li>Full profile (email, name, phone)</li>
                <li>Account created date</li>
                <li>Email verification timestamp</li>
                <li>Referral code and link</li>
                <li>Complete point breakdown</li>
                <li>Fraud flags and history</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Adjust Points Manually">
              <p className="text-sm text-muted-foreground mb-4">
                In the user detail modal, use the "Adjust Points" button to manually add or remove points:
              </p>
              <CodeBlock code={`Example: Award bonus 50 points
Old: 120 points
New: 170 points
Reason: Bonus for social media share`} />
              <p className="text-sm text-muted-foreground mt-4">
                Changes recalculate the user's tier and queue position automatically.
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Flag/Unflag Suspicious Users">
              <p className="text-sm text-muted-foreground mb-4">
                Use the "Flag as Suspicious" button in user details. Choose a reason:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside">
                <li>Disposable email detected</li>
                <li>Duplicate account</li>
                <li>Suspicious referral pattern</li>
                <li>Manual review needed</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Flagged users appear in the Fraud Dashboard and can be manually approved or dismissed.
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Export CSV">
              <p className="text-sm text-muted-foreground">
                Click the "Export" button to download all users as CSV with full data including points, tier, verification status, and fraud flags.
              </p>
            </CollapsibleSection>
          </section>

          {/* Referral System */}
          <section id="referral-system" className="mb-12 scroll-mt-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Share2 className="h-6 w-6 text-orange-700" />
              </div>
              <h2 className="text-3xl font-bold">Referral System</h2>
            </div>

            <CollapsibleSection title="How Referral Codes Work">
              <p className="text-sm text-muted-foreground mb-4">
                Each user receives a unique referral code (e.g., "SB-A1B2C3"). They share this code with friends who:
              </p>
              <ol className="space-y-2 text-sm list-decimal list-inside mb-4">
                <li>Visit the signup page with the referral code in the URL</li>
                <li>Complete signup (points awarded to both)</li>
                <li>Verify email (referrer gets bonus points)</li>
              </ol>
              <p className="text-sm text-muted-foreground">
                Tracking uses encrypted URL parameters and IP validation to prevent fraud.
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Points Awarded">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                <div className="p-4 bg-muted rounded-lg border-l-4 border-orange-500">
                  <p className="font-semibold">Signup</p>
                  <p className="text-2xl font-bold text-orange-600">+10</p>
                  <p className="text-muted-foreground text-xs mt-1">User creates account</p>
                </div>
                <div className="p-4 bg-muted rounded-lg border-l-4 border-orange-500">
                  <p className="font-semibold">Email Verification</p>
                  <p className="text-2xl font-bold text-orange-600">+5</p>
                  <p className="text-muted-foreground text-xs mt-1">User confirms email</p>
                </div>
                <div className="p-4 bg-muted rounded-lg border-l-4 border-orange-500">
                  <p className="font-semibold">Referral Conversion</p>
                  <p className="text-2xl font-bold text-orange-600">+25</p>
                  <p className="text-muted-foreground text-xs mt-1">Referred friend verifies email</p>
                </div>
                <div className="p-4 bg-muted rounded-lg border-l-4 border-orange-500">
                  <p className="font-semibold">Social Share</p>
                  <p className="text-2xl font-bold text-orange-600">+2</p>
                  <p className="text-muted-foreground text-xs mt-1">User clicks share button (once per platform)</p>
                </div>
                <div className="p-4 bg-muted rounded-lg border-l-4 border-orange-500">
                  <p className="font-semibold">Link Click</p>
                  <p className="text-2xl font-bold text-orange-600">+1</p>
                  <p className="text-muted-foreground text-xs mt-1">Referral link visited</p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="6-Tier System with Thresholds">
              <div className="space-y-3 text-sm">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Tier 0 (Starter)</span>
                    <span className="text-purple-700 font-bold">0 points</span>
                  </div>
                  <p className="text-muted-foreground text-xs">Just signed up</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Tier 1</span>
                    <span className="text-purple-700 font-bold">35+ points</span>
                  </div>
                  <p className="text-muted-foreground text-xs">Verified + shared with friends</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Tier 2</span>
                    <span className="text-purple-700 font-bold">85+ points</span>
                  </div>
                  <p className="text-muted-foreground text-xs">Growing referral network</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Tier 3</span>
                    <span className="text-purple-700 font-bold">135+ points</span>
                  </div>
                  <p className="text-muted-foreground text-xs">Multiple successful referrals</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Tier 4</span>
                    <span className="text-purple-700 font-bold">260+ points</span>
                  </div>
                  <p className="text-muted-foreground text-xs">Strong viral advocate</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Tier 5 (VIP)</span>
                    <span className="text-purple-700 font-bold">510+ points</span>
                  </div>
                  <p className="text-muted-foreground text-xs">Top viral advocate - eligible for premium rewards</p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Queue Positioning">
              <p className="text-sm text-muted-foreground mb-4">
                Within each tier, users are ranked by points (highest first). This determines the order for reward fulfillment:
              </p>
              <CodeBlock code={`Tier 5 Queue Example:
1. Alice (850 points) → 1st to receive reward
2. Bob (720 points) → 2nd to receive reward
3. Carol (515 points) → 3rd to receive reward`} />
            </CollapsibleSection>
          </section>

          {/* Email System */}
          <section id="email-system" className="mb-12 scroll-mt-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Mail className="h-6 w-6 text-blue-700" />
              </div>
              <h2 className="text-3xl font-bold">Email System</h2>
            </div>

            <CollapsibleSection title="7 Email Templates & Triggers">
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-semibold">Welcome Email</p>
                  <p className="text-muted-foreground text-xs">Triggered: Signup completion</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-semibold">Verification Email</p>
                  <p className="text-muted-foreground text-xs">Triggered: Signup form submission</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-semibold">Referral Bonus Notification</p>
                  <p className="text-muted-foreground text-xs">Triggered: Friend verifies email</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-semibold">Tier Upgrade Announcement</p>
                  <p className="text-muted-foreground text-xs">Triggered: Points threshold reached</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-semibold">Reward Fulfillment</p>
                  <p className="text-muted-foreground text-xs">Triggered: Admin manually sends when reward is ready</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-semibold">Announcement (Bulk)</p>
                  <p className="text-muted-foreground text-xs">Triggered: Admin sends custom message</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-semibold">Account Verification Error</p>
                  <p className="text-muted-foreground text-xs">Triggered: Email verification fails</p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Bulk Announcements">
              <p className="text-sm text-muted-foreground mb-4">
                From the Emails tab, click "Send Announcement" to send a custom message to selected user segments:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside mb-4">
                <li>All users (entire waitlist)</li>
                <li>By tier (e.g., Tier 5 only)</li>
                <li>By verification status (verified/unverified)</li>
                <li>Custom list (select individual users)</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Messages support basic HTML formatting (bold, links, paragraphs). Preview before sending.
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Email Metrics">
              <p className="text-sm text-muted-foreground mb-4">
                The Email Logs tab shows delivery metrics for every email sent:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside">
                <li>Delivery status (sent, bounced, opened)</li>
                <li>Recipient email</li>
                <li>Template used</li>
                <li>Send timestamp</li>
                <li>Click tracking (if link clicked)</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Resend Webhook Setup">
              <p className="text-sm text-muted-foreground mb-4">
                Resend webhooks automatically track email opens and bounces. Configure in Resend dashboard:
              </p>
              <CodeBlock code={`Webhook URL:
https://your-domain.com/api/webhooks/resend

Events to enable:
- email.sent
- email.delivery_delayed
- email.bounced
- email.complained`} />
              <p className="text-sm text-muted-foreground mt-4">
                The webhook function updates email_logs table in real-time with status changes.
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Email Troubleshooting">
              <div className="space-y-4 text-sm">
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <p className="font-semibold text-red-900 mb-2">Emails not sending?</p>
                  <ul className="list-disc list-inside text-red-800 space-y-1">
                    <li>Check RESEND_API_KEY environment variable</li>
                    <li>Verify sender domain is verified in Resend</li>
                    <li>Check Supabase edge function logs for errors</li>
                  </ul>
                </div>
                <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <p className="font-semibold text-yellow-900 mb-2">High bounce rate?</p>
                  <ul className="list-disc list-inside text-yellow-800 space-y-1">
                    <li>Verify disposable email filter is enabled</li>
                    <li>Check if emails are on blocklist</li>
                    <li>Review failed email log for patterns</li>
                  </ul>
                </div>
              </div>
            </CollapsibleSection>
          </section>

          {/* Fraud Protection */}
          <section id="fraud-protection" className="mb-12 scroll-mt-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-red-700" />
              </div>
              <h2 className="text-3xl font-bold">Fraud Protection</h2>
            </div>

            <CollapsibleSection title="What's Checked">
              <div className="space-y-3 text-sm">
                <div className="p-3 border-l-4 border-red-500 bg-muted/50">
                  <p className="font-semibold">Disposable Email Detection</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Blocks temp email services (10minutemail, temp-mail, etc.)
                  </p>
                </div>
                <div className="p-3 border-l-4 border-red-500 bg-muted/50">
                  <p className="font-semibold">Duplicate Accounts</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Detects multiple signups from same email or phone number
                  </p>
                </div>
                <div className="p-3 border-l-4 border-red-500 bg-muted/50">
                  <p className="font-semibold">IP Rate Limiting</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Flags IPs with excessive signups in short time period
                  </p>
                </div>
                <div className="p-3 border-l-4 border-red-500 bg-muted/50">
                  <p className="font-semibold">Referral Patterns</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Detects unrealistic referral activity (100+ referrals/day from single user)
                  </p>
                </div>
                <div className="p-3 border-l-4 border-red-500 bg-muted/50">
                  <p className="font-semibold">Email Validation</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Verifies email format and domain exists
                  </p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Reviewing Flagged Users">
              <p className="text-sm text-muted-foreground mb-4">
                The Fraud Dashboard shows all flagged accounts. For each, you see:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside mb-4">
                <li>Reason flagged (system or manual)</li>
                <li>User details and account age</li>
                <li>Referral network (who referred them, who they referred)</li>
                <li>IP address and similar accounts from same IP</li>
                <li>Timeline of actions (signup, verify, referral activities)</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Disposable Email Detection">
              <p className="text-sm text-muted-foreground mb-4">
                The system checks against a curated list of disposable email providers. When detected:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside">
                <li>Account auto-flagged as suspicious</li>
                <li>Verification email still sent (transparency)</li>
                <li>Admin must manually approve to allow account participation</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="IP Rate Limiting">
              <p className="text-sm text-muted-foreground mb-4">
                Thresholds that trigger flags:
              </p>
              <CodeBlock code={`IP Rate Limits:
- 5+ signups from same IP in 1 hour → Flag
- 10+ signups from same IP in 24 hours → Flag
- 50+ verifications from same IP → Flag`} />
            </CollapsibleSection>

            <CollapsibleSection title="Approval vs Dismiss">
              <p className="text-sm text-muted-foreground mb-4">
                For each flagged user, you have two options:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <p className="font-semibold text-green-900">Approve</p>
                  <p className="text-green-800 text-sm mt-2">
                    User is legitimate. Remove flag, allow full participation. Points are counted.
                  </p>
                </div>
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <p className="font-semibold text-red-900">Dismiss/Block</p>
                  <p className="text-red-800 text-sm mt-2">
                    Fraudulent activity confirmed. Block account, disqualify from rewards, remove referral points.
                  </p>
                </div>
              </div>
            </CollapsibleSection>
          </section>

          {/* Suggestion Box */}
          <section id="suggestion-box" className="mb-12 scroll-mt-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-yellow-700" />
              </div>
              <h2 className="text-3xl font-bold">Suggestion Box</h2>
            </div>

            <CollapsibleSection title="Kanban Workflow">
              <p className="text-sm text-muted-foreground mb-4">
                Suggestions move through 4 stages in a Kanban board:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-100 rounded-lg border-t-4 border-gray-400">
                  <p className="font-semibold">1. New</p>
                  <p className="text-muted-foreground text-sm">Just submitted, awaiting review</p>
                </div>
                <div className="p-4 bg-blue-100 rounded-lg border-t-4 border-blue-400">
                  <p className="font-semibold">2. Under Review</p>
                  <p className="text-muted-foreground text-sm">Admin evaluating feasibility</p>
                </div>
                <div className="p-4 bg-yellow-100 rounded-lg border-t-4 border-yellow-400">
                  <p className="font-semibold">3. Planned</p>
                  <p className="text-muted-foreground text-sm">Will be implemented in future</p>
                </div>
                <div className="p-4 bg-green-100 rounded-lg border-t-4 border-green-400">
                  <p className="font-semibold">4. Completed</p>
                  <p className="text-muted-foreground text-sm">Feature implemented and live</p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Moving Between Stages">
              <p className="text-sm text-muted-foreground mb-4">
                Click and drag suggestions between columns to move them. When moving:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside mb-4">
                <li>Add internal comments explaining the decision</li>
                <li>User receives email notification of status change</li>
                <li>Public comment (optional) is visible to all users</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="User Voting">
              <p className="text-sm text-muted-foreground">
                Waitlist users can upvote suggestions they want. Sort the Kanban board by vote count to prioritize by demand.
              </p>
            </CollapsibleSection>
          </section>

          {/* Tier Rewards Fulfillment */}
          <section id="tier-rewards" className="mb-12 scroll-mt-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Gift className="h-6 w-6 text-green-700" />
              </div>
              <h2 className="text-3xl font-bold">Tier Rewards Fulfillment</h2>
            </div>

            <CollapsibleSection title="Tier 0 (Starter)">
              <p className="text-sm text-muted-foreground">
                <strong>Reward:</strong> Access to community (no physical reward). Simply confirm email address.
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Tiers 1-2">
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Reward:</strong> Digital assets (e-books, templates, guides)
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside">
                <li>Send via email with download links</li>
                <li>Create shareable links in /admin resources section</li>
                <li>Track downloads in analytics</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Tiers 3-4">
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Reward:</strong> Premium digital content + discount coupons
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside mb-4">
                <li>Video courses or masterclasses</li>
                <li>Exclusive 30% off coupon code</li>
                <li>Priority customer support</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Manually create unique coupon codes for each user. Share via email with redemption instructions.
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Tier 5 (VIP)">
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Reward:</strong> Premium bundle + 1:1 consultation
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside mb-4">
                <li>All Tier 3-4 benefits</li>
                <li>Exclusive merchandise (t-shirt, mug, sticker pack)</li>
                <li>30-minute personal consultation call with founder</li>
                <li>VIP lifetime access to all future content</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Tier 5 users must be fulfilled in queue order. Use the queue position from Users table to determine fulfillment sequence.
              </p>
            </CollapsibleSection>
          </section>

          {/* Troubleshooting */}
          <section id="troubleshooting" className="mb-12 scroll-mt-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-700" />
              </div>
              <h2 className="text-3xl font-bold">Troubleshooting</h2>
            </div>

            <CollapsibleSection title="Common Issues">
              <div className="space-y-4 text-sm">
                <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                  <p className="font-semibold text-orange-900 mb-2">User points not updating?</p>
                  <p className="text-orange-800 mb-2">
                    Check if the trigger function executed. Verify:
                  </p>
                  <ul className="list-disc list-inside text-orange-800 space-y-1">
                    <li>Edge function logs for errors</li>
                    <li>Database constraints (user_id exists)</li>
                    <li>Re-run trigger from user detail modal</li>
                  </ul>
                </div>
                <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                  <p className="font-semibold text-orange-900 mb-2">Referral code not generating?</p>
                  <p className="text-orange-800 mb-2">
                    Ensure:
                  </p>
                  <ul className="list-disc list-inside text-orange-800 space-y-1">
                    <li>User is verified (unverified users can't generate codes)</li>
                    <li>Check referral_codes table in Supabase</li>
                    <li>Try regenerating code from user details</li>
                  </ul>
                </div>
                <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                  <p className="font-semibold text-orange-900 mb-2">Duplicate user after merge?</p>
                  <p className="text-orange-800 mb-2">
                    Points and referrals are merged; old user is marked inactive. If issues persist, contact engineering.
                  </p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Recalculating Positions">
              <p className="text-sm text-muted-foreground mb-4">
                If queue positions seem incorrect, force a recalculation:
              </p>
              <CodeBlock code={`Admin Dashboard → Tools → Recalculate Queue Positions
This re-ranks all users by tier and points.
Completes in ~2 seconds for 10k users.`} />
            </CollapsibleSection>

            <CollapsibleSection title="Email Issues">
              <p className="text-sm text-muted-foreground mb-4">
                If emails aren't being sent, check the Email Logs tab for bounce errors:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside">
                <li>Status "bounced" = invalid email address</li>
                <li>Status "failed" = Resend API error (check logs)</li>
                <li>Status "pending" = still being delivered (wait 5 minutes)</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Duplicate Handling">
              <p className="text-sm text-muted-foreground mb-4">
                When duplicates are detected, use the Users detail panel to:
              </p>
              <ol className="space-y-2 text-sm list-decimal list-inside mb-4">
                <li>Select the primary account (keep this one)</li>
                <li>Select the duplicate</li>
                <li>Click "Merge Accounts"</li>
              </ol>
              <p className="text-sm text-muted-foreground">
                Points and referrals combine. The duplicate is marked inactive and hidden from lists.
              </p>
            </CollapsibleSection>
          </section>

          <div className="mt-12 p-6 bg-purple-50 border border-purple-200 rounded-lg print:bg-gray-50 print:border-gray-300">
            <h3 className="font-semibold text-purple-900 mb-2">Need Help?</h3>
            <p className="text-sm text-purple-800">
              For technical issues, check the Supabase dashboard logs or contact engineering. For product questions, refer to the suggestion box or product roadmap.
            </p>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

export default AdminWaitlistGuide;
