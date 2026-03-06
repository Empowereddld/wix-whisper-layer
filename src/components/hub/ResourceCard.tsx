import { Download, Eye, FileText, Image, CheckSquare, BookOpen, Package, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const typeLabels: Record<string, string> = {
  poster: "Poster",
  guide: "Guide",
  checklist: "Checklist",
  handout: "Handout",
  activity: "Activity",
  bundle: "Bundle",
  infographic: "Infographic",
};

const roleLabels: Record<string, string> = {
  parent: "Parents",
  slp: "SLPs",
  educator: "Educators",
  school_leader: "School Leaders",
};

interface ResourceCardProps {
  resource: Resource;
  onView: (resource: Resource) => void;
  onDownload: (resource: Resource) => void;
  viewMode?: "grid" | "list";
}

const isNew = (createdAt: string) => {
  const diff = Date.now() - new Date(createdAt).getTime();
  return diff < 30 * 24 * 60 * 60 * 1000;
};

const ResourceCard = ({ resource, onView, onDownload, viewMode = "grid" }: ResourceCardProps) => {
  const Icon = typeIcons[resource.resource_type] || FileText;

  if (viewMode === "list") {
    return (
      <div className="bg-card rounded-xl border border-thistle/60 p-4 premium-card flex items-center gap-4">
        <div className="h-16 w-16 rounded-lg bg-thistle/40 flex items-center justify-center flex-shrink-0">
          <Icon className="h-7 w-7 text-hub-lavender" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-midnight truncate">{resource.title}</h3>
            {isNew(resource.created_at) && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-mauve text-white font-medium flex-shrink-0">New</span>
            )}
          </div>
          <p className="text-sm text-stone-ui line-clamp-1">{resource.description}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button size="sm" variant="outline" onClick={() => onView(resource)} className="border-thistle hover:bg-thistle/30">
            <Eye className="h-4 w-4 mr-1" /> View
          </Button>
          <Button size="sm" onClick={() => onDownload(resource)} className="bg-midnight text-midnight-foreground hover:bg-midnight/90">
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-thistle/60 premium-card flex flex-col h-full">
      {/* Thumbnail placeholder */}
      <div className="h-40 rounded-t-xl bg-thistle/30 flex items-center justify-center relative">
        <Icon className="h-12 w-12 text-hub-lavender/60" />
        {isNew(resource.created_at) && (
          <span className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full bg-mauve text-white font-medium">New</span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-midnight mb-1.5 line-clamp-2 leading-snug">{resource.title}</h3>
        <p className="text-sm text-stone-ui mb-3 line-clamp-2 flex-1">{resource.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {resource.roles?.map((role) => (
            <span key={role} className="text-xs px-2 py-0.5 rounded-full bg-mauve/15 text-mauve font-medium">
              {roleLabels[role] || role}
            </span>
          ))}
          <span className="text-xs px-2 py-0.5 rounded-full bg-hub-lavender/15 text-hub-lavender font-medium">
            {typeLabels[resource.resource_type]}
          </span>
          {resource.settings?.slice(0, 1).map((s) => (
            <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-thistle/50 text-midnight/70 font-medium">
              {s}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-thistle hover:bg-thistle/30 hover:border-hub-lavender transition-all"
            onClick={() => onView(resource)}
          >
            <Eye className="h-4 w-4 mr-1.5" /> View
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-midnight text-midnight-foreground hover:bg-midnight/90"
            onClick={() => onDownload(resource)}
          >
            <Download className="h-4 w-4 mr-1.5" /> Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
