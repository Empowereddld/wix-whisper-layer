import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { SLP_REFERRAL_BONUS, SLP_REFERRAL_TOTAL } from "@/lib/waitlist-constants";

interface PendingClaim {
  id: string;
  name: string;
  email: string;
  points: number;
  created_at: string;
  speech_professional_rejected: boolean;
}

type View = "pending" | "rejected";

const SLPVerificationQueue = () => {
  const [view, setView] = useState<View>("pending");
  const [requests, setRequests] = useState<PendingClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from("storybuilders_waitlist")
        .select("id, name, email, points, created_at, speech_professional_rejected")
        .eq("is_speech_professional", true)
        .eq("speech_professional_verified", false)
        .eq("speech_professional_rejected", view === "rejected")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests((data as PendingClaim[]) || []);
    } catch (error) {
      console.error("Error loading verification requests:", error);
      toast.error("Failed to load verification requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const handleVerify = async (id: string) => {
    setBusy(id);
    try {
      const { data, error } = await supabase.rpc("verify_speech_professional", {
        p_waitlist_id: id,
        p_bonus: SLP_REFERRAL_BONUS,
      });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      if (row?.success) {
        toast.success(`Verified. Referrer now at flat +${SLP_REFERRAL_TOTAL} for this SLP referral.`);
        await load();
      } else {
        toast.error(row?.message || "Could not verify");
      }
    } catch (err) {
      console.error("Verify error:", err);
      toast.error("Failed to verify");
    } finally {
      setBusy(null);
    }
  };

  const handleReject = async (id: string) => {
    setBusy(id);
    try {
      const { data, error } = await (supabase as any).rpc("reject_speech_professional", {
        p_waitlist_id: id,
      });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      if (row?.success) {
        toast.success("Rejected. They won't reappear in the queue.");
        await load();
      } else {
        toast.error(row?.message || "Could not reject");
      }
    } catch (err) {
      console.error("Reject error:", err);
      toast.error("Failed to reject");
    } finally {
      setBusy(null);
    }
  };

  const handleReset = async (id: string) => {
    setBusy(id);
    try {
      const { data, error } = await (supabase as any).rpc("reset_speech_professional_rejection", {
        p_waitlist_id: id,
      });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      if (row?.success) {
        toast.success("Moved back to pending.");
        await load();
      } else {
        toast.error(row?.message || "Could not reset");
      }
    } catch (err) {
      console.error("Reset error:", err);
      toast.error("Failed to reset");
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Speech Professional Verification</span>
          <Badge variant="secondary">
            {requests.length} {view}
          </Badge>
        </CardTitle>
        <Tabs value={view} onValueChange={(v) => setView(v as View)} className="mt-3">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-sm py-6 text-center">Loading…</p>
        ) : requests.length === 0 ? (
          <p className="text-muted-foreground text-sm py-6 text-center">
            {view === "pending"
              ? "No pending verifications. SLPs, SLTs, and Speech Therapists who self-identified at signup will appear here."
              : "No rejected entries."}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Points</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-muted-foreground">{r.email}</TableCell>
                  <TableCell>{format(new Date(r.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>{r.points}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {view === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleVerify(r.id)}
                          disabled={busy === r.id}
                        >
                          <Check className="w-4 h-4 mr-1" /> Verify (flat +{SLP_REFERRAL_TOTAL})
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(r.id)}
                          disabled={busy === r.id}
                        >
                          <X className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReset(r.id)}
                        disabled={busy === r.id}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" /> Reset to pending
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default SLPVerificationQueue;
