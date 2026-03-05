import { useAuth } from "@/contexts/AuthContext";
import HubLayout from "@/components/hub/HubLayout";
import { Sparkles, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const HubDashboard = () => {
  const { profile } = useAuth();

  const roleLabel: Record<string, string> = {
    parent: "Parents",
    slp: "SLPs & Therapists",
    educator: "Educators",
    school_leader: "School Leaders",
    other: "You",
  };

  return (
    <HubLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-midnight mb-2">
            Welcome, {profile?.first_name || "there"}!
          </h1>
          <p className="text-stone-ui text-lg">
            Here's everything you need to support children with DLD. Browse, search, or explore by category below.
          </p>
        </div>

        {/* Quick Start */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 border-2 border-thistle hover:bg-thistle/30 hover:border-hub-lavender transition-all rounded-xl">
            <Sparkles className="h-6 w-6 text-hub-lavender" />
            <span className="font-semibold text-midnight">Most Popular</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 border-2 border-thistle hover:bg-thistle/30 hover:border-hub-lavender transition-all rounded-xl">
            <Users className="h-6 w-6 text-hub-lavender" />
            <span className="font-semibold text-midnight">Browse by Age</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 border-2 border-thistle hover:bg-thistle/30 hover:border-hub-lavender transition-all rounded-xl">
            <BookOpen className="h-6 w-6 text-hub-lavender" />
            <span className="font-semibold text-midnight">Browse by Setting</span>
          </Button>
        </div>

        {/* Main content area */}
        <div className="flex gap-8">
          {/* Filter sidebar placeholder */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-thistle/40 rounded-2xl p-6 sticky top-24">
              <h3 className="font-semibold text-midnight mb-4">Filters</h3>
              <p className="text-sm text-stone-ui">Filters will be available in Phase 2.</p>
            </div>
          </aside>

          {/* Resource grid placeholder */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-midnight">
                Recommended for {roleLabel[profile?.role || "other"]}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-thistle/60 p-6 h-48 flex items-center justify-center">
                  <p className="text-sm text-stone-ui text-center">Resource cards coming in Phase 2</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </HubLayout>
  );
};

export default HubDashboard;
