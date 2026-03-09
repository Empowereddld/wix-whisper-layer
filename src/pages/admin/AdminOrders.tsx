import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Download, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { toast } from "sonner";
import StatsCard from "@/components/admin/StatsCard";

const AdminOrders = () => {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders"],
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
      const thisMonth = rows.filter((r) => new Date(r.purchased_at).getMonth() === now.getMonth() && new Date(r.purchased_at).getFullYear() === now.getFullYear());
      const totalRevenue = rows.filter((r) => r.status === "completed").reduce((s, r) => s + (r.amount_paid || 0), 0);
      const monthRevenue = thisMonth.filter((r) => r.status === "completed").reduce((s, r) => s + (r.amount_paid || 0), 0);

      return { rows, totalRevenue, monthRevenue };
    },
  });

  const refundMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("purchases").update({ status: "refunded" }).eq("id", id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order marked as refunded");
    },
  });

  const formatPrice = (cents: number) => `CA$${(cents / 100).toFixed(2)}`;

  const exportCSV = () => {
    if (!data?.rows.length) return;
    const header = "Order ID,Customer,Product,Amount,Status,Date\n";
    const csv = data.rows.map((r) => `${r.id},${r.customer_name},${r.product_title},${formatPrice(r.amount_paid)},${r.status},${format(new Date(r.purchased_at), "yyyy-MM-dd")}`).join("\n");
    const blob = new Blob([header + csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "orders.csv"; a.click();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        {data?.rows.length ? (
          <Button variant="outline" size="sm" onClick={exportCSV}><Download className="h-4 w-4 mr-1" /> Export CSV</Button>
        ) : null}
      </div>

      {/* Revenue cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatsCard title="Total Revenue" value={data ? formatPrice(data.totalRevenue) : "—"} icon={DollarSign} />
        <StatsCard title="Revenue This Month" value={data ? formatPrice(data.monthRevenue) : "—"} icon={DollarSign} />
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 rounded" />)}</div>
      ) : !data?.rows.length ? (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead><TableHead>Customer</TableHead><TableHead>Product</TableHead>
                <TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex flex-col items-center py-16 text-muted-foreground">
                    <ShoppingCart className="h-10 w-10 mb-3 opacity-40" />
                    <p className="font-medium">No orders yet</p>
                    <p className="text-sm">Orders will appear here when users purchase resources.</p>
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
                <TableHead>Order ID</TableHead><TableHead>Customer</TableHead><TableHead>Product</TableHead>
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
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
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

export default AdminOrders;
