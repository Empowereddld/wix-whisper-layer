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
import { Check, X, Mail } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { BRAND_COLORS, SLP_REFERRAL_BONUS } from "@/lib/waitlist-constants";

interface VerificationRequest {
  id: string;
  user_email: string;
  referred_by_email: string | null;
  created_at: string;
}

const SLPVerificationQueue = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);

  // Load pending verification requests
  useEffect(() => {
    loadRequests();
    // Refresh every 30 seconds
    const interval = setInterval(loadRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase.rpc as any)(
        "get_pending_slp_verifications"
      );

      if (error) throw error;

      setRequests((data as any) || []);
    } catch (error) {
      console.error("Error loading verification requests:", error);
      toast.error("Failed to load verification requests");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (requestId: string) => {
    setVerifying(requestId);
    try {
      const { data, error } = await (supabase.rpc as any)(
        "verify_slp_referral",
        {
          p_request_id: requestId,
        }
      );

      if (error) throw error;

      if ((data as any)?.success) {
        toast.success(
          `SLP verified! Referrer awarded ${SLP_REFERRAL_BONUS} bonus points.`
        );
        loadRequests();
      } else {
        toast.error((data as any)?.error || "Failed to verify SLP");
      }
    } catch (error) {
      console.error("Error verifying SLP:", error);
      toast.error("Failed to verify SLP");
    } finally {
      setVerifying(null);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!confirm("Are you sure you want to reject this verification request?")) {
      return;
    }

    try {
      const { data, error } = await (supabase.rpc as any)(
        "reject_slp_verification",
        {
          p_request_id: requestId,
        }
      );

      if (error) throw error;

      if ((data as any)?.success) {
        toast.success("Verification request rejected");
        loadRequests();
      } else {
        toast.error((data as any)?.error || "Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting verification:", error);
      toast.error("Failed to reject request");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SLP Verification Queue</h1>
          <p className="text-gray-600 mt-1">
            Verify Speech Language Pathologists and award referral bonuses
          </p>
        </div>
        <Badge
          variant="outline"
          className="text-lg px-3 py-2"
          style={{
            backgroundColor: BRAND_COLORS.LIGHT,
            borderColor: BRAND_COLORS.PRIMARY,
            color: BRAND_COLORS.PRIMARY,
          }}
        >
          {requests.length} Pending
        </Badge>
      </div>

      {/* Info card */}
      <Card style={{ backgroundColor: BRAND_COLORS.LIGHT, borderColor: BRAND_COLORS.PRIMARY }}>
        <CardContent className="pt-6">
          <p className="text-sm font-medium" style={{ color: BRAND_COLORS.DARK }}>
            Each verified SLP referral awards {SLP_REFERRAL_BONUS} bonus points
            (on top of the standard 25 referral points) to the referring user.
          </p>
        </CardContent>
      </Card>

      {/* Verification requests table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-600">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No pending SLP verification requests</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Email</TableHead>
                    <TableHead>Referred By</TableHead>
                    <TableHead>Signup Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.user_email}
                      </TableCell>
                      <TableCell>
                        {request.referred_by_email ? (
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {request.referred_by_email}
                          </code>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            Not referred
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {format(new Date(request.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerify(request.id)}
                            disabled={verifying === request.id}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(request.id)}
                            disabled={verifying === request.id}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Standard Referral</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-700">25 points</p>
            <p className="text-sm text-gray-600 mt-1">
              Awarded when any user joins via referral link
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              SLP Referral Bonus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className="text-2xl font-bold"
              style={{ color: BRAND_COLORS.PRIMARY }}
            >
              +{SLP_REFERRAL_BONUS} points
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Additional bonus when referred user is verified as SLP
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SLPVerificationQueue;
