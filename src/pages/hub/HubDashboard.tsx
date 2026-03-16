import { useState, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import { useAuth } from "@/contexts/AuthContext";
import HubLayout from "@/components/hub/HubLayout";
import ResourceCard from "@/components/hub/ResourceCard";
import ResourceDetailModal from "@/components/hub/ResourceDetailModal";
import PurchaseModal from "@/components/hub/PurchaseModal";
import ResourceRequestModal from "@/components/hub/ResourceRequestModal";
import { useResources, type SortOption, type Resource } from "@/hooks/useResources";
import { useProducts, usePurchases } from "@/hooks/usePurchases";
import { useSavedResources } from "@/hooks/useSavedResources";
import { supabase } from "@/integrations/supabase/client";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const AUDIENCE_PILLS = [
  { label: "All", value: "" },
  { label: "Parents", value: "parent" },
  { label: "Educators", value: "educator" },
  { label: "Therapists", value: "slp" },
];

const HubDashboard = () => {
  const { profile, user, refreshProfile } = useAuth();
  const [searchParams] = useSearchParams();

  const {
    resources: filtered,
    loading,
    filters,
    sort,
    setSort,
    setSearch,
    setAudienceTab,
    clearFilters,
  } = useResources(profile?.role);

  const { priceMap } = useProducts();
  const { purchasedResourceIds, refetch: refetchPurchases } = usePurchases(user?.id);
  const { savedIds, toggle: toggleSave } = useSavedResources(user?.id);

  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [purchaseResource, setPurchaseResource] = useState<Resource | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  // Handle purchase success URL param
  useEffect(() => {
    if (searchParams.get("purchase") === "success") {
      toast.success("Purchase complete! Your resource is now unlocked.");
      refetchPurchases();
    }
  }, [searchParams, refetchPurchases]);

  // Determine if returning user (welcome_dismissed = true means they've visited before)
  useEffect(() => {
    if (profile) {
      setIsReturning(profile.welcome_dismissed === true);
      // Mark as visited for next time
      if (profile.welcome_dismissed === false && user) {
        supabase.from("profiles").update({ welcome_dismissed: true }).eq("id", user.id).then(() => {
          refreshProfile();
        });
      }
    }
  }, [profile, user, refreshProfile]);

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

  const handleToggleSave = useCallback((resource: Resource) => {
    toggleSave(resource.id);
  }, [toggleSave]);

  const firstName = profile?.first_name || "there";
  const welcomeHeading = isReturning
    ? `Welcome back, ${firstName}!`
    : `Welcome, ${firstName}, to the DLD Resource Hub`;

  return (
    <HubLayout activeAudience={filters.audienceTab} onAudienceChange={setAudienceTab}>
      {/* Welcome Header */}
      <div className="bg-midnight text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-1">{welcomeHeading}</h1>
          <p className="text-sm sm:text-base text-white/80">
            Browse practical tools designed to support children with Developmental Language Disorder.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-ui" />
            <input
              type="text" value={filters.search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic, keyword, or audience…"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-thistle bg-card text-sm placeholder:text-stone-ui focus:outline-none focus:ring-2 focus:ring-hub-lavender"
            />
          </div>
        </div>

        {/* Audience Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          {AUDIENCE_PILLS.map((pill) => (
            <button
              key={pill.value}
              onClick={() => setAudienceTab(pill.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                filters.audienceTab === pill.value
                  ? "bg-midnight text-white border-midnight"
                  : "bg-card text-midnight border-thistle hover:border-hub-lavender hover:text-hub-lavender"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Subtext */}
        <p className="text-right text-sm text-stone-ui mb-8">
          Supporting a child with DLD is a team effort. Many of these resources are useful across all roles.
        </p>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <h2 className="text-xl font-bold text-midnight">
            Resource Library
            <span className="text-sm font-normal text-stone-ui ml-2">({filtered.length})</span>
          </h2>
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="w-44 border-thistle"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="most_downloaded">Most Downloaded</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="a_z">A–Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-midnight font-semibold text-lg mb-1">No resources found</p>
            <p className="text-stone-ui mb-6">Try a different search term or filter.</p>
            <Button variant="outline" onClick={() => { clearFilters(); setSearch(""); }} className="border-thistle">Clear Filters</Button>
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.4 }}>
                <ResourceCard
                  resource={r} onView={setSelectedResource} onDownload={handleDownload} onUnlock={handleUnlock}
                  price={priceMap[r.id]?.price} currency={priceMap[r.id]?.currency}
                  isPurchased={purchasedResourceIds.has(r.id)}
                  isSaved={savedIds.has(r.id)} onToggleSave={handleToggleSave} userId={user?.id}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

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

      {/* Resource Request Modal */}
      <ResourceRequestModal open={requestModalOpen} onClose={() => setRequestModalOpen(false)} userId={user?.id} />

      {/* Floating Request Button */}
      <button
        onClick={() => setRequestModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-mauve text-white rounded-full p-4 shadow-lg hover:bg-mauve/90 transition-all hover:scale-105"
        aria-label="Request a Resource"
      >
        <Plus className="h-5 w-5" />
      </button>
    </HubLayout>
  );
};

export default HubDashboard;
