/**
 * Animated number counter component
 * Smoothly counts up from 0 to target value with easing
 * Only animates when element is in viewport (IntersectionObserver)
 */

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number; // in milliseconds
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

// Easing function: ease-out cubic
const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

const AnimatedCounter = ({
  value,
  duration = 1500,
  prefix = "",
  suffix = "",
  decimals = 0,
}: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Format number with locale separators
  const formatNumber = (num: number): string => {
    const formatted = decimals > 0 ? num.toFixed(decimals) : Math.round(num).toString();
    return formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // Intersection Observer to trigger animation when element is in viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Apply easing function
            const easedProgress = easeOutCubic(progress);

            // Calculate current value
            const currentValue = value * easedProgress;
            setDisplayValue(currentValue);

            if (progress < 1) {
              animationRef.current = requestAnimationFrame(animate);
            }
          };

          animationRef.current = requestAnimationFrame(animate);
        }
      },
      {
        threshold: 0.5, // Trigger when 50% of element is visible
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration, hasAnimated]);

  return (
    <div ref={containerRef}>
      {prefix}
      {formatNumber(displayValue)}
      {suffix}
    </div>
  );
};

export default AnimatedCounter;
