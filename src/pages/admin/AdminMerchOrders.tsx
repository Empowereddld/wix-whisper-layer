import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";

type Item = { title: string; variant: string | null; quantity: number };

const AdminMerchOrders = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["merch-orders"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("merch_orders").select("*").order("ordered_at", { ascending: false }).limit(500);
      if (error) throw error;
      return data as any[];
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Merch Orders</h1>
          <p className="text-sm text-muted-foreground">New Shopify merch orders appear here automatically.</p>
        </div>
        {isLoading ? <p className="text-muted-foreground">Loading…</p> : !data?.length ? (
          <p className="text-muted-foreground">No merch orders yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr><th className="p-3">Date</th><th className="p-3">Order</th><th className="p-3">Buyer</th><th className="p-3">Items</th><th className="p-3">Total</th><th className="p-3">Status</th></tr>
              </thead>
              <tbody>
                {data.map((o) => (
                  <tr key={o.id} className="border-t border-border align-top">
                    <td className="p-3">{o.ordered_at ? new Date(o.ordered_at).toLocaleDateString() : ""}</td>
                    <td className="p-3">{o.order_name}</td>
                    <td className="p-3">{o.customer_name}<div className="text-muted-foreground">{o.customer_email}</div></td>
                    <td className="p-3">{(o.items as Item[]).map((i, k) => (
                      <div key={k}>{i.quantity} × {i.title}{i.variant ? ` (${i.variant})` : ""}</div>))}</td>
                    <td className="p-3">{o.total_price != null ? `${Number(o.total_price).toFixed(2)} ${o.currency ?? ""}` : ""}</td>
                    <td className="p-3">{o.financial_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMerchOrders;
