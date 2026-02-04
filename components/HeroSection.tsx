"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useScroll } from "@/context/ScrollContext";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { registerSection, unregisterSection } = useScroll();
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const progressCircleRef = useRef<SVGCircleElement>(null);

  // Register section with scroll context
  useEffect(() => {
    if (containerRef.current) {
      registerSection("hero", containerRef.current);
    }
    return () => {
      if (containerRef.current) {
        unregisterSection("hero");
      }
    };
  }, [registerSection, unregisterSection]);

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
      texts.forEach((text: any, index: number) => {
        // Opacity fade-in animation
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
              end: "top 60%",
              toggleActions: "play reverse play reverse",
              scrub: 1,
            },
          },
        );

        // Parallax animation
        const parallaxSpeeds = [30, 50, 70];
        gsap.to(text, {
          yPercent: parallaxSpeeds[index],
          scrollTrigger: {
            trigger: text,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      // Progress ring fills as user scrolls through entire page
      if (progressCircleRef.current) {
        gsap.to(progressCircleRef.current, {
          strokeDashoffset: 0,
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
      }

      // Only fade out the SCROLL text label, not the ring
      const scrollLabel = scrollIndicatorRef.current?.querySelector("span");
      if (scrollLabel) {
        gsap.to(scrollLabel, {
          opacity: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=500",
            scrub: true,
          },
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    // Height is 500vh to ensure we have enough scroll space for the frame animation (defined in ScrollCanvas as 400vh scroll)
    <div
      ref={containerRef}
      id="hero"
      className="relative w-full h-[500vh] z-10"
    >
      {/* Main Title Screen - Scrolls up naturally */}
      <div
        ref={heroTitleRef}
        className="absolute top-0 left-0 w-full h-dvh flex flex-col items-center justify-center pointer-events-none opacity-0"
      >
        <h1 className="text-5xl md:text-8xl lg:text-9xl font-display font-bold text-white tracking-tighter uppercase mix-blend-difference">
          McLaren
        </h1>
        <p className="text-mclaren-orange text-sm md:text-2xl lg:text-3xl tracking-[0.6em] mt-4 uppercase mix-blend-difference font-light">
          Unparalleled Elegance
        </p>
      </div>

      {/* Text 1: Appears early */}
      <div className="hero-text-block absolute top-[35%] w-full flex justify-center pointer-events-none">
        <div className="text-center mix-blend-difference px-4">
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-display font-bold text-white tracking-tighter uppercase">
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
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-display font-bold text-white tracking-tighter uppercase">
            Precision
          </h2>
          <p className="text-mclaren-orange text-sm md:text-lg lg:text-xl tracking-[0.5em] mt-2 uppercase">
            Engineer the impossible
          </p>
        </div>
      </div>

      {/* Text 3: Appears late */}
      <div className="hero-text-block absolute top-[90%] w-full flex justify-center pointer-events-none">
        <div className="text-center mix-blend-difference px-4">
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-display font-bold text-white tracking-tighter uppercase">
            Pure Power
          </h2>
          <p className="text-mclaren-orange text-sm md:text-lg lg:text-xl tracking-[0.5em] mt-2 uppercase">
            Unleashed
          </p>
        </div>
      </div>

      {/* Progress ring with ref - Global progress indicator */}
      <div
        ref={scrollIndicatorRef}
        className="fixed bottom-8 right-8 z-30 pointer-events-none"
      >
        <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r="35"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="2"
          />
          {/* Progress circle */}
          <circle
            ref={progressCircleRef}
            cx="40"
            cy="40"
            r="35"
            fill="none"
            stroke="#ff6a00"
            strokeWidth="2"
            strokeDasharray={Math.PI * 2 * 35}
            strokeDashoffset={Math.PI * 2 * 35}
            strokeLinecap="round"
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-display text-white tracking-widest">
            SCROLL
          </span>
        </div>
      </div>
    </div>
  );
}
