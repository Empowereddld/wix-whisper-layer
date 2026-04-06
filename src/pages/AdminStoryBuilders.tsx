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
  Eye,
} from "lucide-react";
import UserPreviewMode from "@/components/admin/UserPreviewMode";
import StatsCard from "@/components/admin/StatsCard";
import WaitlistAnalyticsChart from "@/components/admin/WaitlistAnalyticsChart";
import BulkEmailComposer from "@/components/admin/BulkEmailComposer";
import { getTierName, getTierColor } from "@/lib/waitlist-utils";
import { format } from "date-fns";

// Aligned with actual storybuilders_waitlist table columns
interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  referral_code: string;
  invite_count: number;
  created_at: string;
}

const AdminStoryBuilders = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [totalSignups, setTotalSignups] = useState(0);
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"invites" | "name" | "date">("invites");
  const [showBulkEmailComposer, setShowBulkEmailComposer] = useState(false);
  const [showUserPreview, setShowUserPreview] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("storybuilders_waitlist")
        .select("id, name, email, referral_code, invite_count, created_at")
        .order("created_at", { ascending: false });

      if (data) {
        setUsers(data);
        setTotalSignups(data.length);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchUsers();
      setIsLoading(false);
    };
    loadData();
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
    element.setAttribute("download", `storybuilders-waitlist-${Date.now()}.csv`);
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
          u.referral_code.includes(term)
      );
    }

    if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "date") {
      filtered = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      filtered = [...filtered].sort((a, b) => b.invite_count - a.invite_count);
    }

    return filtered;
  }, [users, searchTerm, sortBy]);

  const topReferrers = useMemo(() => {
    return [...users]
      .sort((a, b) => b.invite_count - a.invite_count)
      .slice(0, 5);
  }, [users]);

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
      <div className="min-h-screen bg-[#FDF8F0] space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-serif italic text-[#3D2B1F] tracking-tight">
              StoryBuilders Waitlist
            </h1>
            <p className="text-[#8B7355] mt-2">
              Manage the entire waitlist operation and monitor key metrics
            </p>
          </div>
          <Button
            onClick={() => setShowUserPreview(true)}
            className="bg-[#C67B5C] hover:bg-[#B86B4C] text-white flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            User Preview
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8 bg-[#FEFCF9] border border-[#E8DDD0]">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 data-[state=active]:bg-[#D4A574] data-[state=active]:text-[#3D2B1F] text-[#8B7355]"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex items-center gap-2 data-[state=active]:bg-[#D4A574] data-[state=active]:text-[#3D2B1F] text-[#8B7355]"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger
              value="referrals"
              className="flex items-center gap-2 data-[state=active]:bg-[#D4A574] data-[state=active]:text-[#3D2B1F] text-[#8B7355]"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Referrals</span>
            </TabsTrigger>
            <TabsTrigger
              value="fraud"
              className="flex items-center gap-2 data-[state=active]:bg-[#D4A574] data-[state=active]:text-[#3D2B1F] text-[#8B7355]"
            >
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Fraud</span>
            </TabsTrigger>
            <TabsTrigger
              value="emails"
              className="flex items-center gap-2 data-[state=active]:bg-[#D4A574] data-[state=active]:text-[#3D2B1F] text-[#8B7355]"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Emails</span>
            </TabsTrigger>
            <TabsTrigger
              value="suggestions"
              className="flex items-center gap-2 data-[state=active]:bg-[#D4A574] data-[state=active]:text-[#3D2B1F] text-[#8B7355]"
            >
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Suggestions</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 data-[state=active]:bg-[#D4A574] data-[state=active]:text-[#3D2B1F] text-[#8B7355]"
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
                title="Total Referrals"
                value={users.reduce((sum, u) => sum + u.invite_count, 0)}
                icon={TrendingUp}
                subtitle="across all users"
              />
              <StatsCard
                title="Avg Referrals"
                value={totalSignups > 0 ? (users.reduce((sum, u) => sum + u.invite_count, 0) / totalSignups).toFixed(1) : "0"}
                icon={TrendingUp}
                subtitle="per user"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-[#FEFCF9] border border-[#E8DDD0] rounded-2xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-serif italic text-[#3D2B1F]">
                      Signups Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WaitlistAnalyticsChart />
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-[#FEFCF9] border border-[#E8DDD0] rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-serif italic text-[#3D2B1F]">
                    Top Referrers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topReferrers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between pb-3 border-b border-[#E8DDD0] last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate text-[#3D2B1F]">
                          {user.name}
                        </p>
                        <p className="text-xs text-[#8B7355] truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="text-right ml-2">
                        <p className="font-semibold text-sm text-[#3D2B1F]">
                          {user.invite_count}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-xs mt-1 bg-[#D4A574] text-[#3D2B1F] border-[#C67B5C]"
                        >
                          {getTierName(user.current_tier)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {topReferrers.length === 0 && (
                    <p className="text-sm text-[#8B7355] text-center py-4">
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
                <Search className="absolute left-3 top-3 h-4 w-4 text-[#8B7355]" />
                <Input
                  placeholder="Search by name, email, or referral code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#FEFCF9] border-[#E8DDD0] text-[#3D2B1F] placeholder:text-[#8B7355]"
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
              <Button
                onClick={handleExportCSV}
                variant="outline"
                size="sm"
                className="border-[#E8DDD0] text-[#3D2B1F] hover:bg-[#F5F0E8]"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                onClick={() => setShowBulkEmailComposer(true)}
                size="sm"
                className="bg-[#C67B5C] hover:bg-[#B86B4C] text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>

            <Card className="bg-[#FEFCF9] border border-[#E8DDD0] rounded-2xl shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-[#F5F0E8]">
                      <TableRow className="border-b border-[#E8DDD0]">
                        <TableHead className="text-[#3D2B1F]">Name</TableHead>
                        <TableHead className="text-[#3D2B1F]">Email</TableHead>
                        <TableHead className="text-[#3D2B1F]">Referral Code</TableHead>
                        <TableHead className="text-right text-[#3D2B1F]">Points</TableHead>
                        <TableHead className="text-[#3D2B1F]">Tier</TableHead>
                        <TableHead className="text-right text-[#3D2B1F]">Referrals</TableHead>
                        <TableHead className="text-center text-[#3D2B1F]">Verified</TableHead>
                        <TableHead className="text-center text-[#3D2B1F]">Flagged</TableHead>
                        <TableHead className="text-[#3D2B1F]">Joined</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          className="cursor-pointer hover:bg-[#F5F0E8] border-b border-[#E8DDD0]"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserDetail(true);
                          }}
                        >
                          <TableCell className="font-medium text-[#3D2B1F]">
                            {user.name}
                          </TableCell>
                          <TableCell className="text-sm text-[#5C4033]">
                            {user.email}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-[#8B7355]">
                            {user.referral_code}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-[#3D2B1F]">
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
                          <TableCell className="text-right text-[#3D2B1F]">
                            {user.invite_count}
                          </TableCell>
                          <TableCell className="text-center">
                            {user.email_verified ? (
                              <CheckCircle className="h-4 w-4 text-[#7CB342] mx-auto" />
                            ) : (
                              <XCircle className="h-4 w-4 text-[#8B7355] mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {user.flagged && (
                              <AlertTriangle className="h-4 w-4 text-[#D4A574] mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-[#8B7355]">
                            {format(new Date(user.created_at), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#C67B5C] hover:bg-[#F5F0E8]"
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
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-4">
            <Card className="bg-[#FEFCF9] border border-[#E8DDD0] rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif italic text-[#3D2B1F]">
                  Referral Network Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#F5F0E8] border border-[#E8DDD0] rounded-lg">
                    <p className="text-sm text-[#8B7355]">Total Referral Chains</p>
                    <p className="text-2xl font-bold text-[#3D2B1F]">
                      {users.filter((u) => u.referral_code && u.invite_count > 0).length}
                    </p>
                  </div>
                  <div className="p-4 bg-[#F5F0E8] border border-[#E8DDD0] rounded-lg">
                    <p className="text-sm text-[#8B7355]">Total Referrals Made</p>
                    <p className="text-2xl font-bold text-[#3D2B1F]">
                      {users.reduce((sum, u) => sum + u.invite_count, 0)}
                    </p>
                  </div>
                  <div className="p-4 bg-[#F5F0E8] border border-[#E8DDD0] rounded-lg">
                    <p className="text-sm text-[#8B7355]">Avg Referrals Per User</p>
                    <p className="text-2xl font-bold text-[#3D2B1F]">
                      {stats?.avg_referrals.toFixed(2) || "0"}
                    </p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-[#E8D5C4] border border-[#D4A574] rounded-lg">
                  <p className="text-sm text-[#5C4033]">
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
                <SelectTrigger className="w-48 bg-[#FEFCF9] border-[#E8DDD0] text-[#3D2B1F]">
                  <SelectValue placeholder="Filter by risk" />
                </SelectTrigger>
                <SelectContent className="bg-[#FEFCF9]">
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="high">High Risk (80+)</SelectItem>
                  <SelectItem value="medium">Medium Risk (50-79)</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="border-[#E8DDD0] text-[#3D2B1F] hover:bg-[#F5F0E8]"
              >
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>

            <Card className="bg-[#FEFCF9] border border-[#E8DDD0] rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif italic text-[#3D2B1F]">
                  Fraud Alerts ({filteredFraudLogs.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {filteredFraudLogs.length === 0 ? (
                  <div className="p-6 text-center text-[#8B7355]">
                    No fraud alerts detected
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-[#F5F0E8]">
                        <TableRow className="border-b border-[#E8DDD0]">
                          <TableHead className="text-[#3D2B1F]">Email</TableHead>
                          <TableHead className="text-[#3D2B1F]">Reason</TableHead>
                          <TableHead className="text-right text-[#3D2B1F]">
                            Risk Score
                          </TableHead>
                          <TableHead className="text-[#3D2B1F]">Detected</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredFraudLogs.map((log) => (
                          <TableRow key={log.id} className="border-b border-[#E8DDD0]">
                            <TableCell className="font-medium text-[#3D2B1F]">
                              {log.user_email}
                            </TableCell>
                            <TableCell className="text-[#5C4033]">{log.reason}</TableCell>
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
                            <TableCell className="text-sm text-[#8B7355]">
                              {format(new Date(log.created_at), "MMM dd, HH:mm")}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#C67B5C] hover:bg-[#F5F0E8]"
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
              <Button
                onClick={() => setShowBulkEmailComposer(true)}
                className="bg-[#C67B5C] hover:bg-[#B86B4C] text-white"
              >
                <Mail className="h-4 w-4 mr-2" />
                Compose Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[#E8DDD0] text-[#3D2B1F] hover:bg-[#F5F0E8]"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <Card className="bg-[#FEFCF9] border border-[#E8DDD0] rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif italic text-[#3D2B1F]">
                  Email Log (Last 100)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-[#F5F0E8]">
                      <TableRow className="border-b border-[#E8DDD0]">
                        <TableHead className="text-[#3D2B1F]">Recipient</TableHead>
                        <TableHead className="text-[#3D2B1F]">Template</TableHead>
                        <TableHead className="text-[#3D2B1F]">Status</TableHead>
                        <TableHead className="text-[#3D2B1F]">Sent</TableHead>
                        <TableHead className="text-[#3D2B1F]">Opened</TableHead>
                        <TableHead className="text-[#3D2B1F]">Clicked</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {emailLogs.map((log) => (
                        <TableRow key={log.id} className="border-b border-[#E8DDD0]">
                          <TableCell className="font-medium text-sm text-[#3D2B1F]">
                            {log.recipient_email}
                          </TableCell>
                          <TableCell className="text-sm text-[#5C4033]">
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
                          <TableCell className="text-xs text-[#8B7355]">
                            {format(new Date(log.sent_at), "MMM dd, HH:mm")}
                          </TableCell>
                          <TableCell className="text-xs text-[#8B7355]">
                            {log.opened_at ? format(new Date(log.opened_at), "MMM dd, HH:mm") : "-"}
                          </TableCell>
                          <TableCell className="text-xs text-[#8B7355]">
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
            <div className="bg-[#FEFCF9] border border-[#E8DDD0] rounded-2xl shadow-sm p-6">
              <SuggestionBoard />
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="bg-[#FEFCF9] border border-[#E8DDD0] rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif italic text-[#3D2B1F]">
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-[#E8D5C4] border border-[#D4A574] rounded-lg">
                  <p className="text-sm text-[#5C4033]">
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
    </AdminLayout>
  );
};

export default AdminStoryBuilders;
