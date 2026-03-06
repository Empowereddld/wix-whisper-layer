import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import HubLayout from "@/components/hub/HubLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Download,
  ArrowLeft,
  FileText,
  Image,
  CheckSquare,
  BookOpen,
  Package,
  BarChart3,
  Calendar,
  Globe,
  Users,
  MapPin,
  Layers,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
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
  slp: "SLPs & Therapists",
  educator: "Educators",
  school_leader: "School Leaders",
};

const ResourceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("resources")
        .select("*")
        .eq("id", id)
        .single();
      if (data) setResource(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleDownload = useCallback(async () => {
    if (!user || !resource) return;
    await supabase.from("user_downloads").insert({
      user_id: user.id,
      resource_id: resource.id,
    });
    await supabase.rpc("increment_download_count", { resource_id: resource.id });

    if (resource.file_url) {
      window.open(resource.file_url, "_blank");
    } else {
      toast.info("This resource file will be available soon.");
    }
  }, [user, resource]);

  if (loading) {
    return (
      <HubLayout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64 rounded-xl mb-6" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </HubLayout>
    );
  }

  if (!resource) {
    return (
      <HubLayout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-midnight mb-4">Resource Not Found</h1>
          <p className="text-stone-ui mb-6">The resource you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/hub")} className="bg-midnight text-midnight-foreground hover:bg-midnight/90">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </div>
      </HubLayout>
    );
  }

  const Icon = typeIcons[resource.resource_type] || FileText;

  return (
    <HubLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <button
          onClick={() => navigate("/hub")}
          className="flex items-center gap-2 text-stone-ui hover:text-midnight transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Resources
        </button>

        {/* Hero preview */}
        <div className="h-64 md:h-80 rounded-2xl bg-thistle/30 flex items-center justify-center mb-8">
          <Icon className="h-20 w-20 text-hub-lavender/50" />
        </div>

        {/* Title + download */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-midnight leading-snug mb-2">
              {resource.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {resource.roles?.map((role) => (
                <span key={role} className="text-xs px-2.5 py-1 rounded-full bg-mauve/15 text-mauve font-medium">
                  {roleLabels[role] || role}
                </span>
              ))}
              <span className="text-xs px-2.5 py-1 rounded-full bg-hub-lavender/15 text-hub-lavender font-medium">
                {typeLabels[resource.resource_type]}
              </span>
            </div>
          </div>
          <Button
            size="lg"
            className="bg-midnight text-midnight-foreground hover:bg-midnight/90 h-12 px-8"
            onClick={handleDownload}
          >
            <Download className="h-5 w-5 mr-2" /> Download
          </Button>
        </div>

        {/* Description */}
        <p className="text-foreground/80 leading-relaxed text-lg mb-8">
          {resource.description}
        </p>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <MetaItem icon={Users} label="Audience" value={resource.roles?.map((r) => roleLabels[r] || r).join(", ") || "—"} />
          <MetaItem icon={MapPin} label="Setting" value={resource.settings?.join(", ") || "—"} />
          <MetaItem icon={Layers} label="Age Range" value={resource.age_ranges?.join(", ") || "—"} />
          <MetaItem icon={FileText} label="Type" value={typeLabels[resource.resource_type]} />
          <MetaItem icon={Globe} label="Language" value={resource.languages?.join(", ") || "English"} />
          <MetaItem icon={Calendar} label="Added" value={format(new Date(resource.created_at), "MMM d, yyyy")} />
        </div>
      </div>
    </HubLayout>
  );
};

const MetaItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex items-start gap-2.5 p-4 rounded-xl bg-thistle/20">
    <Icon className="h-4 w-4 text-hub-lavender mt-0.5 flex-shrink-0" />
    <div>
      <p className="text-xs text-stone-ui font-medium">{label}</p>
      <p className="text-sm text-midnight font-medium">{value}</p>
    </div>
  </div>
);

export default ResourceDetail;
