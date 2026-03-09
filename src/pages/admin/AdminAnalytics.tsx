import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";
import StatsCard from "@/components/admin/StatsCard";
import { DollarSign, TrendingUp, Users as UsersIcon, Download } from "lucide-react";

const COLORS = ["hsl(258,50%,50%)", "hsl(4,77%,67%)", "hsl(270,30%,82%)", "hsl(328,33%,60%)", "hsl(213,19%,72%)"];
const RANGE_OPTIONS = [
  { label: "30 days", value: 30 },
  { label: "60 days", value: 60 },
  { label: "90 days", value: 90 },
];

const AdminAnalytics = () => {
  const [range, setRange] = useState(30);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-analytics", range],
    queryFn: async () => {
      const since = subDays(new Date(), range).toISOString();

      const [usersRes, resourcesRes, profilesRes, purchasesRes] = await Promise.all([
        supabase.from("profiles").select("id, created_at").gte("created_at", since),
        supabase.from("resources").select("id, title, download_count, roles"),
        supabase.from("profiles").select("role"),
        supabase.from("purchases").select("*"),
      ]);

      // Signups over time
      const signupsByDay: Record<string, number> = {};
      for (let i = 0; i < range; i++) {
        const d = format(subDays(new Date(), i), "yyyy-MM-dd");
        signupsByDay[d] = 0;
      }
      (usersRes.data || []).forEach((u) => {
        const d = format(new Date(u.created_at), "yyyy-MM-dd");
        if (signupsByDay[d] !== undefined) signupsByDay[d]++;
      });
      const signupsChart = Object.entries(signupsByDay)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date: format(new Date(date), "MMM d"), count }));

      // Downloads per resource (top 10)
      const downloadsChart = [...(resourcesRes.data || [])]
        .sort((a, b) => (b.download_count || 0) - (a.download_count || 0))
        .slice(0, 10)
        .map((r) => ({ name: r.title.slice(0, 25), downloads: r.download_count || 0 }));

      // Role breakdown
      const roleCounts: Record<string, number> = {};
      (profilesRes.data || []).forEach((p) => {
        const label = { parent: "Parents", slp: "Therapists", educator: "Educators", school_leader: "School Leaders", other: "Other" }[p.role] || p.role;
        roleCounts[label] = (roleCounts[label] || 0) + 1;
      });
      const roleChart = Object.entries(roleCounts).map(([name, value]) => ({ name, value }));

      // Revenue data
      const allPurchases = purchasesRes.data || [];
      const completedPurchases = allPurchases.filter((p) => p.status === "completed");
      const totalRevenue = completedPurchases.reduce((s, p) => s + (p.amount_paid || 0), 0);

      const now = new Date();
      const thisMonthPurchases = completedPurchases.filter((p) => {
        const d = new Date(p.purchased_at);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
      const monthRevenue = thisMonthPurchases.reduce((s, p) => s + (p.amount_paid || 0), 0);

      // Revenue by product
      const { data: products } = await supabase.from("products").select("id, resource_id");
      const { data: allResources } = await supabase.from("resources").select("id, title");
      const resMap = Object.fromEntries((allResources || []).map((r) => [r.id, r.title]));

      const revenueByProduct: Record<string, number> = {};
      completedPurchases.forEach((p) => {
        const title = resMap[p.resource_id] || "Unknown";
        revenueByProduct[title] = (revenueByProduct[title] || 0) + (p.amount_paid || 0);
      });
      const revenueChart = Object.entries(revenueByProduct)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([name, value]) => ({ name: name.slice(0, 25), revenue: value / 100 }));

      const refundCount = allPurchases.filter((p) => p.status === "refunded").length;
      const refundRate = allPurchases.length > 0 ? ((refundCount / allPurchases.length) * 100).toFixed(1) : "0";

      return { signupsChart, downloadsChart, roleChart, totalRevenue, monthRevenue, revenueChart, refundRate, totalOrders: allPurchases.length };
    },
  });

  const fmtPrice = (cents: number) => `CA$${(cents / 100).toFixed(2)}`;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex gap-1">
          {RANGE_OPTIONS.map((opt) => (
            <Button key={opt.value} variant={range === opt.value ? "default" : "outline"} size="sm" onClick={() => setRange(opt.value)}>
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Revenue" value={data ? fmtPrice(data.totalRevenue) : "—"} icon={DollarSign} />
        <StatsCard title="This Month" value={data ? fmtPrice(data.monthRevenue) : "—"} icon={TrendingUp} />
        <StatsCard title="Total Orders" value={data?.totalOrders?.toString() ?? "—"} icon={UsersIcon} />
        <StatsCard title="Refund Rate" value={data ? `${data.refundRate}%` : "—"} icon={Download} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Signups over time */}
          <div className="bg-card rounded-lg border border-border p-5">
            <h2 className="font-semibold mb-4">New Signups Over Time</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data?.signupsChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="hsl(258,50%,50%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue by product */}
          <div className="bg-card rounded-lg border border-border p-5">
            <h2 className="font-semibold mb-4">Revenue by Product</h2>
            {data?.revenueChart?.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.revenueChart} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(v) => `$${v}`} />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="hsl(328,33%,60%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">No revenue data yet</div>
            )}
          </div>

          {/* Downloads per resource */}
          <div className="bg-card rounded-lg border border-border p-5">
            <h2 className="font-semibold mb-4">Downloads per Resource (Top 10)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data?.downloadsChart} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="downloads" fill="hsl(4,77%,67%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* User breakdown by role */}
          <div className="bg-card rounded-lg border border-border p-5">
            <h2 className="font-semibold mb-4">Users by Role</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={data?.roleChart} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {data?.roleChart?.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAnalytics;
