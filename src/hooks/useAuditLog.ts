import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useAuditLog = () => {
  return useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });
};

export const useLogAction = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (action: string) => {
      if (!user) return;
      await supabase.from("audit_logs").insert({
        admin_id: user.id,
        action,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["audit-logs"] }),
  });
};
