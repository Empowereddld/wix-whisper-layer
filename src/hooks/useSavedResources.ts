import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSavedResources(userId?: string) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const fetch = async () => {
      const { data } = await supabase
        .from("saved_resources")
        .select("resource_id")
        .eq("user_id", userId);
      if (data) setSavedIds(new Set(data.map((d) => d.resource_id)));
      setLoading(false);
    };
    fetch();
  }, [userId]);

  const toggle = useCallback(async (resourceId: string) => {
    if (!userId) return;
    const isSaved = savedIds.has(resourceId);
    if (isSaved) {
      setSavedIds((prev) => { const n = new Set(prev); n.delete(resourceId); return n; });
      await supabase.from("saved_resources").delete().eq("user_id", userId).eq("resource_id", resourceId);
    } else {
      setSavedIds((prev) => new Set(prev).add(resourceId));
      const { error } = await supabase
        .from("saved_resources")
        .insert({ user_id: userId, resource_id: resourceId });
      // 23505 = unique_violation: the row already exists (e.g. rapid double-tap).
      // Treat as a successful save instead of surfacing an error.
      if (error && (error as { code?: string }).code !== "23505") {
        // Roll back optimistic update on real errors.
        setSavedIds((prev) => { const n = new Set(prev); n.delete(resourceId); return n; });
        throw error;
      }
    }
  }, [userId, savedIds]);

  return { savedIds, toggle, loading };
}
