import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, ChevronDown, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import empoweredLogoWhite from "@/assets/empowered-logo-white.png";

const HubHeader = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/hub/login");
  };

  return (
    <header className="bg-midnight text-midnight-foreground sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="https://empowereddld.com" className="flex-shrink-0" target="_blank" rel="noopener noreferrer">
            <img src={empoweredLogoWhite} alt="Empowered DLD" className="h-8" />
          </a>

          {/* Search - placeholder */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-ui" />
              <input
                type="text"
                placeholder="Search by topic, age, setting, or resource type"
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/10 border border-white/20 text-sm placeholder:text-stone-ui focus:outline-none focus:ring-2 focus:ring-hub-lavender text-white"
                disabled
              />
            </div>
          </div>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium hover:text-hub-lavender transition-colors outline-none">
              <span>{profile?.first_name || "Account"}</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate("/hub/settings")} className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
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
