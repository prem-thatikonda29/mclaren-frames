"use client";

import { createContext, useContext, useRef, useState, useEffect, useCallback, type ReactNode } from "react";
import { gsap, ScrollToPlugin } from "@/lib/gsap";
import { useLenis } from "@/context/LenisContext";

interface ScrollContextType {
  scrollProgress: number;
  activeSection: string | null;
  sections: Map<string, HTMLElement>;
  scrollToSection: (sectionId: string) => void;
  registerSection: (id: string, element: HTMLElement) => void;
  unregisterSection: (id: string) => void;
  frameLoadProgress: number;
  setFrameLoadProgress: (progress: number) => void;
  imagesReady: boolean;
  setImagesReady: (ready: boolean) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export function ScrollProvider({ children }: { children: ReactNode }) {
  const sectionsRef = useRef<Map<string, HTMLElement>>(new Map());
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const scrollYRef = useRef(0);
  const [frameLoadProgress, setFrameLoadProgress] = useState(0);
  const [imagesReady, setImagesReady] = useState(false);
  const lenis = useLenis();

  // Calculate scroll progress (0-1)
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll listener using Lenis
  useEffect(() => {
    if (!lenis) return;

    const updateScroll = (event: { scroll: number; limit: number }) => {
      scrollYRef.current = event.scroll;
      const progress = event.limit > 0 ? event.scroll / event.limit : 0;
      setScrollProgress(progress);
    };

    lenis.on("scroll", updateScroll);

    return () => {
      lenis.off("scroll", updateScroll);
    };
  }, [lenis]);

  // Intersection Observer for active section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Find the section with the largest intersection ratio
          const mostVisible = visibleEntries.reduce((a, b) =>
            a.intersectionRatio > b.intersectionRatio ? a : b,
          );
          const sectionId = Array.from(sectionsRef.current.entries()).find(
            ([_, el]) => el === mostVisible.target,
          )?.[0];
          if (sectionId) setActiveSection(sectionId);
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: "-10% 0px -10% 0px",
      },
    );

    // Observe all registered sections
    sectionsRef.current.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [sectionsRef]); // Re-run when sections change

  const scrollToSection = useCallback(
    (sectionId: string) => {
      const element = sectionsRef.current.get(sectionId);
      if (element && lenis) {
        const targetPosition = element.getBoundingClientRect().top + lenis.scroll;
        lenis.scrollTo(targetPosition, {
          duration: 1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    },
    [lenis]
  );

  const registerSection = useCallback((id: string, element: HTMLElement) => {
    sectionsRef.current.set(id, element);
  }, []);

  const unregisterSection = useCallback((id: string) => {
    sectionsRef.current.delete(id);
  }, []);

  return (
    <ScrollContext.Provider
      value={{
        scrollProgress,
        activeSection,
        sections: sectionsRef.current,
        scrollToSection,
        registerSection,
        unregisterSection,
        frameLoadProgress,
        setFrameLoadProgress,
        imagesReady,
        setImagesReady,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return context;
}