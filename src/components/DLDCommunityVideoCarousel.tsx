import { useState, useRef, useEffect, useCallback } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "motion/react";

const PLAYLIST_ID = "PLzfiOYFA1If6zPxIqiq0Wv77CJX0Vs2Dh";

const videos = [
  { id: "h6GTa--EOgM" },
  { id: "SjE9lRZIgQI" },
  { id: "1QPjjuEPB1A" },
  { id: "4p4QsV84fFI" },
  { id: "5bJU-7Vk-r4" },
  { id: "O-Ar-PlkbAY" },
  { id: "QEuClRNJQho" },
  { id: "bxvR1r7ROBM" },
  { id: "lcCL31XElkw" },
  { id: "lchd80StwIk" },
  { id: "m1aIC3Jg2l8" },
  { id: "nkn98KIsP7w" },
  { id: "ppZa6eoKF3c" },
];

const AUTO_SCROLL_SPEED = 0.5; // pixels per frame

const DLDCommunityVideoCarousel = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const isPaused = useRef(false);

  const startAutoScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const step = () => {
      if (!isPaused.current && el) {
        el.scrollLeft += AUTO_SCROLL_SPEED;
        // Loop back when reaching the end
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          el.scrollLeft = 0;
        }
      }
      animationRef.current = requestAnimationFrame(step);
    };
    animationRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    startAutoScroll();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [startAutoScroll]);

  const handleMouseEnter = () => { isPaused.current = true; };
  const handleMouseLeave = () => { isPaused.current = false; };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.6;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-16 md:py-24 bg-[hsl(258,60%,96%)]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl lg:text-[46px] font-black tracking-tight text-foreground leading-tight">
            One thing I want the world to know about DLD...
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground font-medium">
            Hear from our community
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Arrows */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-background/90 border border-foreground/10 shadow-md flex items-center justify-center hover:bg-background transition-colors"
            aria-label="Previous videos"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-background/90 border border-foreground/10 shadow-md flex items-center justify-center hover:bg-background transition-colors"
            aria-label="Next videos"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>

          {/* Scroll container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
            {videos.map((video, i) => (
              <motion.button
                key={video.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true }}
                onClick={() => setSelectedVideo(video.id)}
                className="flex-shrink-0 w-[180px] md:w-[200px] group cursor-pointer"
              >
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-lg border border-foreground/10">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/0.jpg`}
                    alt="Community video about DLD"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="h-5 w-5 text-foreground ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-[400px] p-0 bg-black border-none rounded-2xl overflow-hidden">
          {selectedVideo && (
            <div className="aspect-[9/16] w-full">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&list=${PLAYLIST_ID}`}
                title="DLD Community Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default DLDCommunityVideoCarousel;
