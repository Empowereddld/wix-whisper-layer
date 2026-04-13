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
    subsections: ["How Referral Codes Work", "Point Awards & Thresholds", "6-Tier System with Thresholds", "Queue Positioning"],
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
    subsections: ["Tier 0 (Starter)", "Tier 1 (Language Activities)", "Tier 2 (Story Starter)", "Tier 3 (Founding Voice)", "Tier 4 (Champion)", "Tier 5 (VIP) - CAPPED AT 50", "Social Follow/Subscribe System", "Story Coins System", "Rewards Inventory Tab"],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    icon: AlertCircle,
    subsections: ["Common Issues", "Recalculate Positions", "Email Issues", "Duplicate Handling"],
  },
];

const CodeBlock = ({ code }: { code: string }) => (
  <pre className="bg-[#3b1f59] text-[#8861d4] p-4 rounded-lg overflow-x-auto text-sm font-mono">
    <code>{code}</code>
  </pre>
);

const CollapsibleSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-[#dedede] rounded-lg overflow-hidden mb-4 bg-[#ffffff]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-[#f3ebf8] hover:bg-[#f3ebf8] transition-colors"
      >
        <h4 className="font-semibold text-[#3b1f59]">{title}</h4>
        {isOpen ? <ChevronUp className="h-4 w-4 text-[#8861d4]" /> : <ChevronDown className="h-4 w-4 text-[#8861d4]" />}
      </button>
      {isOpen && <div className="p-4 border-t border-[#dedede]">{children}</div>}
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
          <div className="sticky top-20 bg-[#ffffff] rounded-lg border border-[#dedede] p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold text-sm text-[#121212] ${!sidebarOpen ? "hidden" : ""}`}>Sections</h3>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1 hover:bg-[#f3ebf8] rounded transition-colors"
              >
                {sidebarOpen ? <ChevronUp className="h-4 w-4 text-[#8861d4]" /> : <ChevronDown className="h-4 w-4 text-[#8861d4]" />}
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
                        ? "bg-[#8861d4]/20 text-[#8861d4] font-medium border-l-2 border-[#8861d4]"
                        : "text-gray-500 hover:bg-[#f3ebf8]"
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
              <h1 className="text-4xl font-bold text-[#3b1f59] font-sans font-bold">StoryBuilders Waitlist Admin Guide</h1>
              <p className="text-gray-500 mt-2">Everything you need to run the viral waitlist system</p>
            </div>
            <Button onClick={handlePrint} variant="outline" size="sm" className="print:hidden border-[#dedede] text-[#121212] hover:bg-[#f3ebf8]">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>

          {/* Getting Started */}
          <section id="getting-started" className="mb-12 scroll-mt-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-[#8861d4]/20 flex items-center justify-center">
                <Home className="h-6 w-6 text-[#8861d4]" />
              </div>
              <h2 className="text-3xl font-bold text-[#3b1f59] font-sans font-bold">Getting Started</h2>
            </div>

            <CollapsibleSection title="System Architecture">
              <p className="text-gray-500 mb-4">
                The StoryBuilders waitlist is built on a serverless stack with three main components:
              </p>
              <ul className="space-y-2 mb-4 text-sm">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-1 text-[#8861d4] flex-shrink-0" />
                  <span className="text-[#121212]">
                    <strong>Frontend:</strong> React dashboard for user signups and admin management
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-1 text-[#8861d4] flex-shrink-0" />
                  <span className="text-[#121212]">
                    <strong>Backend:</strong> Supabase PostgreSQL database + Supabase Edge Functions for serverless logic
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-1 text-[#8861d4] flex-shrink-0" />
                  <span className="text-[#121212]">
                    <strong>Email:</strong> Resend API for email delivery with webhook tracking
                  </span>
                </li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="First-Time Setup Checklist">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 bg-[#f3ebf8] rounded-lg border border-[#dedede]">
                  <CheckCircle2 className="h-5 w-5 text-[#8861d4] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#3b1f59]">Supabase Migration</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Run migrations to create tables: waitlist_users, referral_codes, email_logs, suggestion_box, fraud_flags
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-[#f3ebf8] rounded-lg border border-[#dedede]">
                  <CheckCircle2 className="h-5 w-5 text-[#8861d4] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#3b1f59]">Resend API Key</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Set RESEND_API_KEY in Supabase Edge Function environment variables
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-[#f3ebf8] rounded-lg border border-[#dedede]">
                  <CheckCircle2 className="h-5 w-5 text-[#8861d4] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#3b1f59]">Deploy Edge Functions</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Deploy: storybuilders-signup, verify-email-waitlist, send-waitlist-email, check-fraud, track-referral-click
                    </p>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Access Admin Dashboard">
              <p className="text-sm text-gray-500 mb-4">
                Admins access the StoryBuilders waitlist dashboard at <code className="bg-[#ffffff] px-2 py-1 rounded text-[#3b1f59]">/admin/storybuilders</code>. This
                requires:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside text-[#121212]">
                <li>Valid admin user (created in auth system)</li>
                <li>AdminProtectedRoute wrapper ensures access control</li>
                <li>Full CRUD permissions on all waitlist tables</li>
              </ul>
            </CollapsibleSection>
          </section>

          {/* Dashboard Overview */}
          <section id="dashboard-overview" className="mb-12 scroll-mt-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-[#8861d4]/20 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-[#8861d4]" />
              </div>
              <h2 className="text-3xl font-bold text-[#3b1f59] font-sans font-bold">Dashboard Overview</h2>
            </div>

            <CollapsibleSection title="Key Metrics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-[#f3ebf8] rounded-lg border border-[#dedede]">
                  <p className="font-semibold mb-2 text-[#3b1f59]">Total Signups</p>
                  <p className="text-gray-500">Count of all email submissions</p>
                </div>
                <div className="p-4 bg-[#f3ebf8] rounded-lg border border-[#dedede]">
                  <p className="font-semibold mb-2 text-[#3b1f59]">Verification Rate (%)</p>
                  <p className="text-gray-500">Verified emails / total signups × 100</p>
                </div>
                <div className="p-4 bg-[#f3ebf8] rounded-lg border border-[#dedede]">
                  <p className="font-semibold mb-2 text-[#3b1f59]">Average Referrals</p>
                  <p className="text-gray-500">Mean referral count per user</p>
                </div>
                <div className="p-4 bg-[#f3ebf8] rounded-lg border border-[#dedede]">
                  <p className="font-semibold mb-2 text-[#3b1f59]">Conversion Rate (%)</p>
                  <p className="text-gray-500">Percentage of signups reaching Tier 5</p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Analytics Chart">
              <p className="text-sm text-gray-500 mb-4">
                The dashboard displays a time-series line chart showing daily signups, verifications, and referrals over the past 30 days.
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside text-[#121212]">
                <li>Terracotta line = daily signups</li>
                <li>Sage line = email verifications</li>
                <li>Amber line = referral clicks</li>
                <li>Hover over points for exact values</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Quick Actions">
              <p className="text-sm text-gray-500 mb-4">
                The Overview tab provides quick access to common tasks:
              </p>
              <ul className="space-y-2 text-sm text-[#121212]">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-[#8861d4]" /> Browse Users tab
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-[#8861d4]" /> Send Email Announcement
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-[#8861d4]" /> Review Flagged Users
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-[#8861d4]" /> View Suggestions
                </li>
              </ul>
            </CollapsibleSection>
          </section>

          {/* Managing Users */}
          <section id="managing-users" className="mb-12 scroll-mt-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-[#8861d4]/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-[#8861d4]" />
              </div>
              <h2 className="text-3xl font-bold text-[#3b1f59] font-sans font-bold">Managing Users</h2>
            </div>

            <CollapsibleSection title="Search & Filter">
              <p className="text-sm text-gray-500 mb-4">
                Use the search bar at the top of the Users table to filter by:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside mb-4 text-[#121212]">
                <li>Email address (partial match)</li>
                <li>Display name</li>
                <li>Referral code</li>
              </ul>
              <p className="text-sm text-gray-500 mb-4">Additional filters:</p>
              <ul className="space-y-2 text-sm list-disc list-inside text-[#121212]">
                <li>Tier (0-5)</li>
                <li>Verification status (verified / unverified)</li>
                <li>Fraud status (flagged / clean)</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Column Meanings">
              <div className="space-y-3 text-sm">
                <div className="p-3 border-l-4 border-[#8861d4] bg-[#f3ebf8] rounded">
                  <p className="font-medium text-[#3b1f59]">Email</p>
                  <p className="text-gray-500 text-xs">User's email address with verification status icon</p>
                </div>
                <div className="p-3 border-l-4 border-[#8861d4] bg-[#f3ebf8] rounded">
                  <p className="font-medium text-[#3b1f59]">Name</p>
                  <p className="text-gray-500 text-xs">Display name (editable)</p>
                </div>
                <div className="p-3 border-l-4 border-[#8861d4] bg-[#f3ebf8] rounded">
                  <p className="font-medium text-[#3b1f59]">Points</p>
                  <p className="text-gray-500 text-xs">Total points earned (signup + verify + referrals)</p>
                </div>
                <div className="p-3 border-l-4 border-[#8861d4] bg-[#f3ebf8] rounded">
                  <p className="font-medium text-[#3b1f59]">Tier</p>
                  <p className="text-gray-500 text-xs">0-5, determines reward eligibility</p>
                </div>
                <div className="p-3 border-l-4 border-[#8861d4] bg-[#f3ebf8] rounded">
                  <p className="font-medium text-[#3b1f59]">Queue Position</p>
                  <p className="text-gray-500 text-xs">Order for tier rewards (1 = highest tier, first in queue)</p>
                </div>
                <div className="p-3 border-l-4 border-[#8861d4] bg-[#f3ebf8] rounded">
                  <p className="font-medium text-[#3b1f59]">Referrals</p>
                  <p className="text-gray-500 text-xs">Number of successful referral conversions</p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="View User Details">
              <p className="text-sm text-gray-500 mb-4">
                Click a user row to open their detail modal. You can see:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside mb-4 text-[#121212]">
                <li>Full profile (email, name, phone)</li>
                <li>Account created date</li>
                <li>Email verification timestamp</li>
                <li>Referral code and link</li>
                <li>Complete point breakdown</li>
                <li>Fraud flags and history</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Adjust Points Manually">
              <p className="text-sm text-gray-500 mb-4">
                In the user detail modal, use the "Adjust Points" button to manually add or remove points:
              </p>
              <CodeBlock code={`Example: Award bonus 50 points
Old: 120 points
New: 170 points
Reason: Bonus for social media share`} />
              <p className="text-sm text-gray-500 mt-4">
                Changes recalculate the user's tier and queue position automatically.
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Flag/Unflag Suspicious Users">
              <p className="text-sm text-gray-500 mb-4">
                Use the "Flag as Suspicious" button in user details. Choose a reason:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside text-[#121212]">
                <li>Disposable email detected</li>
                <li>Duplicate account</li>
                <li>Suspicious referral pattern</li>
                <li>Manual review needed</li>
              </ul>
              <p className="text-sm text-gray-500 mt-4">
                Flagged users appear in the Fraud Dashboard and can be manually approved or dismissed.
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Export CSV">
              <p className="text-sm text-gray-500">
                Click the "Export" button to download all users as CSV with full data including points, tier, verification status, and fraud flags.
              </p>
            </CollapsibleSection>
          </section>

          {/* Referral System */}
          <section id="referral-system" className="mb-12 scroll-mt-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-[#8861d4]/20 flex items-center justify-center">
                <Share2 className="h-6 w-6 text-[#8861d4]" />
              </div>
              <h2 className="text-3xl font-bold text-[#3b1f59] font-sans font-bold">Referral System</h2>
            </div>

            <CollapsibleSection title="How Referral Codes Work">
              <p className="text-sm text-gray-500 mb-4">
                Each user receives a unique referral code (e.g., "SB-A1B2C3"). They share this code with friends who:
              </p>
              <ol className="space-y-2 text-sm list-decimal list-inside mb-4 text-[#121212]">
                <li>Visit the signup page with the referral code in the URL</li>
                <li>Complete signup (points awarded to both)</li>
                <li>Verify email (referrer gets bonus points)</li>
              </ol>
              <p className="text-sm text-gray-500">
                Tracking uses encrypted URL parameters and IP validation to prevent fraud.
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Point Awards & Thresholds">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-[#3b1f59] mb-3">One-Time Actions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-[#f3ebf8] rounded-lg border-l-4 border-[#8861d4]">
                      <p className="font-semibold text-[#3b1f59]">Join</p>
                      <p className="text-2xl font-bold text-[#8861d4]">+10</p>
                    </div>
                    <div className="p-3 bg-[#f3ebf8] rounded-lg border-l-4 border-[#8861d4]">
                      <p className="font-semibold text-[#3b1f59]">Verify Email</p>
                      <p className="text-2xl font-bold text-[#8861d4]">+5</p>
                    </div>
                    <div className="p-3 bg-[#f3ebf8] rounded-lg border-l-4 border-[#8861d4]">
                      <p className="font-semibold text-[#3b1f59]">Complete Profile</p>
                      <p className="text-2xl font-bold text-[#8861d4]">+10</p>
                    </div>
                    <div className="p-3 bg-[#f3ebf8] rounded-lg border-l-4 border-[#8861d4]">
                      <p className="font-semibold text-[#3b1f59]">Follow Instagram</p>
                      <p className="text-2xl font-bold text-[#8861d4]">+8</p>
                    </div>
                    <div className="p-3 bg-[#f3ebf8] rounded-lg border-l-4 border-[#8861d4]">
                      <p className="font-semibold text-[#3b1f59]">Follow Facebook</p>
                      <p className="text-2xl font-bold text-[#8861d4]">+8</p>
                    </div>
                    <div className="p-3 bg-[#f3ebf8] rounded-lg border-l-4 border-[#8861d4]">
                      <p className="font-semibold text-[#3b1f59]">Subscribe YouTube</p>
                      <p className="text-2xl font-bold text-[#8861d4]">+8</p>
                    </div>
                    <div className="p-3 bg-[#f3ebf8] rounded-lg border-l-4 border-[#8861d4]">
                      <p className="font-semibold text-[#3b1f59]">First Share</p>
                      <p className="text-2xl font-bold text-[#8861d4]">+5</p>
                    </div>
                    <div className="p-3 bg-[#f3ebf8] rounded-lg border-l-4 border-[#8861d4]">
                      <p className="font-semibold text-[#3b1f59]">First Referral Bonus</p>
                      <p className="text-2xl font-bold text-[#8861d4]">+10</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#3b1f59] mb-3">Repeatable Actions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-[#f3ebf8] rounded-lg border-l-4 border-[#8861d4]">
                      <p className="font-semibold text-[#3b1f59]">Referral Conversion</p>
                      <p className="text-2xl font-bold text-[#8861d4]">+25</p>
                    </div>
                    <div className="p-3 bg-[#f3ebf8] rounded-lg border-l-4 border-[#8861d4]">
                      <p className="font-semibold text-[#3b1f59]">Share (per share)</p>
                      <p className="text-2xl font-bold text-[#8861d4]">+3</p>
                    </div>
                    <div className="p-3 bg-[#f3ebf8] rounded-lg border-l-4 border-[#8861d4]">
                      <p className="font-semibold text-[#3b1f59]">Click (per click)</p>
                      <p className="text-2xl font-bold text-[#8861d4]">+1</p>
                    </div>
                    <div className="p-3 bg-[#f3ebf8] rounded-lg border-l-4 border-[#8861d4]">
                      <p className="font-semibold text-[#3b1f59]">Suggestion</p>
                      <p className="text-2xl font-bold text-[#8861d4]">+5</p>
                    </div>
                    <div className="p-3 bg-[#f3ebf8] rounded-lg border-l-4 border-[#8861d4]">
                      <p className="font-semibold text-[#3b1f59]">Daily Check-in</p>
                      <p className="text-2xl font-bold text-[#8861d4]">+2</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#3b1f59] mb-3">Streak Bonuses</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-[#f3ebf8] rounded-lg border-l-4 border-[#8861d4]">
                      <p className="font-semibold text-[#3b1f59]">3-Day Streak</p>
                      <p className="text-2xl font-bold text-[#8861d4]">+3</p>
                    </div>
                    <div className="p-3 bg-[#f3ebf8] rounded-lg border-l-4 border-[#8861d4]">
                      <p className="font-semibold text-[#3b1f59]">7-Day Streak</p>
                      <p className="text-2xl font-bold text-[#8861d4]">+10</p>
                    </div>
                    <div className="p-3 bg-[#f3ebf8] rounded-lg border-l-4 border-[#8861d4]">
                      <p className="font-semibold text-[#3b1f59]">14-Day Streak</p>
                      <p className="text-2xl font-bold text-[#8861d4]">+20</p>
                    </div>
                    <div className="p-3 bg-[#f3ebf8] rounded-lg border-l-4 border-[#8861d4]">
                      <p className="font-semibold text-[#3b1f59]">30-Day Streak</p>
                      <p className="text-2xl font-bold text-[#8861d4]">+50</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#3b1f59] mb-3">Daily Caps</h4>
                  <ul className="space-y-2 text-sm list-disc list-inside text-[#121212]">
                    <li>Shares: 15 pts/day max</li>
                    <li>Clicks: 10 pts/day max</li>
                    <li>Check-in: once per day</li>
                  </ul>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="6-Tier System with Thresholds">
              <div className="space-y-3 text-sm">
                <div className="p-4 bg-[#f3ebf8] rounded-lg border border-[#dedede]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[#3b1f59]">Tier 0 (Starter)</span>
                    <span className="text-gray-500 font-bold">0 points</span>
                  </div>
                  <p className="text-gray-500 text-xs">Just signed up</p>
                </div>
                <div className="p-4 bg-[#f3ebf8] rounded-lg border border-[#dedede]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[#3b1f59]">Tier 1</span>
                    <span className="text-gray-500 font-bold">40+ points</span>
                  </div>
                  <p className="text-gray-500 text-xs">Verified + shared with friends</p>
                </div>
                <div className="p-4 bg-[#f3ebf8] rounded-lg border border-[#dedede]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[#3b1f59]">Tier 2</span>
                    <span className="text-gray-500 font-bold">100+ points</span>
                  </div>
                  <p className="text-gray-500 text-xs">Growing referral network</p>
                </div>
                <div className="p-4 bg-[#f3ebf8] rounded-lg border border-[#dedede]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[#3b1f59]">Tier 3</span>
                    <span className="text-gray-500 font-bold">175+ points</span>
                  </div>
                  <p className="text-gray-500 text-xs">Multiple successful referrals</p>
                </div>
                <div className="p-4 bg-[#f3ebf8] rounded-lg border border-[#dedede]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[#3b1f59]">Tier 4</span>
                    <span className="text-gray-500 font-bold">325+ points</span>
                  </div>
                  <p className="text-gray-500 text-xs">Strong viral advocate</p>
                </div>
                <div className="p-4 bg-[#f3ebf8] rounded-lg border border-[#dedede]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[#3b1f59]">Tier 5 (VIP)</span>
                    <span className="text-gray-500 font-bold">600+ points</span>
                  </div>
                  <p className="text-gray-500 text-xs">Top viral advocate - eligible for premium rewards</p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Queue Positioning">
              <p className="text-sm text-gray-500 mb-4">
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
              <div className="w-12 h-12 rounded-lg bg-[#C4A0A0]/20 flex items-center justify-center">
                <Mail className="h-6 w-6 text-[#C4A0A0]" />
              </div>
              <h2 className="text-3xl font-bold text-[#3b1f59] font-sans font-bold">Email System</h2>
            </div>

            <CollapsibleSection title="7 Email Templates & Triggers">
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-[#f3ebf8] rounded-lg border border-[#dedede]">
                  <p className="font-semibold text-[#3b1f59]">Welcome Email</p>
                  <p className="text-gray-500 text-xs">Triggered: Signup completion</p>
                </div>
                <div className="p-3 bg-[#f3ebf8] rounded-lg border border-[#dedede]">
                  <p className="font-semibold text-[#3b1f59]">Verification Email</p>
                  <p className="text-gray-500 text-xs">Triggered: Signup form submission</p>
                </div>
                <div className="p-3 bg-[#f3ebf8] rounded-lg border border-[#dedede]">
                  <p className="font-semibold text-[#3b1f59]">Referral Bonus Notification</p>
                  <p className="text-gray-500 text-xs">Triggered: Friend verifies email</p>
                </div>
                <div className="p-3 bg-[#f3ebf8] rounded-lg border border-[#dedede]">
                  <p className="font-semibold text-[#3b1f59]">Tier Upgrade Announcement</p>
                  <p className="text-gray-500 text-xs">Triggered: Points threshold reached</p>
                </div>
                <div className="p-3 bg-[#f3ebf8] rounded-lg border border-[#dedede]">
                  <p className="font-semibold text-[#3b1f59]">Reward Fulfillment</p>
                  <p className="text-gray-500 text-xs">Triggered: Admin manually sends when reward is ready</p>
                </div>
                <div className="p-3 bg-[#f3ebf8] rounded-lg border border-[#dedede]">
                  <p className="font-semibold text-[#3b1f59]">Announcement (Bulk)</p>
                  <p className="text-gray-500 text-xs">Triggered: Admin sends custom message</p>
                </div>
                <div className="p-3 bg-[#f3ebf8] rounded-lg border border-[#dedede]">
                  <p className="font-semibold text-[#3b1f59]">Account Verification Error</p>
                  <p className="text-gray-500 text-xs">Triggered: Email verification fails</p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Bulk Announcements">
              <p className="text-sm text-gray-500 mb-4">
                From the Emails tab, click "Send Announcement" to send a custom message to selected user segments:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside mb-4 text-[#121212]">
                <li>All users (entire waitlist)</li>
                <li>By tier (e.g., Tier 5 only)</li>
                <li>By verification status (verified/unverified)</li>
                <li>Custom list (select individual users)</li>
              </ul>
              <p className="text-sm text-gray-500">
                Messages support basic HTML formatting (bold, links, paragraphs). Preview before sending.
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Email Metrics">
              <p className="text-sm text-gray-500 mb-4">
                The Email Logs tab shows delivery metrics for every email sent:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside text-[#121212]">
                <li>Delivery status (sent, bounced, opened)</li>
                <li>Recipient email</li>
                <li>Template used</li>
                <li>Send timestamp</li>
                <li>Click tracking (if link clicked)</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Resend Webhook Setup">
              <p className="text-sm text-gray-500 mb-4">
                Resend webhooks automatically track email opens and bounces. Configure in Resend dashboard:
              </p>
              <CodeBlock code={`Webhook URL:
https://your-domain.com/api/webhooks/resend

Events to enable:
- email.sent
- email.delivery_delayed
- email.bounced
- email.complained`} />
              <p className="text-sm text-gray-500 mt-4">
                The webhook function updates email_logs table in real-time with status changes.
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Email Troubleshooting">
              <div className="space-y-4 text-sm">
                <div className="p-4 border border-[#8861d4]/30 bg-[#8861d4]/10 rounded-lg">
                  <p className="font-semibold text-[#8861d4] mb-2">Emails not sending?</p>
                  <ul className="list-disc list-inside text-[#121212] space-y-1">
                    <li>Check RESEND_API_KEY environment variable</li>
                    <li>Verify sender domain is verified in Resend</li>
                    <li>Check Supabase edge function logs for errors</li>
                  </ul>
                </div>
                <div className="p-4 border border-[#8861d4]/30 bg-[#8861d4]/10 rounded-lg">
                  <p className="font-semibold text-[#8861d4] mb-2">High bounce rate?</p>
                  <ul className="list-disc list-inside text-[#121212] space-y-1">
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
              <div className="w-12 h-12 rounded-lg bg-[#8861d4]/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-[#8861d4]" />
              </div>
              <h2 className="text-3xl font-bold text-[#3b1f59] font-sans font-bold">Fraud Protection</h2>
            </div>

            <CollapsibleSection title="What's Checked">
              <div className="space-y-3 text-sm">
                <div className="p-3 border-l-4 border-[#8861d4] bg-[#f3ebf8]">
                  <p className="font-semibold text-[#3b1f59]">Disposable Email Detection</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Blocks temp email services (10minutemail, temp-mail, etc.)
                  </p>
                </div>
                <div className="p-3 border-l-4 border-[#8861d4] bg-[#f3ebf8]">
                  <p className="font-semibold text-[#3b1f59]">Duplicate Accounts</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Detects multiple signups from same email or phone number
                  </p>
                </div>
                <div className="p-3 border-l-4 border-[#8861d4] bg-[#f3ebf8]">
                  <p className="font-semibold text-[#3b1f59]">IP Rate Limiting</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Flags IPs with excessive signups in short time period
                  </p>
                </div>
                <div className="p-3 border-l-4 border-[#8861d4] bg-[#f3ebf8]">
                  <p className="font-semibold text-[#3b1f59]">Referral Patterns</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Detects unrealistic referral activity (100+ referrals/day from single user)
                  </p>
                </div>
                <div className="p-3 border-l-4 border-[#8861d4] bg-[#f3ebf8]">
                  <p className="font-semibold text-[#3b1f59]">Email Validation</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Verifies email format and domain exists
                  </p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Reviewing Flagged Users">
              <p className="text-sm text-gray-500 mb-4">
                The Fraud Dashboard shows all flagged accounts. For each, you see:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside mb-4 text-[#121212]">
                <li>Reason flagged (system or manual)</li>
                <li>User details and account age</li>
                <li>Referral network (who referred them, who they referred)</li>
                <li>IP address and similar accounts from same IP</li>
                <li>Timeline of actions (signup, verify, referral activities)</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Disposable Email Detection">
              <p className="text-sm text-gray-500 mb-4">
                The system checks against a curated list of disposable email providers. When detected:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside text-[#121212]">
                <li>Account auto-flagged as suspicious</li>
                <li>Verification email still sent (transparency)</li>
                <li>Admin must manually approve to allow account participation</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="IP Rate Limiting">
              <p className="text-sm text-gray-500 mb-4">
                Thresholds that trigger flags:
              </p>
              <CodeBlock code={`IP Rate Limits:
- 5+ signups from same IP in 1 hour → Flag
- 10+ signups from same IP in 24 hours → Flag
- 50+ verifications from same IP → Flag`} />
            </CollapsibleSection>

            <CollapsibleSection title="Approval vs Dismiss">
              <p className="text-sm text-gray-500 mb-4">
                For each flagged user, you have two options:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-[#8861d4]/30 bg-[#8861d4]/10 rounded-lg">
                  <p className="font-semibold text-[#8861d4]">Approve</p>
                  <p className="text-[#121212] text-sm mt-2">
                    User is legitimate. Remove flag, allow full participation. Points are counted.
                  </p>
                </div>
                <div className="p-4 border border-[#8861d4]/30 bg-[#8861d4]/10 rounded-lg">
                  <p className="font-semibold text-[#8861d4]">Dismiss/Block</p>
                  <p className="text-[#121212] text-sm mt-2">
                    Fraudulent activity confirmed. Block account, disqualify from rewards, remove referral points.
                  </p>
                </div>
              </div>
            </CollapsibleSection>
          </section>

          {/* Suggestion Box */}
          <section id="suggestion-box" className="mb-12 scroll-mt-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-[#8861d4]/20 flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-[#8861d4]" />
              </div>
              <h2 className="text-3xl font-bold text-[#3b1f59] font-sans font-bold">Suggestion Box</h2>
            </div>

            <CollapsibleSection title="Kanban Workflow">
              <p className="text-sm text-gray-500 mb-4">
                Suggestions move through 4 stages in a Kanban board:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#f3ebf8] rounded-lg border-t-4 border-[#8861d4]">
                  <p className="font-semibold text-[#3b1f59]">1. New</p>
                  <p className="text-gray-500 text-sm">Just submitted, awaiting review</p>
                </div>
                <div className="p-4 bg-[#f3ebf8] rounded-lg border-t-4 border-[#8861d4]">
                  <p className="font-semibold text-[#3b1f59]">2. Under Review</p>
                  <p className="text-gray-500 text-sm">Admin evaluating feasibility</p>
                </div>
                <div className="p-4 bg-[#f3ebf8] rounded-lg border-t-4 border-[#8861d4]">
                  <p className="font-semibold text-[#3b1f59]">3. Planned</p>
                  <p className="text-gray-500 text-sm">Will be implemented in future</p>
                </div>
                <div className="p-4 bg-[#f3ebf8] rounded-lg border-t-4 border-[#8861d4]">
                  <p className="font-semibold text-[#3b1f59]">4. Completed</p>
                  <p className="text-gray-500 text-sm">Feature implemented and live</p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Moving Between Stages">
              <p className="text-sm text-gray-500 mb-4">
                Click and drag suggestions between columns to move them. When moving:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside mb-4 text-[#121212]">
                <li>Add internal comments explaining the decision</li>
                <li>User receives email notification of status change</li>
                <li>Public comment (optional) is visible to all users</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="User Voting">
              <p className="text-sm text-gray-500">
                Waitlist users can upvote suggestions they want. Sort the Kanban board by vote count to prioritize by demand.
              </p>
            </CollapsibleSection>
          </section>

          {/* Tier Rewards Fulfillment */}
          <section id="tier-rewards" className="mb-12 scroll-mt-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-[#8861d4]/20 flex items-center justify-center">
                <Gift className="h-6 w-6 text-[#8861d4]" />
              </div>
              <h2 className="text-3xl font-bold text-[#3b1f59] font-sans font-bold">Tier Rewards Fulfillment</h2>
            </div>

            <CollapsibleSection title="Tier 0 (Starter)">
              <p className="text-sm text-gray-500 mb-4">
                <strong>Reward:</strong> Welcome email + developer updates
              </p>
              <p className="text-sm text-gray-500">
                Send welcome email and enroll in dev update newsletter to keep them informed of progress.
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Tier 1 (Language Activities)">
              <p className="text-sm text-gray-500 mb-4">
                <strong>Reward:</strong> "5 Language Activities" PDF
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside text-[#121212]">
                <li>Send via email with download link</li>
                <li>Create shareable link in /admin resources section</li>
                <li>Track downloads in analytics</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Tier 2 (Story Starter)">
              <p className="text-sm text-gray-500 mb-4">
                <strong>Reward:</strong> 75 Story Coins + Story Starter Pack
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside text-[#121212]">
                <li>Award 75 coins to user account</li>
                <li>Send Story Starter Pack via email</li>
                <li>Coins can be redeemed at Tier 2 level (50 coins) or combined for Tier 4 reward (150 coins)</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Tier 3 (Founding Voice)">
              <p className="text-sm text-gray-500 mb-4">
                <strong>Reward:</strong> Founding Voice badge + sneak peek video
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside text-[#121212]">
                <li>Unlock "Founding Voice" badge on their profile</li>
                <li>Send exclusive sneak peek video via email</li>
                <li>Include recognition message in next community email</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Tier 4 (Champion)">
              <p className="text-sm text-gray-500 mb-4">
                <strong>Reward:</strong> Recognition + subscription discount + 200 Story Coins + Champion Pack
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside mb-4 text-[#121212]">
                <li>Public recognition in community email / social media</li>
                <li>Monthly subscription discount: $5.99/mo (regularly $7.99)</li>
                <li>Award 200 Story Coins to account</li>
                <li>Send Champion Pack via email</li>
              </ul>
              <p className="text-sm text-gray-500">
                Create unique coupon code for discounted subscription. Coins can be combined with Tier 2 coins for Tier 5 pack.
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Tier 5 (VIP) - CAPPED AT 50">
              <p className="text-sm text-gray-500 mb-4">
                <strong>Reward:</strong> VIP everything - FIRST 50 users only
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside mb-4 text-[#121212]">
                <li>All Tier 4 benefits (recognition, discount, 200 coins)</li>
                <li>VIP lifetime access to all future content and beta features</li>
                <li>Exclusive VIP community access</li>
                <li>Priority support + direct line to founder</li>
                <li>Founding member merchandise package</li>
              </ul>
              <p className="text-sm text-gray-500 mb-4">
                <strong>IMPORTANT:</strong> Tier 5 cap is FIRST 50 users. Once 50 users reach Tier 5, no additional users qualify for this tier. They stop at Tier 4.
              </p>
              <p className="text-sm text-gray-500">
                Tier 5 users must be fulfilled in queue order. Use the queue position from Users table to determine fulfillment sequence.
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Social Follow/Subscribe System">
              <p className="text-sm text-gray-500 mb-4">
                The follow and subscribe system uses an honor system approach:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside mb-4 text-[#121212]">
                <li>When user clicks follow/subscribe buttons, their profile opens in a new tab</li>
                <li>Points are awarded immediately on button click (honor system - no verification)</li>
                <li>Tracked via boolean columns: followed_instagram, followed_facebook, subscribed_youtube</li>
                <li>No TikTok integration</li>
              </ul>
              <p className="text-sm text-gray-500">
                Once clicked, these buttons become disabled for that user (can't earn points twice).
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Story Coins System">
              <p className="text-sm text-gray-500 mb-4">
                Story Coins are earned the same way as points and can be redeemed for rewards:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside mb-4 text-[#121212]">
                <li>First coin drop at Tier 2: 75 coins</li>
                <li>Second coin drop at Tier 4: 200 coins</li>
                <li>Users can accumulate and combine coins across tiers</li>
              </ul>
              <p className="text-sm text-gray-500 mb-4">
                <strong>Redeemable Packs:</strong>
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside text-[#121212]">
                <li>50 coins: Story Starter Pack (Tier 2 level)</li>
                <li>150 coins: Champion Pack (combines Tier 2 + Tier 4)</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Rewards Inventory Tab">
              <p className="text-sm text-gray-500 mb-4">
                Users claim rewards from their personal dashboard in the Rewards Inventory tab:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside text-[#121212]">
                <li><strong>Locked:</strong> User hasn't reached this tier yet</li>
                <li><strong>Ready to Claim:</strong> User reached tier and reward is available - they click to claim</li>
                <li><strong>Claimed:</strong> User has already claimed this reward</li>
              </ul>
              <p className="text-sm text-gray-500 mt-4">
                Admin can see claim status for all users in the database. Mark as "Claimed" once reward is delivered.
              </p>
            </CollapsibleSection>
          </section>

          {/* Troubleshooting */}
          <section id="troubleshooting" className="mb-12 scroll-mt-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-[#8861d4]/20 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-[#8861d4]" />
              </div>
              <h2 className="text-3xl font-bold text-[#3b1f59] font-sans font-bold">Troubleshooting</h2>
            </div>

            <CollapsibleSection title="Common Issues">
              <div className="space-y-4 text-sm">
                <div className="p-4 border border-[#8861d4]/30 bg-[#8861d4]/10 rounded-lg">
                  <p className="font-semibold text-[#8861d4] mb-2">User points not updating?</p>
                  <p className="text-[#121212] mb-2">
                    Check if the trigger function executed. Verify:
                  </p>
                  <ul className="list-disc list-inside text-[#121212] space-y-1">
                    <li>Edge function logs for errors</li>
                    <li>Database constraints (user_id exists)</li>
                    <li>Re-run trigger from user detail modal</li>
                  </ul>
                </div>
                <div className="p-4 border border-[#8861d4]/30 bg-[#8861d4]/10 rounded-lg">
                  <p className="font-semibold text-[#8861d4] mb-2">Referral code not generating?</p>
                  <p className="text-[#121212] mb-2">
                    Ensure:
                  </p>
                  <ul className="list-disc list-inside text-[#121212] space-y-1">
                    <li>User is verified (unverified users can't generate codes)</li>
                    <li>Check referral_codes table in Supabase</li>
                    <li>Try regenerating code from user details</li>
                  </ul>
                </div>
                <div className="p-4 border border-[#8861d4]/30 bg-[#8861d4]/10 rounded-lg">
                  <p className="font-semibold text-[#8861d4] mb-2">Duplicate user after merge?</p>
                  <p className="text-[#121212] mb-2">
                    Points and referrals are merged; old user is marked inactive. If issues persist, contact engineering.
                  </p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Recalculating Positions">
              <p className="text-sm text-gray-500 mb-4">
                If queue positions seem incorrect, force a recalculation:
              </p>
              <CodeBlock code={`Admin Dashboard → Tools → Recalculate Queue Positions
This re-ranks all users by tier and points.
Completes in ~2 seconds for 10k users.`} />
            </CollapsibleSection>

            <CollapsibleSection title="Email Issues">
              <p className="text-sm text-gray-500 mb-4">
                If emails aren't being sent, check the Email Logs tab for bounce errors:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside text-[#121212]">
                <li>Status "bounced" = invalid email address</li>
                <li>Status "failed" = Resend API error (check logs)</li>
                <li>Status "pending" = still being delivered (wait 5 minutes)</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Duplicate Handling">
              <p className="text-sm text-gray-500 mb-4">
                When duplicates are detected, use the Users detail panel to:
              </p>
              <ol className="space-y-2 text-sm list-decimal list-inside mb-4 text-[#121212]">
                <li>Select the primary account (keep this one)</li>
                <li>Select the duplicate</li>
                <li>Click "Merge Accounts"</li>
              </ol>
              <p className="text-sm text-gray-500">
                Points and referrals combine. The duplicate is marked inactive and hidden from lists.
              </p>
            </CollapsibleSection>
          </section>

          <div className="mt-12 p-6 bg-[#f3ebf8] border border-[#dedede] rounded-lg print:bg-gray-50 print:border-gray-300">
            <h3 className="font-semibold text-[#3b1f59] mb-2">Need Help?</h3>
            <p className="text-sm text-[#121212]">
              For technical issues, check the Supabase dashboard logs or contact engineering. For product questions, refer to the suggestion box or product roadmap.
            </p>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

export default AdminWaitlistGuide;
