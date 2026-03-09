import AdminLayout from "@/components/admin/AdminLayout";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { ShoppingCart } from "lucide-react";

const AdminOrders = () => (
  <AdminLayout>
    <h1 className="text-2xl font-bold mb-6">Orders</h1>
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={7}>
              <div className="flex flex-col items-center py-16 text-muted-foreground">
                <ShoppingCart className="h-10 w-10 mb-3 opacity-40" />
                <p className="font-medium">No orders yet</p>
                <p className="text-sm">Orders will appear here when paid products launch.</p>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </AdminLayout>
);

export default AdminOrders;
