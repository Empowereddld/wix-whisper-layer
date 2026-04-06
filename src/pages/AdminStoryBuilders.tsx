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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  AlertTriangle,
  Mail,
  Lightbulb,
  Settings,
  Download,
  Send,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import WaitlistAnalyticsChart from "@/components/admin/WaitlistAnalyticsChart";
import UserDetailModal from "@/components/admin/UserDetailModal";
import SuggestionBoard from "@/components/admin/SuggestionBoard";
import BulkEmailComposer from "@/components/admin/BulkEmailComposer";
import { getTierName, getTierColor } from "@/lib/waitlist-utils";
import { format } from "date-fns";

interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  referral_code: string;
  points: number;
  current_tier: number;
  invite_count: number;
  email_verified: boolean;
  flagged: boolean;
  created_at: string;
}

interface FraudLog {
  id: string;
  user_email: string;
  risk_score: number;
  reason: string;
  created_at: string;
  dismissed: boolean;
}

interface DashboardStats {
  total_signups: number;
  verified_count: number;
  avg_referrals: number;
  conversion_rate: number;
  signups_today: number;
  signups_this_week: number;
}

interface EmailLog {
  id: string;
  recipient_email: string;
  template: string;
  status: string;
  sent_at: string;
  opened_at: string | null;
  clicked_at: string | null;
}

const AdminStoryBuilders = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [fraudLogs, setFraudLogs] = useState<FraudLog[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [selectedUser, setSelectedUser] = useState<WaitlistUser | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"points" | "name" | "date">("points");
  const [filterTier, setFilterTier] = useState<number | "all">("all");
  const [fraudFilterRisk, setFraudFilterRisk] = useState<"all" | "high" | "medium">(
    "all"
  );
  const [showBulkEmailComposer, setShowBulkEmailComposer] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const response = await supabase.rpc("get_waitlist_analytics");
      if (response.data) {
        setStats(response.data as DashboardStats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("storybuilders_waitlist")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setUsers(data as WaitlistUser[]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  const fetchFraudLogs = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("waitlist_fraud_log")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setFraudLogs(data as FraudLog[]);
      }
    } catch (error) {
      console.error("Error fetching fraud logs:", error);
    }
  }, []);

  const fetchEmailLogs = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("waitlist_emails")
        .select("*")
        .order("sent_at", { ascending: false })
        .limit(100);

      if (data) {
        setEmailLogs(data as EmailLog[]);
      }
    } catch (error) {
      console.error("Error fetching email logs:", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchStats(), fetchUsers(), fetchFraudLogs(), fetchEmailLogs()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchStats, fetchUsers, fetchFraudLogs, fetchEmailLogs]);

  const handleExportCSV = useCallback(() => {
    if (users.length === 0) return;

    const csv = [
      ["Name", "Email", "Referral Code", "Points", "Tier", "Referrals", "Verified", "Flagged", "Joined"],
      ...users.map((u) => [
        u.name,
        u.email,
        u.referral_code,
        u.points,
        getTierName(u.current_tier),
        u.invite_count,
        u.email_verified ? "Yes" : "No",
        u.flagged ? "Yes" : "No",
        format(new Date(u.created_at), "MMM dd, yyyy"),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
    element.setAttribute("download", `storybuilders-waitlist-${Date.now()}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, [users]);

  const handleFlagUser = useCallback(
    async (userId: string, currentFlagged: boolean) => {
      try {
        await supabase
          .from("storybuilders_waitlist")
          .update({ flagged: !currentFlagged })
          .eq("id", userId);

        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, flagged: !u.flagged } : u
          )
        );

        if (selectedUser?.id === userId) {
          setSelectedUser({
            ...selectedUser,
            flagged: !selectedUser.flagged,
          });
        }
      } catch (error) {
        console.error("Error flagging user:", error);
      }
    },
    [selectedUser]
  );

  const handleDismissFraudAlert = useCallback(async (fraudId: string) => {
    try {
      await supabase
        .from("waitlist_fraud_log")
        .update({ dismissed: true })
        .eq("id", fraudId);

      setFraudLogs((prev) =>
        prev.filter((f) => f.id !== fraudId)
      );
    } catch (error) {
      console.error("Error dismissing fraud alert:", error);
    }
  }, []);

  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          u.referral_code.includes(term)
      );
    }

    if (filterTier !== "all") {
      filtered = filtered.filter((u) => u.current_tier === filterTier);
    }

    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      filtered.sort((a, b) => b.points - a.points);
    }

    return filtered;
  }, [users, searchTerm, filterTier, sortBy]);

  const filteredFraudLogs = useMemo(() => {
    let filtered = fraudLogs.filter((f) => !f.dismissed);

    if (fraudFilterRisk === "high") {
      filtered = filtered.filter((f) => f.risk_score >= 80);
    } else if (fraudFilterRisk === "medium") {
      filtered = filtered.filter((f) => f.risk_score >= 50 && f.risk_score < 80);
    }

    return filtered;
  }, [fraudLogs, fraudFilterRisk]);

  const topReferrers = useMemo(() => {
    return [...users]
      .sort((a, b) => b.invite_count - a.invite_count)
      .slice(0, 5);
  }, [users]);

  const conversionRate = useMemo(() => {
    if (!stats) return 0;
    const verified = stats.verified_count;
    const total = stats.total_signups;
    return total === 0 ? 0 : ((verified / total) * 100).toFixed(1);
  }, [stats]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading dashboard...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">StoryBuilders Waitlist</h1>
          <p className="text-muted-foreground mt-2">
            Manage the entire waitlist operation and monitor key metrics
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Referrals</span>
            </TabsTrigger>
            <TabsTrigger value="fraud" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Fraud</span>
            </TabsTrigger>
            <TabsTrigger value="emails" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Emails</span>
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Suggestions</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatsCard
                title="Total Signups"
                value={stats?.total_signups || 0}
                icon={Users}
                subtitle={`${stats?.signups_today || 0} today`}
              />
              <StatsCard
                title="Verified"
                value={`${conversionRate}%`}
                icon={CheckCircle}
                subtitle={`${stats?.verified_count || 0} users`}
              />
              <StatsCard
                title="Avg Referrals"
                value={stats?.avg_referrals.toFixed(1) || "0"}
                icon={TrendingUp}
                subtitle="per user"
              />
              <StatsCard
                title="This Week"
                value={stats?.signups_this_week || 0}
                icon={Clock}
                subtitle="new signups"
              />
              <StatsCard
                title="Conversion Rate"
                value={`${stats?.conversion_rate.toFixed(1) || 0}%`}
                icon={TrendingUp}
                subtitle="to verified"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Signups Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WaitlistAnalyticsChart />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Referrers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topReferrers.map((user, idx) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between pb-3 border-b last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="text-right ml-2">
                        <p className="font-semibold text-sm">
                          {user.invite_count}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {getTierName(user.current_tier)}
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
                  className="pl-10"
                />
              </div>
              <Select value={String(filterTier)} onValueChange={(v) => setFilterTier(v === "all" ? "all" : Number(v))}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="All tiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tiers</SelectItem>
                  {[0, 1, 2, 3, 4, 5].map((tier) => (
                    <SelectItem key={tier} value={String(tier)}>
                      {getTierName(tier)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as "points" | "name" | "date")}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="points">Points (High)</SelectItem>
                  <SelectItem value="date">Newest</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExportCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={() => setShowBulkEmailComposer(true)} size="sm">
                <Send className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Referral Code</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead className="text-right">Referrals</TableHead>
                        <TableHead className="text-center">Verified</TableHead>
                        <TableHead className="text-center">Flagged</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserDetail(true);
                          }}
                        >
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell className="text-sm">{user.email}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {user.referral_code}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {user.points}
                          </TableCell>
                          <TableCell>
                            <Badge
                              style={{
                                backgroundColor: getTierColor(user.current_tier) + "20",
                                color: getTierColor(user.current_tier),
                              }}
                            >
                              {getTierName(user.current_tier)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {user.invite_count}
                          </TableCell>
                          <TableCell className="text-center">
                            {user.email_verified ? (
                              <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                            ) : (
                              <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {user.flagged && (
                              <AlertTriangle className="h-4 w-4 text-amber-600 mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(user.created_at), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFlagUser(user.id, user.flagged);
                              }}
                            >
                              {user.flagged ? "Unflag" : "Flag"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {selectedUser && (
              <UserDetailModal
                user={selectedUser}
                open={showUserDetail}
                onOpenChange={setShowUserDetail}
                onFlagChange={() => {
                  handleFlagUser(selectedUser.id, selectedUser.flagged);
                  setSelectedUser({
                    ...selectedUser,
                    flagged: !selectedUser.flagged,
                  });
                }}
                onClose={() => setShowUserDetail(false)}
              />
            )}
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Referral Network Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Referral Chains</p>
                    <p className="text-2xl font-bold">
                      {users.filter((u) => u.referral_code && u.invite_count > 0).length}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Referrals Made</p>
                    <p className="text-2xl font-bold">
                      {users.reduce((sum, u) => sum + u.invite_count, 0)}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Avg Referrals Per User</p>
                    <p className="text-2xl font-bold">
                      {stats?.avg_referrals.toFixed(2) || "0"}
                    </p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> Detailed referral network visualization is coming soon. For now, use the Users tab to analyze individual referral chains.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fraud Tab */}
          <TabsContent value="fraud" className="space-y-4">
            <div className="flex gap-3">
              <Select value={fraudFilterRisk} onValueChange={(v) => setFraudFilterRisk(v as "all" | "high" | "medium")}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="high">High Risk (80+)</SelectItem>
                  <SelectItem value="medium">Medium Risk (50-79)</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Fraud Alerts ({filteredFraudLogs.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {filteredFraudLogs.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    No fraud alerts detected
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead className="text-right">Risk Score</TableHead>
                          <TableHead>Detected</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredFraudLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="font-medium">{log.user_email}</TableCell>
                            <TableCell>{log.reason}</TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant={
                                  log.risk_score >= 80
                                    ? "destructive"
                                    : log.risk_score >= 50
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {log.risk_score}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {format(new Date(log.created_at), "MMM dd, HH:mm")}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDismissFraudAlert(log.id)}
                              >
                                Dismiss
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emails Tab */}
          <TabsContent value="emails" className="space-y-4">
            <div className="flex gap-3">
              <Button onClick={() => setShowBulkEmailComposer(true)}>
                <Mail className="h-4 w-4 mr-2" />
                Compose Email
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Email Log (Last 100)</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Template</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Sent</TableHead>
                        <TableHead>Opened</TableHead>
                        <TableHead>Clicked</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {emailLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium text-sm">
                            {log.recipient_email}
                          </TableCell>
                          <TableCell className="text-sm">
                            {log.template.replace(/_/g, " ")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                log.status === "sent"
                                  ? "default"
                                  : log.status === "failed"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {log.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {format(new Date(log.sent_at), "MMM dd, HH:mm")}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {log.opened_at ? format(new Date(log.opened_at), "MMM dd, HH:mm") : "-"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {log.clicked_at ? format(new Date(log.clicked_at), "MMM dd, HH:mm") : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-4">
            <SuggestionBoard />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
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
    </AdminLayout>
  );
};

export default AdminStoryBuilders;
