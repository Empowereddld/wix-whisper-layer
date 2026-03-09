import AdminLayout from "@/components/admin/AdminLayout";
import { useAuditLog } from "@/hooks/useAuditLog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Shield } from "lucide-react";
import { format } from "date-fns";

const AdminAuditLog = () => {
  const { data: logs, isLoading } = useAuditLog();

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Audit Log</h1>

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs?.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>{l.action}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {format(new Date(l.created_at), "MMM d, yyyy h:mm a")}
                  </TableCell>
                </TableRow>
              ))}
              {(!logs || logs.length === 0) && (
                <TableRow>
                  <TableCell colSpan={2}>
                    <div className="flex flex-col items-center py-16 text-muted-foreground">
                      <Shield className="h-10 w-10 mb-3 opacity-40" />
                      <p className="font-medium">No audit logs yet</p>
                      <p className="text-sm">Admin actions will be recorded here automatically.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAuditLog;
