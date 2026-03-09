import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface Props {
  userId?: string;
  totalResources: number;
  onDiscoverMore: () => void;
}

const ProgressTracker = ({ userId, totalResources, onDiscoverMore }: Props) => {
  const [downloadedCount, setDownloadedCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("user_downloads")
      .select("resource_id", { count: "exact", head: false })
      .eq("user_id", userId)
      .then(({ data }) => {
        const unique = new Set(data?.map((d) => d.resource_id));
        setDownloadedCount(unique.size);
      });
  }, [userId]);

  if (totalResources === 0) return null;
  const pct = Math.round((downloadedCount / totalResources) * 100);

  return (
    <div className="bg-thistle/30 rounded-xl p-4 flex items-center gap-4 mb-6">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-midnight mb-1.5">
          You've accessed <span className="text-mauve font-bold">{downloadedCount}</span> of{" "}
          <span className="font-bold">{totalResources}</span> resources
        </p>
        <Progress value={pct} className="h-2 bg-thistle/60 [&>div]:bg-mauve" />
      </div>
      {downloadedCount < totalResources && (
        <button onClick={onDiscoverMore} className="text-sm font-medium text-mauve hover:underline whitespace-nowrap">
          Discover more →
        </button>
      )}
    </div>
  );
};

export default ProgressTracker;
