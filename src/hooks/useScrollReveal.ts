import { useEffect, useRef, useState } from "react";

export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  // Start visible to prevent SSR/hydration flash of invisible content
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If element is already in viewport, keep visible
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setIsVisible(true);
      return;
    }

    // Otherwise, hide and animate on scroll
    setIsVisible(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
