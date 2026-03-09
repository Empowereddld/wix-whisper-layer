import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import HubLayout from "@/components/hub/HubLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PasswordInput from "@/components/hub/PasswordInput";
import { countries } from "@/lib/countries";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const roles = [
  { value: "parent", label: "Parent" },
  { value: "slp", label: "SLP or Therapist" },
  { value: "educator", label: "Educator" },
  { value: "school_leader", label: "School Leader or Organization" },
  { value: "other", label: "Other" },
];

const ageRanges = [
  { value: "0-4", label: "0–4 years" },
  { value: "5-7", label: "5–7 years" },
  { value: "8-10", label: "8–10 years" },
  { value: "11-13", label: "11–13 years" },
  { value: "14+", label: "14+ years" },
  { value: "not_applicable", label: "Not applicable" },
];

const HubSettings = () => {
  const { profile, user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    role: "",
    country: "",
    age_range: "",
    job_title: "",
    organization_name: "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new_password: "",
    confirm: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name,
        role: profile.role,
        country: profile.country || "",
        age_range: profile.age_range || "not_applicable",
        job_title: profile.job_title || "",
        organization_name: profile.organization_name || "",
      });
    }
  }, [profile]);

  const authProvider = user?.app_metadata?.provider || "email";

  const handleSaveProfile = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: form.first_name.trim(),
        role: form.role as any,
        country: form.country || null,
        age_range: (form.age_range || "not_applicable") as any,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user!.id);
    setSaving(false);
    if (error) {
      toast({ title: "Failed to save changes", variant: "destructive" });
    } else {
      await refreshProfile();
      toast({ title: "Profile updated successfully" });
    }
  };

  const handleChangePassword = async () => {
    if (passwords.new_password.length < 8) {
      toast({ title: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    if (passwords.new_password !== passwords.confirm) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: passwords.new_password });
    if (error) {
      toast({ title: "Failed to change password", variant: "destructive" });
    } else {
      toast({ title: "Password changed successfully" });
      setPasswords({ current: "", new_password: "", confirm: "" });
    }
  };

  const handleDeleteAccount = async () => {
    // Account deletion requires a server-side function for security
    toast({ title: "Please contact support to delete your account.", variant: "destructive" });
  };

  return (
    <HubLayout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-midnight mb-8">Account Settings</h1>

        {/* Profile */}
        <section className="bg-white rounded-2xl border border-thistle/60 p-6 mb-6">
          <h2 className="text-lg font-semibold text-midnight mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-midnight font-medium">First Name</Label>
              <Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="h-12 mt-1" />
            </div>
            <div>
              <Label className="text-midnight font-medium">Email Address</Label>
              <Input value={user?.email || ""} disabled className="h-12 mt-1 bg-thistle/20" />
              <p className="text-xs text-stone-ui mt-1">Email changes require re-verification</p>
            </div>
            <div>
              <Label className="text-midnight font-medium">I am a:</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger className="h-12 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {roles.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-midnight font-medium">Country</Label>
              <Select value={form.country} onValueChange={(v) => setForm({ ...form, country: v })}>
                <SelectTrigger className="h-12 mt-1"><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>
                  {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-midnight font-medium">Age Range</Label>
              <Select value={form.age_range} onValueChange={(v) => setForm({ ...form, age_range: v })}>
                <SelectTrigger className="h-12 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ageRanges.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSaveProfile} className="bg-midnight hover:bg-midnight/90 text-midnight-foreground" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </section>

        {/* Login Methods */}
        <section className="bg-white rounded-2xl border border-thistle/60 p-6 mb-6">
          <h2 className="text-lg font-semibold text-midnight mb-4">Login Methods</h2>
          <p className="text-sm text-stone-ui">
            You signed up with: <span className="font-medium text-midnight capitalize">{authProvider}</span>
          </p>
        </section>

        {/* Password (only for email users) */}
        {authProvider === "email" && (
          <section className="bg-white rounded-2xl border border-thistle/60 p-6 mb-6">
            <h2 className="text-lg font-semibold text-midnight mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-midnight font-medium">New Password</Label>
                <div className="mt-1">
                  <PasswordInput value={passwords.new_password} onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })} placeholder="New password" />
                </div>
              </div>
              <div>
                <Label className="text-midnight font-medium">Confirm New Password</Label>
                <div className="mt-1">
                  <PasswordInput value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} placeholder="Confirm new password" />
                </div>
              </div>
              <Button onClick={handleChangePassword} variant="outline" className="border-midnight text-midnight hover:bg-midnight hover:text-midnight-foreground">
                Update Password
              </Button>
            </div>
          </section>
        )}

        {/* Privacy & Data */}
        <section className="bg-white rounded-2xl border border-thistle/60 p-6 mb-6">
          <h2 className="text-lg font-semibold text-midnight mb-4">Privacy & Data</h2>
          <Button variant="outline" disabled className="border-stone-ui text-stone-ui">
            Export My Data (coming soon)
          </Button>
        </section>

        {/* Danger zone */}
        <section className="bg-white rounded-2xl border border-destructive/30 p-6">
          <h2 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h2>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete My Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. All of your data will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </div>
    </HubLayout>
  );
};

export default HubSettings;
