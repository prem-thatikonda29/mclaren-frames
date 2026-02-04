"use client";

import { useEffect } from "react";
import { useScroll } from "@/context/ScrollContext";

interface UseKeyboardNavOptions {
  enabled?: boolean;
}

export function useKeyboardNav({ enabled = true }: UseKeyboardNavOptions = {}) {
  const { scrollToSection, activeSection, imagesReady } = useScroll();

  useEffect(() => {
    if (!enabled || !imagesReady) return;

    const sections = ["hero", "history", "racing", "models"];
    const currentIndex = sections.indexOf(activeSection || "hero");

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if an input is focused
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Don't trigger if a modal is open (check for modal class)
      if (document.querySelector('[class*="modal"]')) {
        // Only allow Escape key for closing modals
        if (e.key === "Escape") {
          document.dispatchEvent(new CustomEvent("modalClose"));
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
        case " ":
        case "PageDown":
          e.preventDefault();
          if (currentIndex < sections.length - 1) {
            scrollToSection(sections[currentIndex + 1]);
          }
          break;

        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          if (currentIndex > 0) {
            scrollToSection(sections[currentIndex - 1]);
          }
          break;

        case "Home":
          e.preventDefault();
          scrollToSection(sections[0]);
          break;

        case "End":
          e.preventDefault();
          scrollToSection(sections[sections.length - 1]);
          break;

        case "Escape":
          // Close any open modal
          document.dispatchEvent(new CustomEvent("modalClose"));
          break;

        case "ArrowLeft":
        case "ArrowRight":
          // When in models section, dispatch custom event for car navigation
          if (activeSection === "models") {
            e.preventDefault();
            document.dispatchEvent(
              new CustomEvent("carNav", {
                detail: { direction: e.key === "ArrowLeft" ? "prev" : "next" },
              }),
            );
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, imagesReady, scrollToSection, activeSection]);
}