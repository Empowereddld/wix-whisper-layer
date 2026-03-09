import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, Download, Plus, Mail } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const roleLabel = (r: string) =>
  ({ parent: "Parent", slp: "Therapist", educator: "Educator", school_leader: "School Leader" }[r] || r || "—");

const AdminWaitlist = () => {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "", notes: "" });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const { data: entries, isLoading } = useQuery({
    queryKey: ["waitlist", search, filterRole],
    queryFn: async () => {
      let q = supabase.from("waitlist").select("*").order("created_at", { ascending: false });
      if (search) q = q.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      if (filterRole) q = q.eq("role", filterRole);
      const { data } = await q;
      return data || [];
    },
  });

  const handleAdd = async () => {
    if (!form.name || !form.email) return;
    const { error } = await supabase.from("waitlist").insert({
      name: form.name,
      email: form.email,
      role: form.role || null,
      notes: form.notes || null,
    });
    if (error) {
      toast.error(error.message.includes("duplicate") ? "Email already exists" : "Error adding entry");
      return;
    }
    toast.success("Added to waitlist");
    setForm({ name: "", email: "", role: "", notes: "" });
    setAddOpen(false);
    queryClient.invalidateQueries({ queryKey: ["waitlist"] });
  };

  const exportCSV = () => {
    if (!entries?.length) return;
    const headers = ["Name", "Email", "Role", "Notes", "Signed Up"];
    const rows = entries.map((e: any) => [
      e.name,
      e.email,
      roleLabel(e.role),
      e.notes || "",
      format(new Date(e.created_at), "yyyy-MM-dd"),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleAll = () => {
    if (selected.size === entries?.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(entries?.map((e: any) => e.id)));
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Waitlist</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Manually
          </Button>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterRole} onValueChange={(v) => setFilterRole(v === "all" ? "" : v)}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="parent">Parent</SelectItem>
            <SelectItem value="slp">Therapist</SelectItem>
            <SelectItem value="educator">Educator</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <input type="checkbox" checked={selected.size === entries?.length && entries?.length > 0} onChange={toggleAll} />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Signed Up</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries?.map((e: any) => (
                <TableRow key={e.id}>
                  <TableCell><input type="checkbox" checked={selected.has(e.id)} onChange={() => toggleSelect(e.id)} /></TableCell>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell>{e.email}</TableCell>
                  <TableCell>{roleLabel(e.role)}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">{e.notes || "—"}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{format(new Date(e.created_at), "MMM d, yyyy")}</TableCell>
                </TableRow>
              ))}
              {(!entries || entries.length === 0) && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">No waitlist signups yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-midnight text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4 z-50">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <Button size="sm" variant="secondary" onClick={() => toast.info("Email composer coming soon")}>
            <Mail className="h-4 w-4 mr-1.5" /> Send Email
          </Button>
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add to Waitlist</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
              <SelectTrigger><SelectValue placeholder="Role (optional)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="slp">Therapist</SelectItem>
                <SelectItem value="educator">Educator</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <Button onClick={handleAdd} className="w-full" disabled={!form.name || !form.email}>Add</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminWaitlist;
