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
import { Tag, Plus, Copy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";

const AdminDiscounts = () => {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [appliesTo, setAppliesTo] = useState("all");
  const [maxUses, setMaxUses] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const { data: codes, isLoading } = useQuery({
    queryKey: ["admin-discounts"],
    queryFn: async () => {
      const { data } = await supabase.from("discount_codes").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await supabase.from("discount_codes").insert({
        code: code.toUpperCase(),
        discount_type: discountType,
        discount_value: parseFloat(discountValue),
        percent_off: discountType === "percentage" ? parseInt(discountValue) : 0,
        applies_to: appliesTo,
        max_uses: maxUses ? parseInt(maxUses) : null,
        expiry_date: expiryDate || null,
        is_active: true,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-discounts"] });
      toast.success("Discount code created");
      closeForm();
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      await supabase.from("discount_codes").update({ is_active: active }).eq("id", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-discounts"] }),
  });

  const closeForm = () => { setFormOpen(false); setCode(""); setDiscountType("percentage"); setDiscountValue(""); setAppliesTo("all"); setMaxUses(""); setExpiryDate(""); };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    setCode(result);
  };

  const copyCode = (c: string) => { navigator.clipboard.writeText(c); toast.success("Code copied"); };

  const formatDiscount = (row: any) => {
    if (row.discount_type === "percentage") return `${row.discount_value}% off`;
    return `CA$${(row.discount_value / 100).toFixed(2)} off`;
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Discount Codes</h1>
        <Button onClick={() => setFormOpen(true)} size="sm"><Plus className="h-4 w-4 mr-1" /> Create Code</Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 rounded" />)}</div>
      ) : !codes?.length ? (
        <div className="bg-card rounded-lg border border-border p-16 text-center text-muted-foreground">
          <Tag className="h-10 w-10 mb-3 mx-auto opacity-40" />
          <p className="font-medium">No discount codes yet</p>
          <p className="text-sm">Create a discount code for your paid resources.</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead><TableHead>Discount</TableHead><TableHead>Applies To</TableHead>
                <TableHead>Uses</TableHead><TableHead>Expiry</TableHead><TableHead>Active</TableHead><TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono font-semibold">{c.code}</TableCell>
                  <TableCell>{formatDiscount(c)}</TableCell>
                  <TableCell className="capitalize">{c.applies_to}</TableCell>
                  <TableCell>{c.uses_count}{c.max_uses ? ` / ${c.max_uses}` : ""}</TableCell>
                  <TableCell>{c.expiry_date ? format(new Date(c.expiry_date), "MMM d, yyyy") : "—"}</TableCell>
                  <TableCell><Switch checked={c.is_active} onCheckedChange={(v) => toggleActive.mutate({ id: c.id, active: v })} /></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => copyCode(c.code)}><Copy className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={(o) => !o && closeForm()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Create Discount Code</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium mb-1 block">Code</label>
              <div className="flex gap-2">
                <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="WELCOME20" />
                <Button variant="outline" size="sm" onClick={generateCode}>Generate</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Type</label>
                <Select value={discountType} onValueChange={setDiscountType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">% Off</SelectItem>
                    <SelectItem value="fixed">$ Off</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Value</label>
                <Input type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder={discountType === "percentage" ? "20" : "500"} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Applies To</label>
              <Select value={appliesTo} onValueChange={setAppliesTo}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="specific_product">Specific Product</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Max Uses</label>
                <Input type="number" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} placeholder="Unlimited" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Expiry Date</label>
                <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
              </div>
            </div>
            <Button className="w-full" onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !code || !discountValue}>
              {createMutation.isPending ? "Creating…" : "Create Code"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminDiscounts;
