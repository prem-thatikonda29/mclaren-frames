"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useScroll } from "@/context/ScrollContext";
import { useLenis } from "@/context/LenisContext";

const sections = [
  { id: "hero", label: "Home" },
  { id: "history", label: "History" },
  { id: "racing", label: "Racing" },
  { id: "models", label: "Models" },
];

export default function Navbar() {
  const { activeSection, scrollToSection, scrollProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(true);
  const [isSolid, setIsSolid] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Handle scroll direction for show/hide using Lenis
  useEffect(() => {
    if (!lenis) return;

    const onScroll = (event: { scroll: number; limit: number }) => {
      const currentScrollY = event.scroll;

      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      // Solid background after ~100vh
      setIsSolid(currentScrollY > window.innerHeight * 0.5);

      setLastScrollY(currentScrollY);
    };

    lenis.on("scroll", onScroll);

    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [lenis, lastScrollY]);

  // Progress bar animation via ScrollTrigger
  useEffect(() => {
    if (progressBarRef.current) {
      gsap.fromTo(
        progressBarRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    }
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
          isSolid ? "bg-carbon-black/80 backdrop-blur-md" : "bg-transparent"
        } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-20 py-4 flex items-center justify-between">
          {/* Logo */}
          <span className="font-display font-bold text-lg md:text-xl tracking-wider text-mclaren-orange">
            MCLAREN
          </span>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`relative text-sm font-medium tracking-widest uppercase transition-colors duration-300 ${
                  activeSection === section.id
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {section.label}
                {/* Active underline */}
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-mclaren-orange transition-all duration-300 ${
                    activeSection === section.id ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div
          ref={progressBarRef}
          className="h-0.5 bg-mclaren-orange origin-left transform-gpu"
        />
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[61] bg-carbon-black/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => {
              scrollToSection(section.id);
              setIsMobileMenuOpen(false);
            }}
            className={`text-2xl font-display font-bold tracking-wider uppercase transition-colors duration-300 ${
              activeSection === section.id
                ? "text-mclaren-orange"
                : "text-white hover:text-mclaren-orange"
            }`}
          >
            {section.label}
          </button>
        ))}
        <button
          className="absolute top-6 right-6 text-white p-2"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </>
  );
}