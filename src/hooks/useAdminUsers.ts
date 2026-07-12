import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminUsers = (filters?: { search?: string; role?: string }) => {
  return useQuery({
    queryKey: ["admin-users", filters],
    queryFn: async () => {
      let q = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.role) {
        q = q.eq("role", filters.role as any);
      }
      if (filters?.search) {
        q = q.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`);
      }

      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
};

export const useAdminUserCount = () => {
  return useQuery({
    queryKey: ["admin-user-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });
};

export const useUserDownloads = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["user-downloads", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_downloads")
        .select("*, resources(title)")
        .eq("user_id", userId!)
        .order("downloaded_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useUserNotes = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["user-notes", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_notes")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};
