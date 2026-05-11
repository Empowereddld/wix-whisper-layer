import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Pencil } from "lucide-react";
import { format } from "date-fns";
import { formatRole } from "@/lib/storypros-roles";
import { formatHopes, formatHearAbout } from "@/lib/storypros-profile";
import { getTierForPoints, getTierName } from "@/lib/waitlist-utils";
import EditProfileDialog from "@/components/waitlist/EditProfileDialog";

export interface AdminWaitlistUser {
  id: string;
  name: string;
  email: string;
  referral_code: string;
  invite_count: number;
  points: number;
  email_verified: boolean;
  created_at: string;
  role: string | null;
  role_other: string | null;
  child_age: number | null;
  hopes: string[] | null;
  hopes_other: string | null;
  hear_about: string | null;
  profile_completed_at: string | null;
}

interface Props {
  user: AdminWaitlistUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <Label className="text-xs text-muted-foreground uppercase tracking-wide">
      {label}
    </Label>
    <div className="text-sm mt-1 text-foreground">{value}</div>
  </div>
);

const StoryProsUserDetailModal = ({ user, open, onOpenChange, onSaved }: Props) => {
  const [editOpen, setEditOpen] = useState(false);

  if (!user) return null;

  const tier = getTierName(getTierForPoints(user.points || 0));

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{user.name}</DialogTitle>
            <DialogDescription className="font-mono text-xs">
              {user.email} · {user.referral_code}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <Card className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Status"
                  value={
                    user.email_verified ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700">
                        <XCircle className="h-3 w-3 mr-1" /> Unverified
                      </Badge>
                    )
                  }
                />
                <Field
                  label="Tier"
                  value={
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      {tier}
                    </Badge>
                  }
                />
                <Field label="Points" value={<span className="font-semibold">{user.points}</span>} />
                <Field label="Referrals" value={<span className="font-semibold">{user.invite_count}</span>} />
                <Field
                  label="Joined"
                  value={format(new Date(user.created_at), "MMM dd, yyyy")}
                />
                <Field
                  label="Role"
                  value={
                    user.role ? (
                      formatRole(user.role, user.role_other)
                    ) : (
                      <span className="italic text-muted-foreground">—</span>
                    )
                  }
                />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Profile details</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditOpen(true)}
                >
                  <Pencil className="h-3 w-3 mr-1.5" /> Edit profile
                </Button>
              </div>

              {user.profile_completed_at ? (
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Child's age"
                    value={user.child_age ?? "—"}
                  />
                  <Field
                    label="How they heard"
                    value={formatHearAbout(user.hear_about)}
                  />
                  <div className="col-span-2">
                    <Field label="Hopes" value={formatHopes(user.hopes)} />
                  </div>
                  {user.hopes_other && (
                    <div className="col-span-2">
                      <Field
                        label="Other hope (detail)"
                        value={<span className="italic">{user.hopes_other}</span>}
                      />
                    </div>
                  )}
                  <div className="col-span-2">
                    <Field
                      label="Profile completed"
                      value={format(new Date(user.profile_completed_at), "MMM dd, yyyy HH:mm")}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm italic text-muted-foreground">
                  This user hasn't completed their profile yet.
                </p>
              )}
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        referralCode={user.referral_code}
        initial={{
          childAge: user.child_age,
          hopes: user.hopes ?? [],
          hopesOther: user.hopes_other,
          hearAbout: user.hear_about,
        }}
        adminMode
        onSaved={() => {
          setEditOpen(false);
          onSaved();
        }}
      />
    </>
  );
};

export default StoryProsUserDetailModal;
