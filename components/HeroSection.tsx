"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Title Fade In
      if (heroTitleRef.current) {
        gsap.to(heroTitleRef.current, {
          opacity: 1,
          duration: 1.2,
          delay: 1.2,
          ease: "power2.out",
        });
      }

      const texts = gsap.utils.toArray(".hero-text-block");
      texts.forEach((text: any) => {
        gsap.fromTo(
          text,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            scrollTrigger: {
              trigger: text,
              start: "top 80%",
              end: "top 60%", // Reaches full opacity quickly
              toggleActions: "play reverse play reverse",
              scrub: 1,
            },
          },
        );
      });

      // Scroll indicator fade out
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          opacity: 0,
          scrollTrigger: {
            trigger: containerRef.current, // Start when container hits top
            start: "top top",
            end: "+=500", // Fade out after 500px of scrolling (approx 50% screen)
            scrub: true,
          },
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    // Height is 500vh to ensure we have enough scroll space for the frame animation (defined in ScrollCanvas as 400vh scroll)
    <div ref={containerRef} className="relative w-full h-[500vh] z-10">
      {/* Main Title Screen - Scrolls up naturally */}
      <div
        ref={heroTitleRef}
        className="absolute top-0 left-0 w-full h-[100dvh] flex flex-col items-center justify-center pointer-events-none opacity-0"
      >
        <h1 className="text-5xl md:text-8xl lg:text-[12rem] font-display font-bold text-white tracking-tighter uppercase mix-blend-difference">
          McLaren
        </h1>
        <p className="text-mclaren-orange text-sm md:text-2xl lg:text-3xl tracking-[0.6em] mt-4 uppercase mix-blend-difference font-light">
          Unparalleled Elegance
        </p>
      </div>

      {/* Text 1: Appears early */}
      <div className="hero-text-block absolute top-[35%] w-full flex justify-center pointer-events-none">
        <div className="text-center mix-blend-difference px-4">
          <h2 className="text-4xl md:text-7xl lg:text-9xl font-display font-bold text-white tracking-tighter uppercase">
            Aerodynamics
          </h2>
          <p className="text-mclaren-orange text-sm md:text-lg lg:text-xl tracking-[0.5em] mt-2 uppercase">
            Sculpted by Air
          </p>
        </div>
      </div>

      {/* Text 2: Appears middle */}
      <div className="hero-text-block absolute top-[65%] w-full flex justify-center pointer-events-none">
        <div className="text-center mix-blend-difference px-4">
          <h2 className="text-4xl md:text-7xl lg:text-9xl font-display font-bold text-white tracking-tighter uppercase">
            Precision
          </h2>
          <p className="text-mclaren-orange text-sm md:text-lg lg:text-xl tracking-[0.5em] mt-2 uppercase">
            Engineer the impossible
          </p>
        </div>
      </div>

      {/* Text 3: Appears late */}
      <div className="hero-text-block absolute top-[95%] w-full flex justify-center pointer-events-none">
        <div className="text-center mix-blend-difference px-4">
          <h2 className="text-4xl md:text-7xl lg:text-9xl font-display font-bold text-white tracking-tighter uppercase">
            Pure Power
          </h2>
          <p className="text-mclaren-orange text-sm md:text-lg lg:text-xl tracking-[0.5em] mt-2 uppercase">
            Unleashed
          </p>
        </div>
      </div>

      {/* Scroll indicator with ref */}
      <div
        ref={scrollIndicatorRef}
        className="fixed left-0 right-0 flex justify-center animate-pulse pointer-events-none"
        style={{ bottom: "2rem", zIndex: 50 }}
      >
        <span className="text-white/50 text-xs tracking-widest uppercase">
          Scroll to Explore
        </span>
      </div>
    </div>
  );
}
