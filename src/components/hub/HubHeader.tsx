import { useAuth } from "@/contexts/AuthContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, ChevronDown, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  const handleSignOut = async () => {
    await signOut();
    navigate("/hub/login");
  };

  const initials = profile?.first_name
    ? profile.first_name.charAt(0).toUpperCase()
    : "?";

  return (
    <header className="bg-midnight text-midnight-foreground sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-1 gap-4">
          {/* Logo */}
          <a
            href="https://empowereddld.com"
            className="flex-shrink-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={empoweredLogoWhite} alt="Empowered DLD" className="h-24" />
          </a>

          {/* Spacer for centering */}
          <div className="flex-1" />

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
