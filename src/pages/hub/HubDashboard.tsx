import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import HubLayout from "@/components/hub/HubLayout";
import ResourceCard from "@/components/hub/ResourceCard";
import FilterSidebar from "@/components/hub/FilterSidebar";
import ResourceDetailModal from "@/components/hub/ResourceDetailModal";
import { useResources, type SortOption, type Resource } from "@/hooks/useResources";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Users, BookOpen, SlidersHorizontal, LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const roleLabel: Record<string, string> = {
  parent: "Parents",
  slp: "SLPs & Therapists",
  educator: "Educators",
  school_leader: "School Leaders",
  other: "You",
};

const HubDashboard = () => {
  const { profile, user } = useAuth();
  const {
    resources: filtered,
    recommended,
    loading,
    filters,
    sort,
    setSort,
    toggleFilter,
    setSearch,
    clearFilters,
    hasActiveFilters,
  } = useResources(profile?.role);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showRecommended, setShowRecommended] = useState(true);

  // Listen for header search events
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setSearch(detail || "");
    };
    window.addEventListener("hub-search", handler);
    return () => window.removeEventListener("hub-search", handler);
  }, [setSearch]);

  const handleDownload = useCallback(
    async (resource: Resource) => {
      if (!user) return;
      // Track download
      await supabase.from("user_downloads").insert({
        user_id: user.id,
        resource_id: resource.id,
      });
      // Increment download count via RPC
      await supabase.rpc("increment_download_count", { resource_id: resource.id });

      if (resource.file_url) {
        window.open(resource.file_url, "_blank");
      } else {
        toast.info("This resource file will be available soon.");
      }
    },
    [user]
  );

  const handleQuickFilter = useCallback(
    (type: "popular" | "age" | "setting") => {
      clearFilters();
      if (type === "popular") {
        setSort("most_downloaded");
      } else if (type === "age") {
        // Scroll to filters and highlight age section — just open mobile filters for now
        setMobileFiltersOpen(true);
      } else if (type === "setting") {
        setMobileFiltersOpen(true);
      }
    },
    [clearFilters, setSort]
  );

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

        {/* Mobile search */}
        <div className="md:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-ui" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources…"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-thistle bg-card text-sm placeholder:text-stone-ui focus:outline-none focus:ring-2 focus:ring-hub-lavender"
            />
          </div>
        </div>

        {/* Quick Start */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 border-2 border-thistle hover:bg-thistle/30 hover:border-hub-lavender transition-all rounded-xl"
            onClick={() => handleQuickFilter("popular")}
          >
            <Sparkles className="h-6 w-6 text-hub-lavender" />
            <span className="font-semibold text-midnight">Most Popular</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 border-2 border-thistle hover:bg-thistle/30 hover:border-hub-lavender transition-all rounded-xl"
            onClick={() => handleQuickFilter("age")}
          >
            <Users className="h-6 w-6 text-hub-lavender" />
            <span className="font-semibold text-midnight">Browse by Age</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 border-2 border-thistle hover:bg-thistle/30 hover:border-hub-lavender transition-all rounded-xl"
            onClick={() => handleQuickFilter("setting")}
          >
            <BookOpen className="h-6 w-6 text-hub-lavender" />
            <span className="font-semibold text-midnight">Browse by Setting</span>
          </Button>
        </div>

        {/* Recommended Section */}
        {showRecommended && recommended.length > 0 && !hasActiveFilters && !filters.search && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-midnight">
                Recommended for {roleLabel[profile?.role || "other"]}
              </h2>
              <button
                onClick={() => setShowRecommended(false)}
                className="text-sm text-stone-ui hover:text-midnight transition-colors"
              >
                Dismiss
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommended.map((r) => (
                <ResourceCard
                  key={r.id}
                  resource={r}
                  onView={setSelectedResource}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="flex gap-8">
          {/* Filter sidebar — desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                toggleFilter={toggleFilter}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

          {/* Mobile filter sheet */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/30" onClick={() => setMobileFiltersOpen(false)} />
              <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-card overflow-y-auto p-4">
                <FilterSidebar
                  filters={filters}
                  toggleFilter={toggleFilter}
                  clearFilters={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                  onClose={() => setMobileFiltersOpen(false)}
                  isMobile
                />
              </div>
            </div>
          )}

          {/* Resource grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-midnight">
                All Resources
                <span className="text-sm font-normal text-stone-ui ml-2">
                  ({filtered.length})
                </span>
              </h2>

              <div className="flex items-center gap-3">
                {/* Mobile filter toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden border-thistle"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-1.5 h-5 w-5 rounded-full bg-mauve text-white text-xs flex items-center justify-center">
                      !
                    </span>
                  )}
                </Button>

                <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
                  <SelectTrigger className="w-44 border-thistle">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="most_downloaded">Most Downloaded</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="a_z">A–Z</SelectItem>
                  </SelectContent>
                </Select>

                <div className="hidden sm:flex border border-thistle rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-colors ${viewMode === "grid" ? "bg-thistle/50 text-midnight" : "text-stone-ui hover:text-midnight"}`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-colors ${viewMode === "list" ? "bg-thistle/50 text-midnight" : "text-stone-ui hover:text-midnight"}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-72 rounded-xl" />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-stone-ui text-lg mb-2">No resources match your filters.</p>
                <Button variant="outline" onClick={clearFilters} className="border-thistle">
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Grid / List */}
            {!loading && filtered.length > 0 && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    : "flex flex-col gap-3"
                }
              >
                {filtered.map((r) => (
                  <ResourceCard
                    key={r.id}
                    resource={r}
                    onView={setSelectedResource}
                    onDownload={handleDownload}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <ResourceDetailModal
        resource={selectedResource}
        open={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        onDownload={handleDownload}
      />
    </HubLayout>
  );
};

export default HubDashboard;
