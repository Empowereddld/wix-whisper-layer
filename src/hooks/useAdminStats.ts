import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [usersRes, resourcesRes, downloadsRes] = await Promise.all([
        supabase.from("profiles").select("id, created_at, role"),
        supabase.from("resources").select("id, is_published, title, download_count"),
        supabase.from("user_downloads").select("id"),
      ]);

      const users = usersRes.data || [];
      const resources = resourcesRes.data || [];
      const downloads = downloadsRes.data || [];

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const newUsersThisWeek = users.filter(
        (u) => new Date(u.created_at) >= weekAgo
      ).length;

      const published = resources.filter((r) => r.is_published);
      const drafts = resources.filter((r) => !r.is_published);

      const topResource = [...resources].sort(
        (a, b) => (b.download_count || 0) - (a.download_count || 0)
      )[0];

      return {
        totalUsers: users.length,
        newUsersThisWeek,
        totalDownloads: downloads.length,
        totalPublished: published.length,
        totalDrafts: drafts.length,
        mostDownloaded: topResource
          ? { name: topResource.title, count: topResource.download_count || 0 }
          : null,
        recentUsers: users
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 10),
        topResources: [...resources]
          .sort((a, b) => (b.download_count || 0) - (a.download_count || 0))
          .slice(0, 5),
      };
    },
  });
};
