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
  const [error, setError] = useState<string | null>(null);
  const [totalSignups, setTotalSignups] = useState(0);
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"invites" | "name" | "date">("invites");
  const [showBulkEmailComposer, setShowBulkEmailComposer] = useState(false);
  const [showUserPreview, setShowUserPreview] = useState(false);
  const [userToDelete, setUserToDelete] = useState<WaitlistUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        .select("id, name, email, referral_code, invite_count, created_at")
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
      filtered = users.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          u.referral_code.toLowerCase().includes(term)
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
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-background border border-border">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ perspective: "1000px" }}>
              <StatsCard
                title="Total Signups"
                value={totalSignups}
                icon={Users}
                subtitle="all time"
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
                          {getTierName(getTierForPoints(user.invite_count * 10))}
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
                  <Table>
                    <TableHeader className="bg-muted">
                      <TableRow className="border-b border-border">
                        <TableHead className="text-foreground">Name</TableHead>
                        <TableHead className="text-foreground">Email</TableHead>
                        <TableHead className="text-foreground">Referral Code</TableHead>
                        <TableHead className="text-right text-foreground">Referrals</TableHead>
                        <TableHead className="text-foreground">Tier</TableHead>
                        <TableHead className="text-foreground">Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow
                            key={user.id}
                            className="hover:bg-muted border-b border-border"
                          >
                            <TableCell className="font-medium text-foreground">
                              {user.name}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {user.email}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {user.referral_code}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-foreground">
                              {user.invite_count}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-primary/10 text-primary border-primary/30"
                              >
                                {getTierName(getTierForPoints(user.invite_count * 10))}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {format(new Date(user.created_at), "MMM dd, yyyy")}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12">
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

          {/* Emails Tab */}
          <TabsContent value="emails" className="space-y-4">
            <div className="flex gap-3">
              <Button
                onClick={() => setShowBulkEmailComposer(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Mail className="h-4 w-4 mr-2" />
                Compose Email
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
    </AdminLayout>
  );
};

export default AdminStoryBuilders;
