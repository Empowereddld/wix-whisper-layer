import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  planned: "bg-purple-100 text-purple-700",
  complete: "bg-emerald-100 text-emerald-700",
};

const AdminResourceRequests = () => {
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAudience, setFilterAudience] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["resource-requests", filterStatus, filterAudience],
    queryFn: async () => {
      let q = supabase.from("resource_requests").select("*, profiles(first_name, last_name)").order("created_at", { ascending: false });
      if (filterStatus) q = q.eq("status", filterStatus);
      if (filterAudience) q = q.eq("audience", filterAudience);
      const { data } = await q;
      return data || [];
    },
  });

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("resource_requests").update({ status }).eq("id", id);
    toast.success("Status updated");
    queryClient.invalidateQueries({ queryKey: ["resource-requests"] });
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const markComplete = async () => {
    const selectedIds = requests?.filter((r: any) => r.status !== "complete").map((r: any) => r.id) || [];
    if (selectedIds.length === 0) return;
    await supabase.from("resource_requests").update({ status: "complete" }).in("id", selectedIds);
    toast.success("Marked as complete");
    queryClient.invalidateQueries({ queryKey: ["resource-requests"] });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Resource Requests</h1>
        <Button variant="outline" onClick={markComplete}>Mark All as Complete</Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v === "all" ? "" : v)}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterAudience} onValueChange={(v) => setFilterAudience(v === "all" ? "" : v)}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Audience" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Audiences</SelectItem>
            <SelectItem value="Parents">Parents</SelectItem>
            <SelectItem value="Therapists">Therapists</SelectItem>
            <SelectItem value="Educators">Educators</SelectItem>
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
                <TableHead>Topic</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests?.map((r: any) => (
                <TableRow key={r.id} className="cursor-pointer" onClick={() => setSelected(r)}>
                  <TableCell className="font-medium max-w-[200px] truncate">{r.topic}</TableCell>
                  <TableCell>{r.audience}</TableCell>
                  <TableCell>{r.profiles?.first_name || "Unknown"} {r.profiles?.last_name || ""}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{format(new Date(r.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[r.status] || "bg-gray-100"}`}>
                      {r.status.replace("_", " ")}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {(!requests || requests.length === 0) && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-12">No resource requests yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-lg">
          <SheetHeader><SheetTitle>Request Details</SheetTitle></SheetHeader>
          {selected && (
            <div className="space-y-6 mt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Topic</p>
                <p className="font-medium">{selected.topic}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Audience</p>
                <p>{selected.audience}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Context</p>
                <p>{selected.context || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Submitted By</p>
                <p>{selected.profiles?.first_name || "Unknown"} {selected.profiles?.last_name || ""}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date</p>
                <p>{format(new Date(selected.created_at), "MMMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Status</p>
                <Select value={selected.status} onValueChange={(v) => updateStatus(selected.id, v)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
};

export default AdminResourceRequests;
