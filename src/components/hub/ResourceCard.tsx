import { Download, Eye, FileText, Image, CheckSquare, BookOpen, Package, BarChart3, Lock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SharePopover from "./SharePopover";
import type { Resource } from "@/hooks/useResources";

const typeIcons: Record<string, React.ElementType> = {
  poster: Image,
  guide: BookOpen,
  checklist: CheckSquare,
  handout: FileText,
  activity: FileText,
  bundle: Package,
  infographic: BarChart3,
};

const audienceLabels: Record<string, string> = {
  parent: "Parents",
  slp: "Therapists",
  educator: "Educators",
  school_leader: "School Leaders",
};

interface ResourceCardProps {
  resource: Resource;
  onView: (resource: Resource) => void;
  onDownload: (resource: Resource) => void;
  onUnlock?: (resource: Resource) => void;
  viewMode?: "grid" | "list";
  price?: number | null;
  currency?: string;
  isPurchased?: boolean;
  isSaved?: boolean;
  onToggleSave?: (resource: Resource) => void;
  userId?: string;
  isNew?: boolean;
}

const formatPrice = (cents: number, currency: string = "CAD") => {
  const amount = (cents / 100).toFixed(2);
  const sym = currency === "CAD" ? "CA$" : "$";
  return `${sym}${amount}`;
};

const ResourceCard = ({
  resource,
  onView,
  onDownload,
  onUnlock,
  viewMode = "grid",
  price,
  currency = "CAD",
  isPurchased = false,
  isSaved = false,
  onToggleSave,
  userId,
  isNew = false,
}: ResourceCardProps) => {
  const Icon = typeIcons[resource.resource_type] || FileText;
  const navigate = useNavigate();
  const isPaid = price != null && price > 0;
  const isUnlocked = !isPaid || isPurchased;

  // Show max 2 audience tags
  const audienceTags = (resource.roles ?? [])
    .filter((r) => audienceLabels[r])
    .slice(0, 2)
    .map((r) => audienceLabels[r]);

  if (viewMode === "list") {
    return (
      <div className="bg-card rounded-xl border border-thistle/60 p-4 premium-card flex items-center gap-4">
        <div className="h-16 w-16 rounded-lg bg-thistle/40 flex items-center justify-center flex-shrink-0">
          <Icon className="h-7 w-7 text-hub-lavender" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-midnight truncate">{resource.title}</h3>
            {!isPaid && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium flex-shrink-0">Free</span>
            )}
            {isPaid && !isPurchased && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-mauve/15 text-mauve font-semibold flex-shrink-0">
                {formatPrice(price, currency)}
              </span>
            )}
            {isPaid && isPurchased && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium flex-shrink-0">Purchased</span>
            )}
            {isNew && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-mauve text-white font-medium flex-shrink-0">New</span>
            )}
          </div>
          <p className="text-sm text-stone-ui line-clamp-1">{resource.description}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0 items-center">
          {onToggleSave && (
            <button onClick={() => onToggleSave(resource)} className="p-1.5 rounded-full hover:bg-thistle/40 transition-colors" aria-label="Save">
              <Heart className={`h-4 w-4 ${isSaved ? "fill-mauve text-mauve" : "text-stone-ui"}`} />
            </button>
          )}
          <SharePopover resourceId={resource.id} resourceTitle={resource.title} userId={userId} />
          <Button size="sm" variant="outline" onClick={() => { onView(resource); navigate(`/hub/resource/${resource.id}`); }} className="border-thistle hover:bg-thistle/30">
            <Eye className="h-4 w-4 mr-1" /> Preview
          </Button>
          {isUnlocked ? (
            <Button size="sm" onClick={() => onDownload(resource)} className="bg-midnight text-midnight-foreground hover:bg-midnight/90">
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          ) : (
            <Button size="sm" onClick={() => onUnlock?.(resource)} className="bg-midnight text-midnight-foreground hover:bg-midnight/90">
              <Lock className="h-4 w-4 mr-1" /> Unlock
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-thistle/60 premium-card flex flex-col h-full">
      {/* Thumbnail */}
      <div className="h-40 rounded-t-xl bg-thistle/30 flex items-center justify-center relative">
        <Icon className="h-12 w-12 text-hub-lavender/60" />
        {/* Save heart */}
        {onToggleSave && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSave(resource); }}
            className="absolute top-3 left-3 p-1.5 rounded-full bg-white/80 hover:bg-white transition-all shadow-sm z-10"
            aria-label={isSaved ? "Unsave" : "Save"}
          >
            <Heart className={`h-3.5 w-3.5 ${isSaved ? "fill-mauve text-mauve" : "text-midnight/40"}`} />
          </button>
        )}
        {/* Share */}
        <div className="absolute bottom-3 right-3 z-10">
          <SharePopover resourceId={resource.id} resourceTitle={resource.title} userId={userId} />
        </div>
        {/* Price / Free badge */}
        {isPaid && !isPurchased ? (
          <span className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full bg-mauve text-white font-semibold shadow-sm">
            {formatPrice(price, currency)}
          </span>
        ) : isPaid && isPurchased ? (
          <span className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full bg-emerald-500 text-white font-medium">
            Purchased
          </span>
        ) : (
          <span className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
            Free
          </span>
        )}
        {isNew && (
          <span className="absolute top-10 left-3 text-xs px-2.5 py-1 rounded-full bg-mauve text-white font-medium">New</span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-midnight mb-1.5 line-clamp-2 leading-snug">{resource.title}</h3>
        <p className="text-sm text-stone-ui mb-3 line-clamp-3">{resource.description}</p>

        {/* Audience Tags — max 2 */}
        {audienceTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {audienceTags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-mauve/15 text-mauve font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-thistle hover:bg-thistle/30 hover:border-hub-lavender transition-all"
            onClick={() => { onView(resource); navigate(`/hub/resource/${resource.id}`); }}
          >
            <Eye className="h-4 w-4 mr-1.5" /> Preview
          </Button>
          {isUnlocked ? (
            <Button
              size="sm"
              className="flex-1 bg-midnight text-midnight-foreground hover:bg-midnight/90"
              onClick={() => onDownload(resource)}
            >
              <Download className="h-4 w-4 mr-1.5" /> Download
            </Button>
          ) : (
            <Button
              size="sm"
              className="flex-1 bg-midnight text-midnight-foreground hover:bg-midnight/90"
              onClick={() => onUnlock?.(resource)}
            >
              <Lock className="h-4 w-4 mr-1.5" /> Unlock
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
