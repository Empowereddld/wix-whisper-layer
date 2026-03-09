import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminResources = (filters?: {
  search?: string;
  audience?: string;
  type?: string;
  status?: string;
}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin-resources", filters],
    queryFn: async () => {
      let q = supabase.from("resources").select("*").order("created_at", { ascending: false });

      if (filters?.search) {
        q = q.ilike("title", `%${filters.search}%`);
      }
      if (filters?.audience) {
        q = q.contains("roles", [filters.audience]);
      }
      if (filters?.type) {
        q = q.eq("resource_type", filters.type as any);
      }
      if (filters?.status === "published") {
        q = q.eq("is_published", true);
      } else if (filters?.status === "draft") {
        q = q.eq("is_published", false);
      }

      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase
        .from("resources")
        .update({ is_published })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-resources"] }),
  });

  const deleteResource = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("resources").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-resources"] }),
  });

  const saveResource = useMutation({
    mutationFn: async (resource: {
      id?: string;
      title: string;
      description?: string;
      roles: string[];
      resource_type: string;
      thumbnail_url?: string;
      file_url?: string;
      is_published: boolean;
    }) => {
      if (resource.id) {
        const { error } = await supabase
          .from("resources")
          .update({
            title: resource.title,
            description: resource.description,
            roles: resource.roles,
            resource_type: resource.resource_type as any,
            thumbnail_url: resource.thumbnail_url,
            file_url: resource.file_url,
            is_published: resource.is_published,
          })
          .eq("id", resource.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("resources").insert({
          title: resource.title,
          description: resource.description,
          roles: resource.roles,
          resource_type: resource.resource_type as any,
          thumbnail_url: resource.thumbnail_url,
          file_url: resource.file_url,
          is_published: resource.is_published,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-resources"] }),
  });

  return { ...query, togglePublish, deleteResource, saveResource };
};
