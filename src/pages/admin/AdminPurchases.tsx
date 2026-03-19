import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Download, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, subDays, startOfDay, startOfWeek, startOfMonth, isAfter } from "date-fns";
import { toast } from "sonner";
import StatsCard from "@/components/admin/StatsCard";

const AdminPurchases = () => {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-purchases"],
    queryFn: async () => {
      const { data: purchases } = await supabase
        .from("purchases")
        .select("*")
        .order("purchased_at", { ascending: false });

      const { data: profiles } = await supabase.from("profiles").select("id, first_name, last_name");
      const { data: resources } = await supabase.from("resources").select("id, title");

      const profileMap = Object.fromEntries((profiles || []).map((p) => [p.id, `${p.first_name} ${p.last_name || ""}`.trim()]));
      const resMap = Object.fromEntries((resources || []).map((r) => [r.id, r.title]));

      const rows = (purchases || []).map((p) => ({
        ...p,
        customer_name: profileMap[p.user_id] || "Unknown",
        product_title: resMap[p.resource_id] || "Unknown",
      }));

      const now = new Date();
      const completed = rows.filter((r) => r.status === "completed");

      const todayStart = startOfDay(now);
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const monthStart = startOfMonth(now);

      const todayPurchases = completed.filter((r) => isAfter(new Date(r.purchased_at), todayStart));
      const weekPurchases = completed.filter((r) => isAfter(new Date(r.purchased_at), weekStart));
      const monthPurchases = completed.filter((r) => isAfter(new Date(r.purchased_at), monthStart));

      const sum = (arr: typeof completed) => arr.reduce((s, r) => s + (r.amount_paid || 0), 0);

      // Last 7 days breakdown for trend
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const day = subDays(now, 6 - i);
        const dayStart = startOfDay(day);
        const dayEnd = i < 6 ? startOfDay(subDays(now, 5 - i)) : new Date(now.getTime() + 86400000);
        const dayPurchases = completed.filter(
          (r) => new Date(r.purchased_at) >= dayStart && new Date(r.purchased_at) < dayEnd
        );
        return {
          label: format(day, "EEE"),
          date: format(day, "MMM d"),
          count: dayPurchases.length,
          revenue: sum(dayPurchases),
        };
      });

      return {
        rows,
        totalRevenue: sum(completed),
        totalPurchases: completed.length,
        todayRevenue: sum(todayPurchases),
        todayCount: todayPurchases.length,
        weekRevenue: sum(weekPurchases),
        weekCount: weekPurchases.length,
        monthRevenue: sum(monthPurchases),
        monthCount: monthPurchases.length,
        last7Days,
      };
    },
  });

  const refundMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("purchases").update({ status: "refunded" }).eq("id", id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-purchases"] });
      toast.success("Purchase marked as refunded");
    },
  });

  const formatPrice = (cents: number) => `CA$${(cents / 100).toFixed(2)}`;

  const exportCSV = () => {
    if (!data?.rows.length) return;
    const header = "Purchase ID,Customer,Product,Amount,Status,Date\n";
    const csv = data.rows.map((r) => `${r.id},${r.customer_name},${r.product_title},${formatPrice(r.amount_paid)},${r.status},${format(new Date(r.purchased_at), "yyyy-MM-dd")}`).join("\n");
    const blob = new Blob([header + csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "purchases.csv"; a.click();
  };

  const maxDayRevenue = data ? Math.max(...data.last7Days.map((d) => d.revenue), 1) : 1;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Purchases</h1>
        {data?.rows.length ? (
          <Button variant="outline" size="sm" onClick={exportCSV}><Download className="h-4 w-4 mr-1" /> Export CSV</Button>
        ) : null}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Today" value={data ? formatPrice(data.todayRevenue) : "—"} icon={DollarSign} description={data ? `${data.todayCount} purchase${data.todayCount !== 1 ? "s" : ""}` : undefined} />
        <StatsCard title="This Week" value={data ? formatPrice(data.weekRevenue) : "—"} icon={TrendingUp} description={data ? `${data.weekCount} purchase${data.weekCount !== 1 ? "s" : ""}` : undefined} />
        <StatsCard title="This Month" value={data ? formatPrice(data.monthRevenue) : "—"} icon={Calendar} description={data ? `${data.monthCount} purchase${data.monthCount !== 1 ? "s" : ""}` : undefined} />
        <StatsCard title="All Time" value={data ? formatPrice(data.totalRevenue) : "—"} icon={DollarSign} description={data ? `${data.totalPurchases} total purchase${data.totalPurchases !== 1 ? "s" : ""}` : undefined} />
      </div>

      {/* 7-day mini chart */}
      {data && data.totalPurchases > 0 && (
        <div className="bg-card rounded-lg border border-border p-4 mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Last 7 Days</h2>
          <div className="flex items-end gap-2 h-24">
            {data.last7Days.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground">{day.revenue > 0 ? formatPrice(day.revenue) : ""}</span>
                <div
                  className="w-full bg-primary/20 rounded-t transition-all relative group"
                  style={{ height: `${Math.max((day.revenue / maxDayRevenue) * 100, 4)}%` }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t"
                    style={{ height: `${Math.max((day.revenue / maxDayRevenue) * 100, day.revenue > 0 ? 20 : 4)}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{day.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 rounded" />)}</div>
      ) : !data?.rows.length ? (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Purchase ID</TableHead><TableHead>Customer</TableHead><TableHead>Product</TableHead>
                <TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex flex-col items-center py-16 text-muted-foreground">
                    <ShoppingCart className="h-10 w-10 mb-3 opacity-40" />
                    <p className="font-medium">No purchases yet</p>
                    <p className="text-sm">Purchases will appear here when users buy paid resources.</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Purchase ID</TableHead><TableHead>Customer</TableHead><TableHead>Product</TableHead>
                <TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.id.slice(0, 8)}…</TableCell>
                  <TableCell>{r.customer_name}</TableCell>
                  <TableCell>{r.product_title}</TableCell>
                  <TableCell>{formatPrice(r.amount_paid)}</TableCell>
                  <TableCell>{format(new Date(r.purchased_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.status === "completed" ? "bg-emerald-100 text-emerald-700" : r.status === "refunded" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                      {r.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {r.status === "completed" && (
                      <Button variant="ghost" size="sm" className="text-destructive text-xs" onClick={() => refundMutation.mutate(r.id)}>
                        Refund
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPurchases;
