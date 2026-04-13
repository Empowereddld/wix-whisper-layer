import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Newspaper, Download } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

const AdminNewsletter = () => {
  const { data: subscribers, isLoading } = useQuery({
    queryKey: ["newsletter-subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("waitlist")
        .select("*")
        .eq("notes", "footer newsletter")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const exportCsv = () => {
    if (!subscribers?.length) return;
    const header = "Name,Email,Date\n";
    const rows = subscribers.map(s =>
      `"${s.name}","${s.email}","${format(new Date(s.created_at), "yyyy-MM-dd")}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
        <Button variant="outline" size="sm" onClick={exportCsv} disabled={!subscribers?.length}>
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      <p className="text-muted-foreground text-sm mb-4">
        Contacts collected from the footer newsletter form. Total: <strong>{subscribers?.length ?? 0}</strong>
      </p>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date Signed Up</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Loading…</TableCell>
              </TableRow>
            )}
            {subscribers?.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {format(new Date(s.created_at), "MMM d, yyyy")}
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && (!subscribers || subscribers.length === 0) && (
              <TableRow>
                <TableCell colSpan={3}>
                  <div className="flex flex-col items-center py-12 text-muted-foreground">
                    <Newspaper className="h-10 w-10 mb-3 opacity-40" />
                    <p>No newsletter subscribers yet</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default AdminNewsletter;
