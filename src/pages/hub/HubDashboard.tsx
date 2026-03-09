import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/contexts/AuthContext";
import HubLayout from "@/components/hub/HubLayout";
import ResourceCard from "@/components/hub/ResourceCard";
import ResourceDetailModal from "@/components/hub/ResourceDetailModal";
import PurchaseModal from "@/components/hub/PurchaseModal";
import { useResources, type SortOption, type Resource } from "@/hooks/useResources";
import { useProducts, usePurchases } from "@/hooks/usePurchases";
import { supabase } from "@/integrations/supabase/client";
import { X, Search, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const roleLabel: Record<string, string> = {
  parent: "Parents",
  slp: "SLPs & Therapists",
  educator: "Educators",
  school_leader: "School Leaders",
  other: "You",
};

const TYPE_PILLS = [
  { label: "All Types", value: "" },
  { label: "Checklist", value: "checklist" },
  { label: "Guide", value: "guide" },
  { label: "Poster", value: "poster" },
  { label: "Infographic", value: "infographic" },
  { label: "Bundle", value: "bundle" },
  { label: "Activity", value: "activity" },
  { label: "Handout", value: "handout" },
];

const PURCHASE_FILTER_PILLS = [
  { label: "All", value: "" },
  { label: "My Purchases", value: "purchased" },
  { label: "Free", value: "free" },
  { label: "Premium", value: "paid" },
];

const HubDashboard = () => {
  const { profile, user, refreshProfile } = useAuth();
  const [searchParams] = useSearchParams();

  const {
    resources: filtered,
    recommended,
    loading,
    filters,
    sort,
    setSort,
    toggleFilter,
    setSearch,
    setAudienceTab,
    clearFilters,
    hasActiveFilters,
  } = useResources(profile?.role);

  const { priceMap } = useProducts();
  const { purchasedResourceIds, refetch: refetchPurchases } = usePurchases(user?.id);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [purchaseResource, setPurchaseResource] = useState<Resource | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [activeType, setActiveType] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  // Handle purchase success URL param
  useEffect(() => {
    if (searchParams.get("purchase") === "success") {
      toast.success("Purchase complete! Your resource is now unlocked.");
      refetchPurchases();
    }
  }, [searchParams, refetchPurchases]);

  useEffect(() => {
    if (profile && profile.welcome_dismissed === false) setShowBanner(true);
  }, [profile]);

  useEffect(() => {
    if (profile?.role) setAudienceTab(profile.role);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.role]);

  const handleDismissBanner = async () => {
    setShowBanner(false);
    if (user) {
      await supabase.from("profiles").update({ welcome_dismissed: true }).eq("id", user.id);
      refreshProfile();
    }
  };

  const handleTypeFilter = (type: string) => {
    setActiveType(type);
    filters.resourceTypes.forEach((t) => toggleFilter("resourceTypes", t));
    if (type) toggleFilter("resourceTypes", type);
  };

  const handleDownload = useCallback(async (resource: Resource) => {
    if (!user) return;
    await supabase.from("user_downloads").insert({ user_id: user.id, resource_id: resource.id });
    await supabase.rpc("increment_download_count", { resource_id: resource.id });
    if (resource.file_url) {
      window.open(resource.file_url, "_blank");
    } else {
      toast.info("This resource file will be available soon.");
    }
  }, [user]);

  const handleUnlock = useCallback((resource: Resource) => {
    setPurchaseResource(resource);
  }, []);

  // Apply price filter on top of existing filtered resources
  const displayResources = filtered.filter((r) => {
    const product = priceMap[r.id];
    const isPaid = product && product.price > 0;
    if (priceFilter === "purchased") return isPaid && purchasedResourceIds.has(r.id);
    if (priceFilter === "free") return !isPaid;
    if (priceFilter === "paid") return isPaid;
    return true;
  });

  return (
    <HubLayout activeAudience={filters.audienceTab} onAudienceChange={setAudienceTab}>
      {/* Welcome Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="bg-midnight text-white"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
              <p className="text-sm sm:text-base">
                👋 <span className="font-semibold">Welcome, {profile?.first_name || "there"}!</span>{" "}
                Here are your <span className="text-hub-lavender font-semibold">{roleLabel[profile?.role || "other"]}</span> resources to get started.
              </p>
              <button onClick={handleDismissBanner} className="flex-shrink-0 text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10" aria-label="Dismiss">
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-ui" />
            <input
              type="text" value={filters.search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic, age, setting, or resource type…"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-thistle bg-card text-sm placeholder:text-stone-ui focus:outline-none focus:ring-2 focus:ring-hub-lavender"
            />
          </div>

          {/* Price filter pills */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-stone-ui uppercase tracking-wide mr-1">Show:</span>
            {PURCHASE_FILTER_PILLS.map((pill) => (
              <button
                key={pill.value}
                onClick={() => setPriceFilter(pill.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                  priceFilter === pill.value
                    ? "bg-midnight text-white border-midnight"
                    : "bg-card text-midnight border-thistle hover:border-hub-lavender hover:text-hub-lavender"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Type pills */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-stone-ui uppercase tracking-wide mr-1">Type:</span>
            {TYPE_PILLS.map((pill) => (
              <button
                key={pill.value}
                onClick={() => handleTypeFilter(pill.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                  activeType === pill.value
                    ? "bg-midnight text-white border-midnight"
                    : "bg-card text-midnight border-thistle hover:border-hub-lavender hover:text-hub-lavender"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recommended */}
        {recommended.length > 0 && !hasActiveFilters && !filters.search && !filters.audienceTab && !priceFilter && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-midnight mb-4">
              Recommended for <span className="text-hub-lavender">{roleLabel[profile?.role || "other"]}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommended.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.4 }}>
                  <ResourceCard
                    resource={r} onView={setSelectedResource} onDownload={handleDownload} onUnlock={handleUnlock}
                    price={priceMap[r.id]?.price} currency={priceMap[r.id]?.currency}
                    isPurchased={purchasedResourceIds.has(r.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <h2 className="text-xl font-bold text-midnight">
            {priceFilter === "purchased" ? "My Purchases" : filters.audienceTab ? `${roleLabel[filters.audienceTab] ?? "All"} Resources` : "All Resources"}
            <span className="text-sm font-normal text-stone-ui ml-2">({displayResources.length})</span>
          </h2>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="md:hidden border-thistle" onClick={() => setMobileFiltersOpen(true)}>
              <SlidersHorizontal className="h-4 w-4 mr-1.5" /> Filters
            </Button>
            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger className="w-44 border-thistle"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="most_downloaded">Most Downloaded</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="a_z">A–Z</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden sm:flex border border-thistle rounded-lg overflow-hidden">
              <button onClick={() => setViewMode("grid")} className={`p-2 transition-colors ${viewMode === "grid" ? "bg-thistle/50 text-midnight" : "text-stone-ui hover:text-midnight"}`}>
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2 transition-colors ${viewMode === "list" ? "bg-thistle/50 text-midnight" : "text-stone-ui hover:text-midnight"}`}>
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-5">
            {filters.roles.map((r) => (
              <span key={r} className="flex items-center gap-1 px-3 py-1 rounded-full bg-thistle/60 text-midnight text-sm">
                {r}
                <button onClick={() => toggleFilter("roles", r)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
              </span>
            ))}
            {filters.resourceTypes.map((t) => (
              <span key={t} className="flex items-center gap-1 px-3 py-1 rounded-full bg-thistle/60 text-midnight text-sm">
                {t}
                <button onClick={() => { toggleFilter("resourceTypes", t); setActiveType(""); }} className="hover:text-destructive"><X className="h-3 w-3" /></button>
              </span>
            ))}
            <button onClick={() => { clearFilters(); setActiveType(""); }} className="text-xs text-stone-ui underline hover:text-midnight ml-1">Clear all</button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
          </div>
        )}

        {/* Empty */}
        {!loading && displayResources.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">{priceFilter === "purchased" ? "🛍️" : "🔍"}</p>
            <p className="text-midnight font-semibold text-lg mb-1">
              {priceFilter === "purchased" ? "No purchases yet" : "No resources found"}
            </p>
            <p className="text-stone-ui mb-6">
              {priceFilter === "purchased" ? "Unlock a premium resource to see it here." : "Try a different combination of filters."}
            </p>
            <Button variant="outline" onClick={() => { clearFilters(); setActiveType(""); setPriceFilter(""); }} className="border-thistle">Clear Filters</Button>
          </div>
        )}

        {/* Grid / List */}
        {!loading && displayResources.length > 0 && (
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" : "flex flex-col gap-3"}>
            {displayResources.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.4 }}>
                <ResourceCard
                  resource={r} onView={setSelectedResource} onDownload={handleDownload} onUnlock={handleUnlock}
                  viewMode={viewMode}
                  price={priceMap[r.id]?.price} currency={priceMap[r.id]?.currency}
                  isPurchased={purchasedResourceIds.has(r.id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-card overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-midnight text-lg">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-1 rounded-lg hover:bg-thistle/60"><X className="h-5 w-5 text-midnight" /></button>
            </div>
            <div className="space-y-2 mb-6">
              <p className="text-sm font-semibold text-midnight">Resource Type</p>
              <div className="flex flex-wrap gap-2">
                {TYPE_PILLS.map((pill) => (
                  <button key={pill.value} onClick={() => { handleTypeFilter(pill.value); setMobileFiltersOpen(false); }}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${activeType === pill.value ? "bg-midnight text-white border-midnight" : "bg-card text-midnight border-thistle hover:border-hub-lavender"}`}>
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={() => { clearFilters(); setActiveType(""); setMobileFiltersOpen(false); }} className="w-full border-stone-ui">Clear All Filters</Button>
            )}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <ResourceDetailModal resource={selectedResource} open={!!selectedResource} onClose={() => setSelectedResource(null)} onDownload={handleDownload} />

      {/* Purchase Modal */}
      <PurchaseModal
        resource={purchaseResource}
        product={purchaseResource ? priceMap[purchaseResource.id] ?? null : null}
        open={!!purchaseResource}
        onClose={() => setPurchaseResource(null)}
        onPurchased={refetchPurchases}
        userId={user?.id}
      />
    </HubLayout>
  );
};

export default HubDashboard;
