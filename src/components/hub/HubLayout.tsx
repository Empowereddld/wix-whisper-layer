import HubHeader from "./HubHeader";
import NoIndexHead from "@/components/NoIndexHead";

interface HubLayoutProps {
  children: React.ReactNode;
  activeAudience?: string;
  onAudienceChange?: (value: string) => void;
}

const HubLayout = ({ children, activeAudience, onAudienceChange }: HubLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NoIndexHead />
      <HubHeader activeAudience={activeAudience} onAudienceChange={onAudienceChange} />
      <main className="flex-1">{children}</main>
      <footer className="bg-midnight text-white/50 text-center text-sm py-5 mt-16">
        © 2026 Empowered DLD. All rights reserved.
      </footer>
    </div>
  );
};

export default HubLayout;
