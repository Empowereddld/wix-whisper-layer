import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Securely download a resource. For paid resources stored in the private bucket,
 * this calls the generate-download-url edge function to get a signed URL.
 * For free resources with public URLs, it opens the URL directly.
 */
export const secureDownload = async (resourceId: string, fileUrl: string | null) => {
  if (!fileUrl) {
    toast.info("This resource file will be available soon.");
    return;
  }

  // If the file is in the private bucket, call the edge function
  if (fileUrl.startsWith("resources-private/")) {
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
  } else {
    // Public URL — open directly
    window.open(fileUrl, "_blank");
  }
};
