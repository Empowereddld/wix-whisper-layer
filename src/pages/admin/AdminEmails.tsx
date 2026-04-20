import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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
import { Send, Mail, FlaskConical } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const buildHtml = (body: string) =>
  body
    .split(/\n\n+/)
    .map((p) => `<p>${p.replace(/\n/g, "<br/>").replace(/</g, "&lt;")}</p>`)
    .join("");

const AdminEmails = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("all");
  const queryClient = useQueryClient();
  const logAction = useLogAction();

  const { data: campaigns } = useQuery({
    queryKey: ["email-campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase.from("email_campaigns").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      let recipients: string[] = [];

      if (audience === "all" || ["parent", "slp", "educator"].includes(audience)) {
        const { data: waitlist } = await supabase
          .from("waitlist")
          .select("email, role")
          .order("created_at", { ascending: false });
        const filtered = (waitlist || []).filter((w) =>
          audience === "all" ? true : w.role === audience
        );
        recipients = filtered.map((w) => w.email);

        if (audience === "all") {
          const { data: sp } = await supabase.from("storybuilders_waitlist").select("email");
          recipients.push(...(sp || []).map((s) => s.email));
        }
      }

      recipients = Array.from(new Set(recipients.filter(Boolean)));
      if (recipients.length === 0) throw new Error("No recipients found for this audience.");

      const { data, error: sendError } = await supabase.functions.invoke("send-email", {
        body: { to: recipients, subject, html: buildHtml(body), include_unsubscribe: true },
      });
      if (sendError) throw sendError;

      const sent = (data as any)?.sent ?? recipients.length;
      const suppressed = (data as any)?.suppressed ?? 0;

      const { error } = await supabase.from("email_campaigns").insert({
        subject, body, audience, sent_at: new Date().toISOString(), recipient_count: sent,
      });
      if (error) throw error;
      return { sent, suppressed };
    },
    onSuccess: ({ sent, suppressed }) => {
      queryClient.invalidateQueries({ queryKey: ["email-campaigns"] });
      logAction.mutate(`Sent email campaign: ${subject} (${sent} recipients, ${suppressed} suppressed)`);
      setSubject("");
      setBody("");
      toast({
        title: "Campaign sent! 🚀",
        description: `Delivered to ${sent} recipient${sent === 1 ? "" : "s"}${suppressed ? ` · ${suppressed} skipped (unsubscribed)` : ""}.`,
      });
    },
    onError: (err: any) => {
      toast({ title: "Send failed", description: err?.message || "Please try again.", variant: "destructive" });
    },
  });

  const testSendMutation = useMutation({
    mutationFn: async () => {
      if (!user?.email) throw new Error("You don't have an email on your admin account.");
      if (!subject.trim() || !body.trim()) throw new Error("Add a subject and body first.");
      const { error } = await supabase.functions.invoke("send-email", {
        body: {
          to: user.email,
          subject: `[TEST] ${subject}`,
          html: buildHtml(body),
          include_unsubscribe: true,
          bypass_suppression: true, // always deliver test sends to admin
        },
      });
      if (error) throw error;
      return user.email;
    },
    onSuccess: (email) => {
      toast({ title: "Test sent ✓", description: `Check ${email} in a few seconds.` });
    },
    onError: (err: any) => {
      toast({ title: "Test send failed", description: err?.message || "Please try again.", variant: "destructive" });
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
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => testSendMutation.mutate()}
              disabled={!subject.trim() || !body.trim() || testSendMutation.isPending}
            >
              <FlaskConical className="h-4 w-4 mr-2" />
              {testSendMutation.isPending ? "Sending..." : `Send test to me${user?.email ? ` (${user.email})` : ""}`}
            </Button>
            <Button
              onClick={() => sendMutation.mutate()}
              disabled={!subject.trim() || !body.trim() || sendMutation.isPending}
              className="bg-coral hover:bg-coral/90 text-white"
            >
              <Send className="h-4 w-4 mr-2" /> {sendMutation.isPending ? "Sending..." : "Send Campaign"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Campaigns automatically include an unsubscribe link and skip recipients who have opted out.
          </p>
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
