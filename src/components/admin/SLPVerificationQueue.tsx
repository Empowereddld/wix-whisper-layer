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
import { Check, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { SLP_REFERRAL_BONUS } from "@/lib/waitlist-constants";

interface PendingClaim {
  id: string;
  name: string;
  email: string;
  points: number;
  created_at: string;
}

const SLPVerificationQueue = () => {
  const [requests, setRequests] = useState<PendingClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("storybuilders_waitlist")
        .select("id, name, email, points, created_at")
        .eq("is_speech_professional", true)
        .eq("speech_professional_verified", false)
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
  }, []);

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
        toast.success(`Verified — +${SLP_REFERRAL_BONUS} bonus awarded`);
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
      // Just clear the speech-pro flag so they no longer appear in the queue.
      // Done via insert tool would be ideal but UPDATE on this table is admin-locked via RLS;
      // we use service-side via an edge function call only if needed. For now use direct update —
      // admin is_speech_professional is admin-only writable through the verify RPC, so we soft-reject by marking verified=false stays.
      // Simplest: mark is_speech_professional = false via a small admin RPC (TODO). For now, just hide locally.
      setRequests((r) => r.filter((x) => x.id !== id));
      toast.info("Marked as rejected (local). Add a reject RPC for permanent action.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Speech Professional Verification</span>
          <Badge variant="secondary">{requests.length} pending</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-sm py-6 text-center">Loading…</p>
        ) : requests.length === 0 ? (
          <p className="text-muted-foreground text-sm py-6 text-center">
            No pending verifications. SLPs, SLTs, Speech Therapists, Logopedists,
            and Fonoaudiólogos who self-identified at signup will appear here.
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
                    <Button
                      size="sm"
                      onClick={() => handleVerify(r.id)}
                      disabled={busy === r.id}
                    >
                      <Check className="w-4 h-4 mr-1" /> Verify (+{SLP_REFERRAL_BONUS})
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(r.id)}
                      disabled={busy === r.id}
                    >
                      <X className="w-4 h-4 mr-1" /> Hide
                    </Button>
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
