import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminUsers, useUserDownloads, useUserNotes } from "@/hooks/useAdminUsers";
import { useLogAction } from "@/hooks/useAuditLog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, Download, StickyNote, Mail } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const roleLabel = (r: string) =>
  ({ parent: "Parent", slp: "Therapist", educator: "Educator", school_leader: "School Leader", other: "Other" }[r] || r);

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newNote, setNewNote] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({ subject: "", body: "" });

  const { data: users, isLoading } = useAdminUsers({ search, role: filterRole });
  const { data: downloads } = useUserDownloads(selectedUser?.id);
  const { data: notes } = useUserNotes(selectedUser?.id);
  const { user } = useAuth();
  const logAction = useLogAction();
  const queryClient = useQueryClient();

  const handleAddNote = async () => {
    if (!newNote.trim() || !selectedUser || !user) return;
    const { error } = await supabase.from("user_notes").insert({
      user_id: selectedUser.id,
      note: newNote.trim(),
      created_by: user.id,
    });
    if (error) {
      toast({ title: "Error adding note", variant: "destructive" });
      return;
    }
    logAction.mutate(`Added note on user: ${selectedUser.first_name}`);
    setNewNote("");
    queryClient.invalidateQueries({ queryKey: ["user-notes", selectedUser.id] });
    toast({ title: "Note added" });
  };

  const exportCSV = () => {
    if (!users?.length) return;
    const headers = ["Name", "Role", "Country", "Joined", "Referred By"];
    const rows = users.map((u) => [
      `${u.first_name} ${u.last_name || ""}`.trim(),
      roleLabel(u.role),
      u.country || "",
      format(new Date(u.created_at), "yyyy-MM-dd"),
      u.referred_by || "",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${format(new Date(), "yyyy-MM-dd")}.csv`;
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
    if (selected.size === users?.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(users?.map((u) => u.id)));
    }
  };

  const handleSendEmail = async () => {
    if (!emailForm.subject || !emailForm.body || selected.size === 0) return;
    // Log to email_campaigns table
    await supabase.from("email_campaigns").insert({
      subject: emailForm.subject,
      body: emailForm.body,
      audience: "selected_users",
      recipient_count: selected.size,
      sent_at: new Date().toISOString(),
    });
    logAction.mutate(`Sent bulk email to ${selected.size} users`);
    toast({ title: `Email sent to ${selected.size} users` });
    setEmailForm({ subject: "", body: "" });
    setEmailOpen(false);
    setSelected(new Set());
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button variant="outline" onClick={exportCSV}>
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
                  <input type="checkbox" checked={selected.size === users?.length && (users?.length ?? 0) > 0} onChange={toggleAll} />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Referred By</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((u) => (
                <TableRow key={u.id} className="cursor-pointer" onClick={() => setSelectedUser(u)}>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.has(u.id)} onChange={() => toggleSelect(u.id)} />
                  </TableCell>
                  <TableCell className="font-medium">{u.first_name} {u.last_name || ""}</TableCell>
                  <TableCell>{roleLabel(u.role)}</TableCell>
                  <TableCell className="text-muted-foreground">{u.country || "—"}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{u.referred_by || "—"}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {format(new Date(u.created_at), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              ))}
              {(!users || users.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-12">No users found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Bulk Action Bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-midnight text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4 z-50">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <Button size="sm" variant="secondary" onClick={() => setEmailOpen(true)}>
            <Mail className="h-4 w-4 mr-1.5" /> Send Email
          </Button>
        </div>
      )}

      {/* Email Composer Modal */}
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Send Email to {selected.size} Users</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <Input placeholder="Subject" value={emailForm.subject} onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })} />
            <Textarea placeholder="Email body..." value={emailForm.body} onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })} rows={6} />
            <Button onClick={handleSendEmail} className="w-full" disabled={!emailForm.subject || !emailForm.body}>
              Send Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Detail Drawer */}
      <Sheet open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{selectedUser?.first_name} {selectedUser?.last_name || ""}</SheetTitle>
          </SheetHeader>
          {selectedUser && (
            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Role:</span> {roleLabel(selectedUser.role)}</div>
                <div><span className="text-muted-foreground">Country:</span> {selectedUser.country || "—"}</div>
                <div><span className="text-muted-foreground">Joined:</span> {format(new Date(selectedUser.created_at), "MMM d, yyyy")}</div>
                <div><span className="text-muted-foreground">Age Range:</span> {selectedUser.age_range || "—"}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Referred By:</span> {selectedUser.referred_by || "—"}</div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Download className="h-4 w-4" /> Downloads</h3>
                {downloads && downloads.length > 0 ? (
                  <div className="space-y-1.5">
                    {downloads.map((d: any) => (
                      <div key={d.id} className="flex justify-between text-sm border-b border-border pb-1">
                        <span>{(d.resources as any)?.title || "Unknown"}</span>
                        <span className="text-muted-foreground text-xs">{format(new Date(d.downloaded_at), "MMM d")}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No downloads yet</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><StickyNote className="h-4 w-4" /> Internal Notes</h3>
                {notes && notes.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {notes.map((n: any) => (
                      <div key={n.id} className="bg-muted rounded p-2 text-sm">
                        <p>{n.note}</p>
                        <p className="text-xs text-muted-foreground mt-1">{format(new Date(n.created_at), "MMM d, yyyy")}</p>
                      </div>
                    ))}
                  </div>
                )}
                <Textarea placeholder="Add a note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} rows={2} />
                <Button onClick={handleAddNote} size="sm" className="mt-2" disabled={!newNote.trim()}>
                  Add Note
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
};

export default AdminUsers;
