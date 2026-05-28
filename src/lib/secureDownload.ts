import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Securely download a resource. For private resources, calls the
 * generate-download-url edge function to get a signed URL. For public
 * resources, opens the file_url directly.
 *
 * Accepts either a boolean (legacy: treat as isPrivate) or a resource-like
 * object with { file_url, is_private } for forward compatibility.
 */
export const secureDownload = async (
  resourceId: string,
  fileUrlOrResource: string | null | { file_url: string | null; is_private?: boolean | null },
  isPrivateArg?: boolean,
) => {
  let fileUrl: string | null = null;
  let isPrivate = false;

  if (fileUrlOrResource !== null && typeof fileUrlOrResource === "object") {
    fileUrl = fileUrlOrResource.file_url ?? null;
    isPrivate = !!fileUrlOrResource.is_private;
  } else {
    fileUrl = (fileUrlOrResource as string | null) ?? null;
    // Legacy heuristic: paths beginning with resources-private/ are private.
    isPrivate =
      isPrivateArg === true ||
      (typeof fileUrl === "string" && fileUrl.startsWith("resources-private/"));
  }

  if (!isPrivate && !fileUrl) {
    toast.info("This resource file will be available soon.");
    return;
  }

  if (isPrivate) {
    try {
      const { data, error } = await supabase.functions.invoke("generate-download-url", {
        body: { resource_id: resourceId },
      });

      if (error || !data?.url) {
        const msg = data?.error || "Unable to generate download link.";
        if (msg === "Purchase required") {
          toast.error("You need to purchase this resource first.");
        } else {
          toast.error(msg);
        }
        return;
      }

      window.open(data.url, "_blank");
    } catch {
      toast.error("Download failed. Please try again.");
    }
    return;
  }

  // Public URL — open directly
  window.open(fileUrl!, "_blank");
};
