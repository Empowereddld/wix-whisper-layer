export function resourceFilename(title: string | undefined, mime: string, url: string) {
  const type = mime.split(";")[0].toLowerCase();
  const extension = ({ "image/png": "png", "application/pdf": "pdf", "image/jpeg": "jpg", "image/webp": "webp" } as Record<string, string>)[type]
    || url.split(/[?#]/)[0].match(/\.([a-z0-9]{2,5})$/i)?.[1]?.toLowerCase()
    || "bin";
  const name = (title || "Empowered DLD Resource").replace(/\.[a-z0-9]{2,5}$/i, "").replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-").trim().slice(0, 120);
  return `${name || "Empowered DLD Resource"}.${extension}`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export async function deliverResourceFile(blob: Blob, filename: string) {
  const file = new File([blob], filename, { type: blob.type });
  if (matchMedia("(pointer: coarse)").matches && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename });
      return;
    } catch (error) {
      if ((error as DOMException).name === "AbortError") return;
    }
  }
  downloadBlob(blob, filename);
}