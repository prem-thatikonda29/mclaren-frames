"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useScroll } from "@/context/ScrollContext";

const eras = [
  {
    id: "founding",
    year: "1963 - 1980",
    title: "Born on the Track",
    description:
      "Founded by Bruce McLaren. Built on grit, passion, and the relentless pursuit of speed. A legacy forged in asphalt and oil.",
    quote: "Life is measured in achievement, not in years alone.",
    author: "Bruce McLaren",
    style: "grayscale contrast-125 sepia-[.3]",
    bgEffect: "bg-noise",
    image: "/images/mclaren_1960s_historic.png",
    carImage: "/images/mclaren_m7a_side.png",
  },
  {
    id: "golden",
    year: "1981 - 2010",
    title: "Technological Dominance",
    description:
      "The era of the Triple Crown and MP4/4. Digital telemetry meets raw horsepower. Redefining what is possible.",
    quote:
      "To do something well is so worthwhile that to die trying to do it better cannot be foolhardy.",
    author: "Ayrton Senna",
    style:
      "saturate-150 contrast-110 drop-shadow-[0_0_10px_rgba(255,106,0,0.5)]",
    bgEffect: "bg-grid-pattern scanline",
    image: "/images/mclaren_1980s_golden.png",
    carImage: "/images/mclaren_mp4_4_side.png",
  },
  {
    id: "modern",
    year: "2011 - Present",
    title: "The Art of the Impossible",
    description:
      "Precision engineering. Hybrid performance. Carbon fiber perfection. The future is lighter, faster, and stronger.",
    quote: "We don't just build cars. We build dreams.",
    author: "The Future of Speed",
    style: "brightness-110",
    bgEffect: "bg-gradient-to-b from-transparent to-black/50",
    image: "/images/mclaren_modern_futuristic.png",
    carImage: "/images/mclaren_750s_side.png",
  },
];

export default function BrandHistory() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [currentEra, setCurrentEra] = useState(0);
  const { registerSection, unregisterSection } = useScroll();

  // Register section with scroll context
  useEffect(() => {
    if (sectionRef.current) {
      registerSection("history", sectionRef.current);
    }
    return () => {
      if (sectionRef.current) {
        unregisterSection("history");
      }
    };
  }, [registerSection, unregisterSection]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const eraSections = gsap.utils.toArray(".era-section") as HTMLElement[];
      const eraImages = gsap.utils.toArray(".era-image") as HTMLElement[];
      const eraContents = gsap.utils.toArray(".era-content") as HTMLElement[];
      const motionCars = gsap.utils.toArray(".motion-car") as HTMLElement[];

      // Initial States
      if (eraSections.length > 0) {
        gsap.set(eraSections[0], { opacity: 1, zIndex: 10 });
        gsap.set(eraSections.slice(1), { opacity: 0, zIndex: 0 });

        gsap.set(eraImages, { scale: 1.1 });
        // Set cars off-screen left
        gsap.set(motionCars, { x: "-100vw", opacity: 0.9 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=3000",
          pin: true,
          scrub: 1,
        },
      });

      timelineRef.current = tl;

      // --- Sequence Logic ---
      eras.forEach((_, i) => {
        if (i < eras.length - 1) {
          // 1. Sync Zoom & Morph
          tl.to(eraImages[i], {
            scale: 0.9,
            duration: 1.5,
            ease: "power2.inOut",
          }).to(
            motionCars[i],
            { x: "100vw", duration: 1.5, ease: "power2.inOut" },
            "<",
          );

          // 2. Crossfade to Next Era
          tl.to(eraSections[i], { opacity: 0, duration: 0.5 })
            .to(
              eraSections[i + 1],
              { opacity: 1, zIndex: 10, duration: 0.5 },
              "<",
            )
            .fromTo(
              eraImages[i + 1],
              { scale: 1.2 },
              { scale: 1.1, duration: 1 },
              "<",
            );

          // Update state after transition
          tl.call(() => setCurrentEra(i + 1));
        } else {
          tl.to(motionCars[i], {
            x: "100vw",
            duration: 1.5,
            ease: "power2.inOut",
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleEraClick = (targetEra: number) => {
    const tl = timelineRef.current;
    if (!tl) return;

    const progress = targetEra / (eras.length - 1);

    gsap.to(tl, {
      progress: progress,
      duration: 1,
      ease: "power2.inOut",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="history"
      className="relative bg-carbon-black text-white overflow-hidden h-screen"
    >
      <div ref={containerRef} className="w-full h-full relative">
        {/* Era Navigation Dots */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
          {eras.map((era, index) => (
            <div
              key={era.id}
              className="relative group cursor-pointer"
              onClick={() => handleEraClick(index)}
            >
              {/* Dot */}
              <div
                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                  currentEra === index
                    ? "bg-mclaren-orange border-mclaren-orange scale-125"
                    : "bg-transparent border-white/30 hover:border-white/60"
                }`}
              />
              {/* Year label */}
              <div
                className={`absolute right-6 top-1/2 -translate-y-1/2 whitespace-nowrap text-sm font-display text-white/80 transition-opacity duration-200 ${
                  currentEra === index
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {era.year}
              </div>
            </div>
          ))}
        </div>

        {eras.map((era, index) => (
          <div
            key={era.id}
            className={`era-section absolute inset-0 w-full h-full flex items-center justify-center opacity-0`}
          >
            {/* Background Image with Parallax Class */}
            <div className="era-image absolute inset-0 w-full h-full">
              <Image
                src={era.image}
                alt={era.title}
                fill
                className="object-cover opacity-60"
                priority={index === 0}
              />
            </div>

            {/* Era-Specific Texture Overlay */}
            <div
              className={`absolute inset-0 w-full h-full pointer-events-none z-0 mix-blend-overlay ${era.bgEffect}`}
            />

            {/* Dark Gradient Overlay for text readability */}
            <div
              className={`absolute inset-0 bg-black/40 pointer-events-none z-0 transition-all duration-700 ${era.style}`}
            />

            {/* Moving Car Layer */}
            <div className="motion-car absolute bottom-[5%] left-0 w-[60vw] md:w-[40vw] h-auto z-20 pointer-events-none mix-blend-plus-darker">
              <Image
                src={era.carImage}
                alt={`${era.title} Car`}
                width={800}
                height={400}
                className="w-full h-auto object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                priority
              />
            </div>

            <div className="era-content max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10 px-6 md:px-20">
              <div className="drop-shadow-2xl">
                <h2 className="text-mclaren-orange text-sm font-bold tracking-widest uppercase mb-4">
                  {era.year}
                </h2>
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-8 leading-tight">
                  {era.title}
                </h3>
                <p className="text-silver-metallic text-lg leading-relaxed mb-6 max-w-xl font-medium drop-shadow-md">
                  {era.description}
                </p>
              </div>

              <div className="relative p-8 md:p-12 border-l-4 border-mclaren-orange/50 bg-white/10 backdrop-blur-md shadow-2xl group hover:bg-white/15 hover:border-l-[6px] transition-all duration-300">
                <blockquote className="text-xl md:text-2xl lg:text-3xl font-light italic leading-normal text-white/80 group-hover:text-mclaren-orange/90 transition-colors">
                  "{era.quote}"
                </blockquote>
                <footer className="mt-6 text-mclaren-orange font-bold uppercase tracking-wider group-hover:tracking-[0.3em] transition-all duration-300">
                  — {era.author}
                </footer>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
