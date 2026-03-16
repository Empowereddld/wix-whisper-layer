import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useResourceViews(userId?: string) {
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("user_resource_views")
        .select("resource_id")
        .eq("user_id", userId);
      if (data) {
        setViewedIds(new Set(data.map((r) => r.resource_id)));
      }
    };
    fetch();
  }, [userId]);

  const markViewed = useCallback(
    async (resourceId: string) => {
      if (!userId || viewedIds.has(resourceId)) return;
      setViewedIds((prev) => new Set(prev).add(resourceId));
      await supabase
        .from("user_resource_views")
        .upsert({ user_id: userId, resource_id: resourceId }, { onConflict: "user_id,resource_id" });
    },
    [userId, viewedIds]
  );

  return { viewedIds, markViewed };
}
