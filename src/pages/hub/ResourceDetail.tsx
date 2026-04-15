import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import HubLayout from "@/components/hub/HubLayout";
import PurchaseModal from "@/components/hub/PurchaseModal";
import ResourceCard from "@/components/hub/ResourceCard";
import SampleGallery from "@/components/hub/SampleGallery";
import SocialShareButtons from "@/components/hub/SocialShareButtons";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Download, ArrowLeft, FileText, Image, CheckSquare, BookOpen, Package, BarChart3,
  Lock, Check,
} from "lucide-react";
import { toast } from "sonner";
import { secureDownload } from "@/lib/secureDownload";
import type { Resource } from "@/hooks/useResources";
import { useProducts, usePurchases } from "@/hooks/usePurchases";

type DetailTab = "description" | "who_is_this_for";

const typeIcons: Record<string, React.ElementType> = {
  poster: Image, guide: BookOpen, checklist: CheckSquare, handout: FileText,
  activity: FileText, bundle: Package, infographic: BarChart3,
};

const audienceLabels: Record<string, string> = {
  parent: "Parents", slp: "Therapists", educator: "Educators", school_leader: "School Leaders",
};

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const ResourceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resource, setResource] = useState<Resource | null>(null);
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPurchase, setShowPurchase] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>("description");
  const { priceMap } = useProducts();
  const { purchasedResourceIds, refetch: refetchPurchases } = usePurchases(user?.id);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      const [{ data: res }, { data: all }] = await Promise.all([
        supabase.from("resources").select("*").eq("id", id).single(),
        supabase.from("resources").select("*").eq("is_published", true),
      ]);
      if (res) setResource(res);
      if (all) setAllResources(all as Resource[]);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const product = resource ? priceMap[resource.id] : undefined;
  const isPaid = product && product.price > 0;
  const isUnlocked = !isPaid || purchasedResourceIds.has(resource?.id || "");

  const suggestedResources = useMemo(() => {
    if (!resource) return [];
    const currentRoles = resource.roles || [];
    const others = allResources.filter((r) => r.id !== resource.id);

    // Prefer same audience
    const sameAudience = others.filter((r) =>
      r.roles?.some((role) => currentRoles.includes(role))
    );
    const rest = others.filter(
      (r) => !r.roles?.some((role) => currentRoles.includes(role))
    );

    return [...sameAudience, ...rest].slice(0, 3);
  }, [resource, allResources]);

  const handleDownload = useCallback(async (res?: Resource) => {
    const target = res || resource;
    if (!user || !target) return;
    // Fire-and-forget tracking
    supabase.from("user_downloads").insert({ user_id: user.id, resource_id: target.id }).then(() => {});
    supabase.rpc("increment_download_count", { resource_id: target.id }).then(() => {});
    // Secure download (signed URL for paid, direct for free)
    await secureDownload(target.id, target.file_url);
  }, [user, resource]);

  const handleView = useCallback(async (res: Resource) => {
    if (!user) return;
    await supabase.from("user_resource_views").upsert(
      { user_id: user.id, resource_id: res.id },
      { onConflict: "user_id,resource_id" }
    );
  }, [user]);

  if (loading) {
    return (
      <HubLayout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-5 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-[400px] rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          </div>
        </div>
      </HubLayout>
    );
  }

  if (!resource) {
    return (
      <HubLayout>
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-midnight mb-4">Resource Not Found</h1>
          <p className="text-stone-ui mb-6">The resource you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/hub")} className="bg-midnight text-midnight-foreground hover:bg-midnight/90">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Resource Library
          </Button>
        </div>
      </HubLayout>
    );
  }

  const Icon = typeIcons[resource.resource_type] || FileText;
  const audienceTags = (resource.roles ?? []).filter((r) => audienceLabels[r]).map((r) => audienceLabels[r]);

  return (
    <HubLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back navigation */}
        <button
          onClick={() => navigate("/hub")}
          className="flex items-center gap-2 text-stone-ui hover:text-midnight transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Resource Library
        </button>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left column — Cover image + sample gallery */}
          <div className="w-full">
            <SampleGallery
              thumbnailUrl={resource.thumbnail_url}
              sampleImages={(resource as any).sample_images || []}
              title={resource.title}
              fallbackIcon={Icon}
            />
          </div>

          {/* Right column — Details */}
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold text-midnight leading-snug mb-3">
              {resource.title}
            </h1>

            {/* Price badge */}
            <div className="mb-4">
              {isPaid && !isUnlocked ? (
                <span className="inline-block text-sm px-3 py-1 rounded-full bg-deep-purple text-white font-semibold">
                  {formatPrice(product!.price)}
                </span>
              ) : isPaid && isUnlocked ? (
                <span className="inline-block text-sm px-3 py-1 rounded-full bg-emerald-500 text-white font-medium">
                  Purchased
                </span>
              ) : (
                <span className="inline-block text-sm px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                  Free
                </span>
              )}
            </div>

            {/* Audience tags */}
            {audienceTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {audienceTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-pale-yellow text-deep-purple font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Format info — always show */}
            <p className="text-muted-foreground text-sm mb-5">
              PDF · {resource.page_count || 1} {(resource.page_count || 1) === 1 ? "page" : "pages"} · Printable
            </p>

            {/* Full description */}
            <p className="text-foreground/80 leading-relaxed text-base mb-8">
              {resource.description || resource.long_description}
            </p>

            {/* Action button pushed to bottom */}
            <div className="mt-auto">
              {isUnlocked ? (
                <Button
                  size="lg"
                  className="bg-midnight text-midnight-foreground hover:bg-midnight/90 h-12 px-10 w-full sm:w-auto"
                  onClick={() => handleDownload()}
                >
                  <Download className="h-5 w-5 mr-2" /> Download
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="bg-deep-purple text-white hover:bg-deep-purple/90 h-12 px-10 w-full sm:w-auto"
                  onClick={() => setShowPurchase(true)}
                >
                  <Lock className="h-5 w-5 mr-2" /> Unlock for {formatPrice(product!.price)}
                </Button>
              )}

            </div>
          </div>
        </div>

        {/* Description / Who Is This For tabs — always show */}
        <div className="mt-10">
          <div className="flex gap-0 border-b border-border">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-5 py-3 text-sm font-semibold transition-colors relative ${
                activeTab === "description"
                  ? "text-midnight"
                  : "text-stone-ui hover:text-midnight"
              }`}
            >
              Description
              {activeTab === "description" && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-deep-purple rounded-t" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("who_is_this_for")}
              className={`px-5 py-3 text-sm font-semibold transition-colors relative ${
                activeTab === "who_is_this_for"
                  ? "text-midnight"
                  : "text-stone-ui hover:text-midnight"
              }`}
            >
              Who Is This For
              {activeTab === "who_is_this_for" && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-deep-purple rounded-t" />
              )}
            </button>
          </div>

          <div className="py-6">
            {activeTab === "description" && (
              <p className="text-foreground/80 leading-relaxed text-base whitespace-pre-line">
                {resource.long_description || resource.description || "No description available."}
              </p>
            )}
            {activeTab === "who_is_this_for" && (
              <ul className="space-y-3">
                {resource.great_for && resource.great_for.length > 0 ? (
                  resource.great_for.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground/80 text-base">
                      <Check className="h-5 w-5 text-deep-purple flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-foreground/80 text-base">Information coming soon.</li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Share + Divider */}
        <SocialShareButtons resourceId={resource.id} resourceTitle={resource.title} userId={user?.id} />
        <hr className="border-border my-12" />

        {/* You May Also Like */}
        {suggestedResources.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-midnight mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedResources.map((r) => {
                const rProduct = priceMap[r.id];
                const rPrice = rProduct?.price ?? null;
                const rCurrency = rProduct?.currency ?? "CAD";
                const rPurchased = purchasedResourceIds.has(r.id);

                return (
                  <ResourceCard
                    key={r.id}
                    resource={r}
                    onView={handleView}
                    onDownload={(res) => handleDownload(res)}
                    onUnlock={(res) => {
                      setResource(res);
                      setShowPurchase(true);
                    }}
                    price={rPrice}
                    currency={rCurrency}
                    isPurchased={rPurchased}
                    userId={user?.id}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      <PurchaseModal
        resource={resource}
        product={product ?? null}
        open={showPurchase}
        onClose={() => setShowPurchase(false)}
        onPurchased={refetchPurchases}
        userId={user?.id}
      />
    </HubLayout>
  );
};

export default ResourceDetail;
