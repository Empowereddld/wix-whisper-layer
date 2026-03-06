import { useEffect, useRef, useState } from "react";

interface UseScrollFadeInOptions {
  threshold?: number;
  delay?: number;
}

export function useScrollFadeIn({ threshold = 0.15, delay = 0 }: UseScrollFadeInOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, delay]);

  const className = isVisible ? "fade-in-section is-visible" : "fade-in-section";

  return { ref, className };
}
