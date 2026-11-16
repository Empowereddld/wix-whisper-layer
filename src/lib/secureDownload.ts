import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { deliverResourceFile, resourceFilename } from "./resourceFile";

/**
 * Securely download a resource. For private resources, calls the
 * generate-download-url edge function to get a signed URL. For public
 * resources, fetches the existing file URL. Both paths deliver the original
 * bytes as a named file, never a preview tab. Touch devices get a ready-to-save
 * action so Safari retains user activation for its download/share sheet.
 *
 * Accepts either a boolean (legacy: treat as isPrivate) or a resource-like
 * object with { file_url, is_private } for forward compatibility.
 */
export const secureDownload = async (
  resourceId: string,
  fileUrlOrResource: string | null | { file_url: string | null; is_private?: boolean | null; title?: string; languages?: string[] | null },
  isPrivateArg?: boolean,
) => {
  let fileUrl: string | null = null;
  let isPrivate = false;
  let title: string | undefined;

  if (fileUrlOrResource !== null && typeof fileUrlOrResource === "object") {
    fileUrl = fileUrlOrResource.file_url ?? null;
    isPrivate = !!fileUrlOrResource.is_private;
    title = [fileUrlOrResource.title, fileUrlOrResource.languages?.join(", ")].filter(Boolean).join(" - ") || undefined;
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

  const progress = toast.loading("Preparing your download...");
  try {
    if (isPrivate) {
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

      fileUrl = data.url;
    }
    if (!fileUrl) throw new Error("File unavailable");
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("File unavailable");
    const blob = await response.blob();
    if (!blob.size || blob.type.includes("text/html")) throw new Error("File unavailable");
    const filename = resourceFilename(title, blob.type, fileUrl);
    if (matchMedia("(pointer: coarse)").matches) {
      toast.success("Your file is ready.", {
        description: filename,
        duration: Infinity,
        action: { label: "Save file", onClick: () => { void deliverResourceFile(blob, filename); } },
      });
    } else {
      await deliverResourceFile(blob, filename);
    }
  } catch {
    toast.error("Download failed. Please try again.");
  } finally {
    toast.dismiss(progress);
  }
};
