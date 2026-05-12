import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Mail, Send } from "lucide-react";
import { getTierName } from "@/lib/waitlist-utils";

interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  invite_count: number;
  referral_code: string;
  created_at: string;
  email_verified?: boolean;
  current_tier?: number;
  flagged?: boolean;
}

interface BulkEmailComposerProps {
  users: WaitlistUser[];
  onClose: () => void;
}

type TemplateType = "announcement" | "nudge" | "weekly_digest" | "custom";
type RecipientFilter = "all" | "verified_only" | "tier" | "flagged" | "custom";

const TEMPLATES: Record<string, { subject: string; body: string }> = {
  announcement: {
    subject: "Exciting Update from Story Pros",
    body: "Hello {name},\n\nWe have some exciting news to share with you!\n\nStay tuned for updates.\n\nBest regards,\nThe Story Pros Team",
  },
  nudge: {
    subject: "Earn more rewards - Share your referral link",
    body: "Hi {name},\n\nYou're doing great on the waitlist! One of the best ways to earn more rewards is by inviting others.\n\nShare your referral link with friends and family to unlock higher tiers and exclusive benefits.\n\nThanks for being part of the Launch Team!",
  },
  milestone_unlocked: {
    subject: "Congratulations! You've unlocked a new milestone",
    body: "Hey {name},\n\nCongratulations on reaching a new milestone! Your dedication to the Story Pros community is amazing.\n\nYou've unlocked exclusive benefits as a thank you for your support.\n\nWe're excited to have you with us!",
  },
  weekly_digest: {
    subject: "Your Story Pros Weekly Digest",
    body: "Hello {name},\n\nHere's your weekly digest of community highlights and your progress on the waitlist.\n\nKeep up the great work!\n\nBest regards,\nThe Story Pros Team",
  },
};

const BulkEmailComposer = ({ users, onClose }: BulkEmailComposerProps) => {
  const [templateType, setTemplateType] = useState<TemplateType>("announcement");
  const [recipientFilter, setRecipientFilter] = useState<RecipientFilter>("all");
  const [selectedTier, setSelectedTier] = useState<string>("0");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Update subject and body when template changes
  const handleTemplateChange = (newTemplate: TemplateType) => {
    setTemplateType(newTemplate);
    if (newTemplate !== "custom" && TEMPLATES[newTemplate]) {
      setSubject(TEMPLATES[newTemplate].subject);
      setBody(TEMPLATES[newTemplate].body);
    } else if (newTemplate === "custom") {
      setSubject("");
      setBody("");
    }
  };

  const filteredRecipients = useMemo(() => {
    let filtered = [...users];

    switch (recipientFilter) {
      case "verified_only":
        filtered = filtered.filter((u) => u.email_verified);
        break;
      case "tier":
        filtered = filtered.filter((u) => u.current_tier === Number(selectedTier));
        break;
      case "flagged":
        filtered = filtered.filter((u) => u.flagged);
        break;
      case "all":
      default:
        break;
    }

    return filtered;
  }, [users, recipientFilter, selectedTier]);

  const recipientSummary = useMemo(() => {
    const total = filteredRecipients.length;
    const verified = filteredRecipients.filter((u) => u.email_verified).length;
    const flagged = filteredRecipients.filter((u) => u.flagged).length;

    return { total, verified, flagged };
  }, [filteredRecipients]);

  const handleSendEmail = async () => {
    // Validate subject and body
    if (!subject.trim()) {
      toast.error("Subject is required");
      return;
    }
    if (!body.trim()) {
      toast.error("Body is required");
      return;
    }

    setIsSending(true);
    try {
      let sentCount = 0;
      let failedCount = 0;

      for (const user of filteredRecipients) {
        try {
          const personalizedBody = body.replace(/{name}/g, user.name.split(" ")[0]);

          const { error } = await supabase.functions.invoke("send-waitlist-email", {
            body: {
              to: user.email,
              template: templateType === "custom" ? "custom" : templateType,
              subject: subject,
              data: {
                name: user.name.split(" ")[0],
                body: personalizedBody,
              },
            },
          });

          if (error) {
            failedCount++;
            console.error(`Failed to send to ${user.email}:`, error);
          } else {
            sentCount++;
          }
        } catch (error) {
          failedCount++;
          console.error(`Error sending to ${user.email}:`, error);
        }
      }

      toast.success(`Email sending complete! Successfully sent: ${sentCount}. Failed: ${failedCount}`);
      setShowConfirmation(false);
      onClose();
    } catch (error) {
      console.error("Error in batch send:", error);
      toast.error("An error occurred while sending emails");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Bulk Email Composer
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Template Selection */}
            <div>
              <Label htmlFor="template">Email Template</Label>
              <Select value={templateType} onValueChange={(v) => handleTemplateChange(v as TemplateType)}>
                <SelectTrigger id="template">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="nudge">Referral Nudge</SelectItem>
                  <SelectItem value="milestone_unlocked">Milestone Unlocked</SelectItem>
                  <SelectItem value="weekly_digest">Weekly Digest</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Recipients Selection */}
            <div className="space-y-3">
              <Label htmlFor="recipients">Send To</Label>
              <Select value={recipientFilter} onValueChange={(v) => setRecipientFilter(v as RecipientFilter)}>
                <SelectTrigger id="recipients">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users ({users.length})</SelectItem>
                  <SelectItem value="verified_only">Verified Only</SelectItem>
                  <SelectItem value="tier">Specific Tier</SelectItem>
                  <SelectItem value="flagged">Flagged Users</SelectItem>
                </SelectContent>
              </Select>

              {recipientFilter === "tier" && (
                <Select value={selectedTier} onValueChange={setSelectedTier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5].map((tier) => (
                      <SelectItem key={tier} value={String(tier)}>
                        {getTierName(tier)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Card className="bg-muted/50 p-3">
                <p className="text-sm font-medium">Recipients: {recipientSummary.total}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Verified: {recipientSummary.verified} | Flagged: {recipientSummary.flagged}
                </p>
              </Card>
            </div>

            {/* Subject Line */}
            <div>
              <Label htmlFor="subject">Subject Line</Label>
              <Input
                id="subject"
                placeholder="Email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Body */}
            <div>
              <Label htmlFor="body">
                Email Body
                <span className="text-xs text-muted-foreground ml-2">
                  Use {"{name}"} to insert recipient's first name
                </span>
              </Label>
              <Textarea
                id="body"
                placeholder="Email content..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            {/* Preview */}
            {showPreview && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Subject:</p>
                    <p className="text-sm font-semibold">{subject}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Body (with sample name substitution):</p>
                    <p className="text-sm whitespace-pre-wrap bg-white p-2 rounded border">
                      {body.replace(/{name}/g, "John")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? "Hide" : "Show"} Preview
              </Button>
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() => setShowConfirmation(true)}
                disabled={!subject || !body || recipientSummary.total === 0}
              >
                <Send className="h-4 w-4 mr-2" />
                Send to {recipientSummary.total}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send {recipientSummary.total} Emails?</AlertDialogTitle>
            <AlertDialogDescription>
              You're about to send this email to {recipientSummary.total} recipients.
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction
            onClick={handleSendEmail}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Emails"}
          </AlertDialogAction>
          <AlertDialogCancel disabled={isSending}>
            Cancel
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BulkEmailComposer;
