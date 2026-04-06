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
} from "lucide-react";
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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">StoryBuilders Waitlist</h1>
          <p className="text-muted-foreground mt-2">
            Manage the waitlist and monitor key metrics
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
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
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  {topReferrers.map((user) => (
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
                          {user.invite_count} referrals
                        </p>
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
                        <TableHead className="text-right">Referrals</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell className="text-sm">{user.email}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {user.referral_code}
                          </TableCell>
                          <TableCell className="text-right">
                            {user.invite_count}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(user.created_at), "MMM dd, yyyy")}
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
            <Card>
              <CardHeader>
                <CardTitle>Referral Network Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Active Referrers</p>
                    <p className="text-2xl font-bold">
                      {users.filter((u) => u.invite_count > 0).length}
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
                      {totalSignups > 0 ? (users.reduce((sum, u) => sum + u.invite_count, 0) / totalSignups).toFixed(2) : "0"}
                    </p>
                  </div>
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
