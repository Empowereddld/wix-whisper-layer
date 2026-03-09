import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLogAction } from "@/hooks/useAuditLog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Send, Mail } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const AdminEmails = () => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("all");
  const queryClient = useQueryClient();
  const logAction = useLogAction();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["email-campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase.from("email_campaigns").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      // For now, just record the campaign — email delivery integration comes later
      const { error } = await supabase.from("email_campaigns").insert({
        subject,
        body,
        audience,
        sent_at: new Date().toISOString(),
        recipient_count: 0, // Will be computed when email service is connected
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-campaigns"] });
      logAction.mutate(`Sent email campaign: ${subject}`);
      setSubject("");
      setBody("");
      toast({ title: "Campaign recorded", description: "Connect an email service to send actual emails." });
    },
  });

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Email Notifications</h1>

      <div className="bg-card rounded-lg border border-border p-6 mb-8 max-w-2xl">
        <h2 className="font-semibold mb-4">Compose Email</h2>
        <div className="space-y-4">
          <div>
            <Label>Audience</Label>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="parent">Parents Only</SelectItem>
                <SelectItem value="slp">Therapists Only</SelectItem>
                <SelectItem value="educator">Educators Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Subject</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email subject..." />
          </div>
          <div>
            <Label>Body</Label>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} placeholder="Write your email..." />
          </div>
          <Button onClick={() => sendMutation.mutate()} disabled={!subject.trim() || sendMutation.isPending} className="bg-coral hover:bg-coral/90 text-white">
            <Send className="h-4 w-4 mr-2" /> {sendMutation.isPending ? "Sending..." : "Send Campaign"}
          </Button>
        </div>
      </div>

      <h2 className="font-semibold mb-4">Sent History</h2>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Audience</TableHead>
              <TableHead>Date Sent</TableHead>
              <TableHead>Recipients</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns?.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.subject}</TableCell>
                <TableCell className="capitalize">{c.audience}</TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {c.sent_at ? format(new Date(c.sent_at), "MMM d, yyyy") : "—"}
                </TableCell>
                <TableCell>{c.recipient_count}</TableCell>
              </TableRow>
            ))}
            {(!campaigns || campaigns.length === 0) && (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="flex flex-col items-center py-12 text-muted-foreground">
                    <Mail className="h-10 w-10 mb-3 opacity-40" />
                    <p>No campaigns sent yet</p>
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

export default AdminEmails;
