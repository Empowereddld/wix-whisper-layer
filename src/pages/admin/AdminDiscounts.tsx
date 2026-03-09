import AdminLayout from "@/components/admin/AdminLayout";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Tag } from "lucide-react";

const AdminDiscounts = () => (
  <AdminLayout>
    <h1 className="text-2xl font-bold mb-6">Discount Codes</h1>
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>% Off</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Uses Remaining</TableHead>
            <TableHead>Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={5}>
              <div className="flex flex-col items-center py-16 text-muted-foreground">
                <Tag className="h-10 w-10 mb-3 opacity-40" />
                <p className="font-medium">No discount codes yet</p>
                <p className="text-sm">Discount codes will be available when paid products launch.</p>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </AdminLayout>
);

export default AdminDiscounts;
