import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import { useAdminStats } from "@/hooks/useAdminStats";
import { Users, Download, FileText, TrendingUp, FileCheck, FilePen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useAdminStats();

  const roleLabel = (r: string) =>
    ({ parent: "Parent", slp: "Therapist", educator: "Educator", school_leader: "School Leader", other: "Other" }[r] || r);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatsCard title="Total Users" value={stats?.totalUsers ?? 0} icon={Users} />
          <StatsCard title="New Users This Week" value={stats?.newUsersThisWeek ?? 0} icon={TrendingUp} />
          <StatsCard title="Total Downloads" value={stats?.totalDownloads ?? 0} icon={Download} />
          <StatsCard
            title="Most Downloaded"
            value={stats?.mostDownloaded?.name ?? "—"}
            subtitle={stats?.mostDownloaded ? `${stats.mostDownloaded.count} downloads` : undefined}
            icon={FileText}
          />
          <StatsCard title="Resources Published" value={stats?.totalPublished ?? 0} icon={FileCheck} />
          <StatsCard title="Resources in Draft" value={stats?.totalDrafts ?? 0} icon={FilePen} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Signups */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h2 className="font-semibold mb-4">Recent Signups</h2>
          {isLoading ? (
            <Skeleton className="h-48" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.recentUsers?.map((u: any) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.first_name}</TableCell>
                    <TableCell>{roleLabel(u.role)}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {format(new Date(u.created_at), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
                {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">No users yet</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Top Downloads */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h2 className="font-semibold mb-4">Top Downloaded Resources</h2>
          {isLoading ? (
            <Skeleton className="h-48" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Downloads</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.topResources?.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.title}</TableCell>
                    <TableCell className="capitalize">{r.resource_type}</TableCell>
                    <TableCell className="text-right">{r.download_count || 0}</TableCell>
                  </TableRow>
                ))}
                {(!stats?.topResources || stats.topResources.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">No resources yet</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
