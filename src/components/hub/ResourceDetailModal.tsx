import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText, Image, CheckSquare, BookOpen, Package, BarChart3, Calendar, Globe, Users, MapPin, Layers } from "lucide-react";
import type { Resource } from "@/hooks/useResources";
import { format } from "date-fns";

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
  slp: "SLPs & Therapists",
  educator: "Educators",
  school_leader: "School Leaders",
};

interface ResourceDetailModalProps {
  resource: Resource | null;
  open: boolean;
  onClose: () => void;
  onDownload: (resource: Resource) => void;
}

const ResourceDetailModal = ({ resource, open, onClose, onDownload }: ResourceDetailModalProps) => {
  if (!resource) return null;
  const Icon = typeIcons[resource.resource_type] || FileText;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-midnight leading-snug pr-6">
            {resource.title}
          </DialogTitle>
        </DialogHeader>

        {/* Preview */}
        <div className="aspect-video rounded-xl bg-thistle/30 flex items-center justify-center mb-2 overflow-hidden">
          {resource.thumbnail_url ? (
            <img src={resource.thumbnail_url} alt={resource.title} className="w-full h-full object-cover" />
          ) : (
            <Icon className="h-16 w-16 text-hub-lavender/50" />
          )}
        </div>

        {/* Description */}
        <p className="text-foreground/80 leading-relaxed">{resource.description}</p>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <MetaItem icon={Users} label="Audience" value={resource.roles?.map((r) => roleLabels[r] || r).join(", ") || "—"} />
          <MetaItem icon={MapPin} label="Setting" value={resource.settings?.join(", ") || "—"} />
          <MetaItem icon={Layers} label="Age Range" value={resource.age_ranges?.join(", ") || "—"} />
          <MetaItem icon={FileText} label="Type" value={typeLabels[resource.resource_type]} />
          <MetaItem icon={Globe} label="Language" value={resource.languages?.join(", ") || "English"} />
          <MetaItem icon={Calendar} label="Added" value={format(new Date(resource.created_at), "MMM d, yyyy")} />
        </div>

        {/* Download */}
        <Button
          size="lg"
          className="w-full mt-4 bg-midnight text-midnight-foreground hover:bg-midnight/90 h-12 text-base"
          onClick={() => onDownload(resource)}
        >
          <Download className="h-5 w-5 mr-2" /> Download Resource
        </Button>
      </DialogContent>
    </Dialog>
  );
};

const MetaItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-thistle/20">
    <Icon className="h-4 w-4 text-hub-lavender mt-0.5 flex-shrink-0" />
    <div>
      <p className="text-xs text-stone-ui font-medium">{label}</p>
      <p className="text-sm text-midnight">{value}</p>
    </div>
  </div>
);

export default ResourceDetailModal;
