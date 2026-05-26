import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  TrendingUp,
  Mail,
  Settings,
  Download,
  Send,
  Search,
  Eye,
  Lightbulb,
  Trash2,
  Crown,
  CheckCircle2,
  XCircle,
  BellRing,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import UserPreviewMode from "@/components/admin/UserPreviewMode";
import SuggestionBoard from "@/components/admin/SuggestionBoard";
import StatsCard from "@/components/admin/StatsCard";
import WaitlistAnalyticsChart from "@/components/admin/WaitlistAnalyticsChart";
import BulkEmailComposer from "@/components/admin/BulkEmailComposer";
import { getTierName, getTierForPoints } from "@/lib/waitlist-utils";
import { formatRole } from "@/lib/storypros-roles";
import { AGE_RANGES, HOPE_OPTIONS, formatHopes } from "@/lib/storypros-profile";
import StoryProsUserDetailModal, { AdminWaitlistUser } from "@/components/admin/StoryProsUserDetailModal";
import FounderClaimsPanel from "@/components/admin/FounderClaimsPanel";
import { format } from "date-fns";

type WaitlistUser = AdminWaitlistUser;

const AdminStoryBuilders = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalSignups, setTotalSignups] = useState(0);
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"invites" | "name" | "date">("invites");
  const [showBulkEmailComposer, setShowBulkEmailComposer] = useState(false);
  const [showUserPreview, setShowUserPreview] = useState(false);
  const [userToDelete, setUserToDelete] = useState<WaitlistUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [ageFilter, setAgeFilter] = useState<string>("any");
  const [hopeFilter, setHopeFilter] = useState<string>("any");
  const [detailUser, setDetailUser] = useState<WaitlistUser | null>(null);
  const [verifiedFilter, setVerifiedFilter] = useState<"any" | "verified" | "unverified">("any");
  const [emailLogs, setEmailLogs] = useState<Record<string, { template_name: string; status: string; created_at: string; opened_at: string | null; clicked_at: string | null }>>({});
  const [nudgeOpen, setNudgeOpen] = useState(false);
  const [nudgeCount, setNudgeCount] = useState<number | null>(null);
  const [nudgeLoading, setNudgeLoading] = useState(false);

  const handleDeleteUser = useCallback(async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const { data, error } = await supabase.rpc(
        "admin_soft_delete_waitlist_entry" as never,
        { p_id: userToDelete.id, p_reason: "Removed by admin" } as never,
      );
      if (error) throw error;
      const result: any = Array.isArray(data) ? (data as any[])[0] : data;
      if (result && result.success === false) {
        toast.error((result.message as string) || "Could not delete");
      } else {
        toast.success(`Removed ${userToDelete.name} from the waitlist`);
        setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
        setTotalSignups((n) => Math.max(0, n - 1));
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      toast.error(`Delete failed: ${message}`);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  }, [userToDelete]);

  const fetchUsers = useCallback(async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("storybuilders_waitlist")
        .select("id, name, email, referral_code, invite_count, points, email_verified, created_at, role, role_other, child_age, hopes, hopes_other, hear_about, profile_completed_at")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(`Failed to load users: ${fetchError.message}`);
        return;
      }

      if (data) {
        setUsers(data);
        setTotalSignups(data.length);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      setError(`Error fetching users: ${message}`);
      console.error("Error fetching users:", error);
    }
  }, []);

  const fetchEmailLogs = useCallback(async () => {
    const { data } = await supabase
      .from("email_send_log" as never)
      .select("recipient_email, template_name, status, created_at, opened_at, clicked_at")
      .order("created_at", { ascending: false })
      .limit(2000);
    if (!data) return;
    const map: Record<string, { template_name: string; status: string; created_at: string; opened_at: string | null; clicked_at: string | null }> = {};
    for (const row of data as Array<{ recipient_email: string; template_name: string; status: string; created_at: string; opened_at: string | null; clicked_at: string | null }>) {
      const key = row.recipient_email?.toLowerCase();
      if (key && !map[key]) map[key] = { template_name: row.template_name, status: row.status, created_at: row.created_at, opened_at: row.opened_at, clicked_at: row.clicked_at };
    }
    setEmailLogs(map);
  }, []);

  const openNudgeDialog = useCallback(async () => {
    setNudgeOpen(true);
    setNudgeCount(null);
    try {
      const { data, error } = await supabase.functions.invoke("admin-nudge-unverified", {
        body: { dry_run: true },
      });
      if (error) throw error;
      setNudgeCount((data as { would_send_to?: number })?.would_send_to ?? 0);
    } catch (e) {
      toast.error(`Preview failed: ${e instanceof Error ? e.message : "unknown"}`);
      setNudgeCount(0);
    }
  }, []);

  const sendNudge = useCallback(async () => {
    setNudgeLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-nudge-unverified", {
        body: { dry_run: false },
      });
      if (error) throw error;
      const res = data as { sent?: number; failed?: number };
      toast.success(`Nudge sent to ${res?.sent ?? 0} unverified users${res?.failed ? ` (${res.failed} failed)` : ""}`);
      setNudgeOpen(false);
      fetchEmailLogs();
    } catch (e) {
      toast.error(`Send failed: ${e instanceof Error ? e.message : "unknown"}`);
    } finally {
      setNudgeLoading(false);
    }
  }, [fetchEmailLogs]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchUsers(), fetchEmailLogs()]);
      setIsLoading(false);
    };
    loadData();

    // Live-sync the admin table with user activity (points, referrals,
    // verifications, signups). Without this the admin only sees the snapshot
    // from page load and tiers/points appear frozen.
    const channel = supabase
      .channel("admin_storybuilders_waitlist_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "storybuilders_waitlist",
        },
        () => {
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchUsers]);

  const handleExportCSV = useCallback(() => {
    if (users.length === 0) return;

    const csv = [
      ["Name", "Email", "Referral Code", "Referrals", "Joined"],
      ...users.map((u) => [
        u.name,
        u.email,
        u.referral_code,
        u.invite_count,
        format(new Date(u.created_at), "MMM dd, yyyy"),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
    element.setAttribute("download", `story-pros-waitlist-${Date.now()}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, [users]);

  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          u.referral_code.toLowerCase().includes(term)
      );
    }

    if (ageFilter !== "any") {
      const range = AGE_RANGES.find((r) => r.value === ageFilter);
      if (range) {
        filtered = filtered.filter((u) => u.child_age != null && range.test(u.child_age));
      }
    }

    if (hopeFilter !== "any") {
      filtered = filtered.filter((u) => Array.isArray(u.hopes) && u.hopes.includes(hopeFilter));
    }

    if (verifiedFilter === "verified") {
      filtered = filtered.filter((u) => u.email_verified);
    } else if (verifiedFilter === "unverified") {
      filtered = filtered.filter((u) => !u.email_verified);
    }

    if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "date") {
      filtered = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      filtered = [...filtered].sort((a, b) => b.invite_count - a.invite_count);
    }

    return filtered;
  }, [users, searchTerm, sortBy, ageFilter, hopeFilter, verifiedFilter]);

  const verifiedCount = useMemo(() => users.filter((u) => u.email_verified).length, [users]);
  const unverifiedCount = totalSignups - verifiedCount;

  const topReferrers = useMemo(() => {
    return [...users]
      .sort((a, b) => b.invite_count - a.invite_count)
      .slice(0, 5);
  }, [users]);

  const totalReferrals = useMemo(() => users.reduce((sum, u) => sum + u.invite_count, 0), [users]);
  const avgReferrals = totalSignups > 0 ? (totalReferrals / totalSignups).toFixed(1) : "0";

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading dashboard...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-secondary space-y-8">
          <div>
            <h1 className="text-4xl font-serif italic text-foreground tracking-tight">
              Story Pros Waitlist
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage the entire waitlist operation and monitor key metrics
            </p>
          </div>
          <Card className="border-red-500/50 bg-red-50 dark:bg-red-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">
                    Error Loading Data
                  </h3>
                  <p className="text-sm text-red-800 dark:text-red-300">
                    {error}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setIsLoading(true);
                    fetchUsers().then(() => setIsLoading(false));
                  }}
                  className="ml-4"
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-secondary space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-serif italic text-foreground tracking-tight">
              Story Pros Waitlist
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage the entire waitlist operation and monitor key metrics
            </p>
          </div>
          <Button
            onClick={() => setShowUserPreview(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            User Preview
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8 bg-background border border-border">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger
              value="referrals"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Referrals</span>
            </TabsTrigger>
            <TabsTrigger
              value="suggestions"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
            >
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Suggestions</span>
            </TabsTrigger>
            <TabsTrigger
              value="founders"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
            >
              <Crown className="h-4 w-4" />
              <span className="hidden sm:inline">Founders</span>
            </TabsTrigger>
            <TabsTrigger
              value="emails"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Emails</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" style={{ perspective: "1000px" }}>
              <StatsCard
                title="Total Signups"
                value={totalSignups}
                icon={Users}
                subtitle="all time"
              />
              <StatsCard
                title="Verified"
                value={verifiedCount}
                icon={CheckCircle2}
                subtitle={totalSignups ? `${Math.round((verifiedCount / totalSignups) * 100)}% of signups` : "—"}
              />
              <StatsCard
                title="Unverified"
                value={unverifiedCount}
                icon={XCircle}
                subtitle="awaiting email confirm"
              />
              <StatsCard
                title="Total Referrals"
                value={totalReferrals}
                icon={TrendingUp}
                subtitle="across all users"
              />
              <StatsCard
                title="Avg Referrals"
                value={avgReferrals}
                icon={TrendingUp}
                subtitle="per user"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-background border border-border rounded-2xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-serif italic text-foreground">
                      Signups Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WaitlistAnalyticsChart />
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-background border border-border rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-serif italic text-foreground">
                    Top Referrers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topReferrers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between pb-3 border-b border-border last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate text-foreground">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="text-right ml-2">
                        <p className="font-semibold text-sm text-foreground">
                          {user.invite_count} referrals
                        </p>
                        <Badge
                          variant="outline"
                          className="text-xs mt-1 bg-primary/10 text-primary border-primary/30"
                        >
                          {getTierName(getTierForPoints(user.points || 0))}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {topReferrers.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No referrals yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or referral code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as "invites" | "name" | "date")}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invites">Referrals (High)</SelectItem>
                  <SelectItem value="date">Newest</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ageFilter} onValueChange={setAgeFilter}>
                <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Child age" /></SelectTrigger>
                <SelectContent>
                  {AGE_RANGES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={hopeFilter} onValueChange={setHopeFilter}>
                <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Hope" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any hope</SelectItem>
                  {HOPE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={verifiedFilter} onValueChange={(v) => setVerifiedFilter(v as typeof verifiedFilter)}>
                <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Verified" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any status</SelectItem>
                  <SelectItem value="verified">Verified only</SelectItem>
                  <SelectItem value="unverified">Unverified only</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleExportCSV}
                variant="outline"
                size="sm"
                className="border-border text-foreground hover:bg-muted"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                onClick={() => setShowBulkEmailComposer(true)}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>

            <Card className="bg-background border border-border rounded-2xl shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table className="min-w-[1300px]">
                    <TableHeader className="bg-muted">
                       <TableRow className="border-b border-border">
                        <TableHead className="text-foreground">Name</TableHead>
                        <TableHead className="text-foreground">Email</TableHead>
                        <TableHead className="text-foreground">Verified</TableHead>
                        <TableHead className="text-foreground">Last email</TableHead>
                        <TableHead className="text-foreground">Role</TableHead>
                        <TableHead className="text-foreground">Child Age</TableHead>
                        <TableHead className="text-foreground">Hopes</TableHead>
                        <TableHead className="text-right text-foreground">Referrals</TableHead>
                        <TableHead className="text-foreground">Tier</TableHead>
                        <TableHead className="text-foreground">Joined</TableHead>
                        <TableHead className="text-right text-foreground w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow
                            key={user.id}
                            className="hover:bg-muted border-b border-border cursor-pointer"
                            onClick={() => setDetailUser(user)}
                          >
                            <TableCell className="font-medium text-foreground">
                              <button
                                type="button"
                                className="text-left hover:text-primary hover:underline"
                                onClick={(e) => { e.stopPropagation(); setDetailUser(user); }}
                              >
                                {user.name}
                              </button>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {user.email}
                            </TableCell>
                            <TableCell>
                              {user.email_verified ? (
                                <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
                                  <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                                  <XCircle className="h-3 w-3 mr-1" /> Pending
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {(() => {
                                const log = emailLogs[user.email?.toLowerCase()];
                                if (!log) return <span className="italic text-muted-foreground/60">none logged</span>;
                                return (
                                  <div className="space-y-0.5">
                                    <div className="font-medium text-foreground truncate max-w-[180px]" title={log.template_name}>
                                      {log.template_name}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className={
                                        log.status === "sent" ? "text-green-700"
                                          : log.status === "pending" ? "text-amber-700"
                                          : "text-red-700"
                                      }>{log.status}</span>
                                      <span>· {format(new Date(log.created_at), "MMM d, h:mma")}</span>
                                    </div>
                                  </div>
                                );
                              })()}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {user.role
                                ? formatRole(user.role, user.role_other)
                                : <span className="italic text-muted-foreground/60">—</span>}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {user.child_age != null ? user.child_age : <span className="italic text-muted-foreground/60">—</span>}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground max-w-[220px] truncate" title={formatHopes(user.hopes)}>
                              {formatHopes(user.hopes)}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-foreground">
                              {user.invite_count}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-primary/10 text-primary border-primary/30"
                              >
                                {getTierName(getTierForPoints(user.points || 0))}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {format(new Date(user.created_at), "MMM dd, yyyy")}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={(e) => { e.stopPropagation(); setUserToDelete(user); }}
                                aria-label={`Delete ${user.name}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={11} className="text-center py-12">
                            <p className="text-muted-foreground">
                              {users.length === 0 ? "No users in the waitlist yet" : "No results matching your search"}
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-4">
            <Card className="bg-background border border-border rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif italic text-foreground">
                  Referral Network Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Referral Chains</p>
                    <p className="text-2xl font-bold text-foreground">
                      {users.filter((u) => u.invite_count > 0).length}
                    </p>
                  </div>
                  <div className="p-4 bg-muted border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Referrals Made</p>
                    <p className="text-2xl font-bold text-foreground">
                      {totalReferrals}
                    </p>
                  </div>
                  <div className="p-4 bg-muted border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground">Avg Referrals Per User</p>
                    <p className="text-2xl font-bold text-foreground">
                      {avgReferrals}
                    </p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-accent border border-primary/20 rounded-lg">
                  <p className="text-sm text-foreground">
                    <strong>Note:</strong> Detailed referral network visualization is coming soon. For now, use the Users tab to analyze individual referral chains.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Founder Claims Tab */}
          <TabsContent value="founders" className="space-y-4">
            <Card className="bg-background border border-border rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif italic text-foreground">
                  Founder Claims
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FounderClaimsPanel />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emails Tab */}
          <TabsContent value="emails" className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setShowBulkEmailComposer(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Mail className="h-4 w-4 mr-2" />
                Compose Email
              </Button>
              <Button
                onClick={openNudgeDialog}
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                <BellRing className="h-4 w-4 mr-2" />
                Resend nudge to unverified ({unverifiedCount})
              </Button>
            </div>

            <Card className="bg-background border border-border rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif italic text-foreground">
                  Email Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-accent border border-primary/20 rounded-lg">
                  <p className="text-sm text-foreground">
                    Use the Compose Email button to send bulk emails to your waitlist members. Email history will appear here once campaigns are sent.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-4">
            <Card className="bg-background border border-border rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif italic text-foreground">
                  Community Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SuggestionBoard />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="bg-background border border-border rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif italic text-foreground">
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-accent border border-primary/20 rounded-lg">
                  <p className="text-sm text-foreground">
                    Settings management interface coming soon. You can configure tier rewards, point values, launch dates, and community milestones.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {showBulkEmailComposer && (
        <BulkEmailComposer
          users={users}
          onClose={() => setShowBulkEmailComposer(false)}
        />
      )}

      {showUserPreview && (
        <UserPreviewMode onClose={() => setShowUserPreview(false)} />
      )}

      <StoryProsUserDetailModal
        user={detailUser}
        open={!!detailUser}
        onOpenChange={(open) => !open && setDetailUser(null)}
        onSaved={() => fetchUsers()}
      />

      <AlertDialog
        open={!!userToDelete}
        onOpenChange={(open) => !open && !isDeleting && setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from waitlist?</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft-delete <strong>{userToDelete?.name}</strong> ({userToDelete?.email}).
              They will no longer appear in the waitlist or receive emails. The record is kept
              for analytics, and the email is freed so they can rejoin if they want.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteUser();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Removing..." : "Remove user"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={nudgeOpen} onOpenChange={(o) => !o && !nudgeLoading && setNudgeOpen(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resend nudge to unverified signups?</AlertDialogTitle>
            <AlertDialogDescription>
              This sends a friendly "did our email land in spam?" message with a fresh verification link
              from <strong>hello@mail.empowereddld.com</strong> to every unverified Story Pros signup.
              {nudgeCount === null ? (
                <span className="block mt-3 text-muted-foreground">Calculating recipients...</span>
              ) : (
                <span className="block mt-3 font-medium text-foreground">
                  {nudgeCount} {nudgeCount === 1 ? "person" : "people"} will receive this email.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={nudgeLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); sendNudge(); }}
              disabled={nudgeLoading || nudgeCount === null || nudgeCount === 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {nudgeLoading ? "Sending..." : `Send nudge${nudgeCount ? ` to ${nudgeCount}` : ""}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminStoryBuilders;
