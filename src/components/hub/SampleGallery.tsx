import { useState } from "react";
import { cn } from "@/lib/utils";

interface SampleGalleryProps {
  thumbnailUrl: string | null;
  sampleImages: string[];
  title: string;
  fallbackIcon: React.ElementType;
}

const SampleGallery = ({ thumbnailUrl, sampleImages, title, fallbackIcon: Icon }: SampleGalleryProps) => {
  const allImages = [
    ...(thumbnailUrl ? [thumbnailUrl] : []),
    ...sampleImages,
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = allImages[activeIndex] || null;

  if (allImages.length === 0) {
    return (
      <div className="w-full min-h-[320px] max-h-[520px] rounded-xl bg-muted border border-border flex items-center justify-center">
        <Icon className="h-20 w-20 text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Main image — fixed 4:3 container so layout never shifts */}
      <div className="w-full aspect-video rounded-xl border border-border overflow-hidden bg-muted flex items-center justify-center">
        <img
          src={activeImage!}
          alt={`${title} — preview ${activeIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Thumbnail strip */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((url, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all",
                i === activeIndex
                  ? "border-deep-purple ring-1 ring-deep-purple/30"
                  : "border-border hover:border-deep-purple/40"
              )}
            >
              <img
                src={url}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SampleGallery;
