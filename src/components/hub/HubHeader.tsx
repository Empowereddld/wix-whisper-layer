import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, ChevronDown, Shield, Rocket } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import empoweredLogoWhite from "@/assets/empowered-logo-white.webp";

const AUDIENCE_TABS = [
  { label: "All", value: "" },
  { label: "Parents", value: "parent" },
  { label: "Therapists", value: "slp" },
  { label: "Educators", value: "educator" },
] as const;

interface HubHeaderProps {
  activeAudience?: string;
  onAudienceChange?: (value: string) => void;
}

const HubHeader = ({ activeAudience = "", onAudienceChange }: HubHeaderProps) => {
  const { user, profile, signOut } = useAuth();
  const { isAdmin } = useAdminCheck(user?.id);
  const navigate = useNavigate();
  const [hasJoinedStoryPros, setHasJoinedStoryPros] = useState(false);

  // Check whether this user is already on the Story Pros waitlist (by email)
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      if (!user?.email) {
        setHasJoinedStoryPros(false);
        return;
      }
      const { data } = await supabase
        .from("storybuilders_waitlist")
        .select("id")
        .eq("email", user.email.toLowerCase())
        .maybeSingle();
      if (!cancelled) setHasJoinedStoryPros(!!data);
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/hub/login");
  };

  const initials = profile?.first_name
    ? profile.first_name.charAt(0).toUpperCase()
    : "?";

  const handleStoryProsClick = () => {
    // If they've joined the waitlist, take them to their dashboard.
    // Otherwise send them to the marketing/signup page so they can join first.
    navigate(hasJoinedStoryPros ? "/storypros/dashboard" : "/storypros");
  };

  return (
    <header className="bg-midnight text-midnight-foreground sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Logo */}
          <button
            onClick={() => navigate("/hub")}
            className="flex-shrink-0 -my-4"
          >
            <img src={empoweredLogoWhite} alt="Empowered DLD" className="h-24" />
          </button>

          {/* Spacer for centering */}
          <div className="flex-1" />

          {/* Story Pros Link */}
          <button
            onClick={handleStoryProsClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 hover:text-purple-200 text-sm font-medium transition-all mr-4 flex-shrink-0"
            aria-label={hasJoinedStoryPros ? "Open Story Pros Dashboard" : "Join Story Pros"}
          >
            <Rocket className="h-4 w-4" />
            <span className="hidden sm:inline">
              {hasJoinedStoryPros ? "Story Pros Dashboard" : "Join Story Pros"}
            </span>
          </button>


          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium hover:text-hub-lavender transition-colors outline-none flex-shrink-0">
              {/* Avatar circle */}
              <span className="h-8 w-8 rounded-full bg-hub-lavender text-midnight flex items-center justify-center font-bold text-sm">
                {initials}
              </span>
              <span className="hidden sm:inline">{profile?.first_name || "Account"}</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {isAdmin && (
                <DropdownMenuItem
                  onClick={() => navigate("/admin")}
                  className="cursor-pointer"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => navigate("/hub/settings")}
                className="cursor-pointer"
              >
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

    </header>
  );
};

export default HubHeader;
