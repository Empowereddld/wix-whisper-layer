import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductRow {
  id: string;
  resource_id: string;
  price: number;
  stripe_price_id: string | null;
  currency: string;
  is_active: boolean;
  created_at: string;
  resource_title?: string;
}

const AdminProducts = () => {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [resourceId, setResourceId] = useState("");
  const [price, setPrice] = useState("");
  const currency = "USD";

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data: prods } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      const { data: resources } = await supabase.from("resources").select("id, title");
      const resMap = Object.fromEntries((resources || []).map((r) => [r.id, r.title]));
      return (prods || []).map((p) => ({ ...p, resource_title: resMap[p.resource_id] || "Unknown" })) as ProductRow[];
    },
  });

  const { data: freeResources } = useQuery({
    queryKey: ["admin-free-resources"],
    queryFn: async () => {
      const { data: resources } = await supabase.from("resources").select("id, title");
      const { data: prods } = await supabase.from("products").select("resource_id");
      const paidIds = new Set((prods || []).map((p) => p.resource_id));
      return (resources || []).filter((r) => !paidIds.has(r.id));
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const priceInCents = Math.round(parseFloat(price) * 100);
      if (editing) {
        await supabase.from("products").update({ price: priceInCents, currency }).eq("id", editing.id);
      } else {
        await supabase.from("products").insert({ resource_id: resourceId, price: priceInCents, currency });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["admin-free-resources"] });
      toast.success(editing ? "Product updated" : "Product created");
      closeForm();
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      await supabase.from("products").update({ is_active: active }).eq("id", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  const closeForm = () => { setFormOpen(false); setEditing(null); setResourceId(""); setPrice(""); };
  const openEdit = (p: ProductRow) => { setEditing(p); setPrice((p.price / 100).toFixed(2)); setFormOpen(true); };
  const openNew = () => { setEditing(null); setFormOpen(true); };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Product Pricing</h1>
        <Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-1" /> Add Paid Product</Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 rounded" />)}</div>
      ) : !products?.length ? (
        <div className="bg-card rounded-lg border border-border p-16 text-center text-muted-foreground">
          <Package className="h-10 w-10 mb-3 mx-auto opacity-40" />
          <p className="font-medium">No paid products yet</p>
          <p className="text-sm">Add a paid product to start selling resources.</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.resource_title}</TableCell>
                  <TableCell>{formatPrice(p.price, p.currency)}</TableCell>
                  <TableCell>{p.currency}</TableCell>
                  <TableCell>
                    <Switch checked={p.is_active} onCheckedChange={(v) => toggleActive.mutate({ id: p.id, active: v })} />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={(o) => !o && closeForm()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Product" : "Add Paid Product"}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            {!editing && (
              <div>
                <label className="text-sm font-medium mb-1 block">Resource</label>
                <Select value={resourceId} onValueChange={setResourceId}>
                  <SelectTrigger><SelectValue placeholder="Select a resource" /></SelectTrigger>
                  <SelectContent>
                    {(freeResources || []).map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-1 block">Price ($)</label>
              <Input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="9.99" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Currency</label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CAD">CAD</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || (!editing && !resourceId) || !price}>
              {saveMutation.isPending ? "Saving…" : editing ? "Update" : "Create Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <p className="text-xs text-muted-foreground mt-6">
        💡 Stripe integration coming soon. For now, purchases are recorded directly. Tax settings will be managed in Stripe dashboard.
      </p>
    </AdminLayout>
  );
};

export default AdminProducts;
