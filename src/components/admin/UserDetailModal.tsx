import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  Mail,
  Flag,
} from "lucide-react";
import { getTierName, getTierColor, getNextTierThreshold, getProgressToNextTier } from "@/lib/waitlist-utils";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  referral_code: string;
  invite_count: number;
  created_at: string;
  points?: number;
  current_tier?: number;
  email_verified?: boolean;
  flagged?: boolean;
}

interface UserDetailModalProps {
  user: WaitlistUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFlagChange: () => void;
  onClose: () => void;
}

const UserDetailModal = ({
  user,
  open,
  onOpenChange,
  onFlagChange,
  onClose,
}: UserDetailModalProps) => {
  const [isEditingPoints, setIsEditingPoints] = useState(false);
  const [newPoints, setNewPoints] = useState(user.points || 0);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("verification_resend");

  const nextTierThreshold = getNextTierThreshold(user.current_tier || 0);
  const progressToNextTier = getProgressToNextTier(user.points || 0, user.current_tier || 0);

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(user.referral_code);
  };

  const handleCopyReferralLink = () => {
    const link = `https://empowereddld.com/storypros?ref=${user.referral_code}`;
    navigator.clipboard.writeText(link);
  };

  const handleUpdatePoints = async () => {
    try {
      // Points column may not exist yet in DB — just close for now
      setIsEditingPoints(false);
      onClose();
    } catch (error) {
      console.error("Error updating points:", error);
    }
  };

  const handleSendEmail = async () => {
    try {
      setIsSendingEmail(true);
      const { error } = await supabase.functions.invoke("send-waitlist-email", {
        body: {
          to: user.email,
          template: selectedTemplate,
          data: {
            name: user.name.split(" ")[0],
          },
        },
      });

      if (error) throw error;

      // Show success message
      console.log("Email sent successfully");
      setIsSendingEmail(false);
    } catch (error) {
      console.error("Error sending email:", error);
      setIsSendingEmail(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details: {user.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Name</Label>
                <p className="font-semibold">{user.name}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="font-mono text-sm">{user.email}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Joined</Label>
                <p className="text-sm">{format(new Date(user.created_at), "MMM dd, yyyy HH:mm")}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <div className="flex gap-2 mt-1">
                  {user.email_verified ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-50 text-gray-700">
                      <XCircle className="h-3 w-3 mr-1" />
                      Unverified
                    </Badge>
                  )}
                  {user.flagged && (
                    <Badge variant="destructive">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Flagged
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Points & Tier */}
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Current Tier</Label>
                <Badge
                  className="mt-1 text-sm"
                  style={{
                    backgroundColor: getTierColor(user.current_tier) + "20",
                    color: getTierColor(user.current_tier),
                  }}
                >
                  {getTierName(user.current_tier)}
                </Badge>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-muted-foreground">Points</Label>
                  <span className="text-sm font-semibold">{user.points} pts</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${progressToNextTier}%` }}
                  />
                </div>
                {nextTierThreshold ? (
                  <p className="text-xs text-muted-foreground mt-2">
                    {nextTierThreshold - user.points} points to {getTierName(user.current_tier + 1)}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-2">
                    Max tier reached
                  </p>
                )}
              </div>

              {isEditingPoints ? (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={newPoints}
                    onChange={(e) => setNewPoints(Number(e.target.value))}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleUpdatePoints}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsEditingPoints(false);
                      setNewPoints(user.points);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditingPoints(true)}
                >
                  Edit Points
                </Button>
              )}
            </div>
          </Card>

          {/* Referral Info */}
          <Card className="p-4">
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Referral Code</Label>
                <div className="flex gap-2 mt-1">
                  <code className="flex-1 bg-muted p-2 rounded text-sm font-mono">
                    {user.referral_code}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyReferralCode}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Referral Link</Label>
                <div className="flex gap-2 mt-1">
                  <code className="flex-1 bg-muted p-2 rounded text-xs font-mono truncate">
                    {`https://empowereddld.com/storypros?ref=${user.referral_code}`}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyReferralLink}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Referrals Made</Label>
                  <p className="text-2xl font-bold mt-1">{user.invite_count}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Points from Referrals</Label>
                  <p className="text-2xl font-bold mt-1">{user.invite_count * 25}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Send Email */}
          <Card className="p-4">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Send Email to User</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select email template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verification_resend">Verification Resend</SelectItem>
                  <SelectItem value="nudge">Referral Nudge</SelectItem>
                  
                  <SelectItem value="weekly_digest">Weekly Digest</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleSendEmail}
                disabled={isSendingEmail}
                className="w-full"
              >
                <Mail className="h-4 w-4 mr-2" />
                {isSendingEmail ? "Sending..." : "Send Email"}
              </Button>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onFlagChange}
            >
              <Flag className="h-4 w-4 mr-2" />
              {user.flagged ? "Unflag User" : "Flag User"}
            </Button>
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModal;
