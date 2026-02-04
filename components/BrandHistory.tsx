"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
          end: "+=3000", // Tighter scroll distance for faster feel
          pin: true,
          scrub: 1,
        },
      });

      // --- Sequence Logic ---
      eras.forEach((_, i) => {
        // If it's not the last era, transition to the next
        if (i < eras.length - 1) {
          // 1. Sync Zoom & Morph
          // Era Background Scales Down AND Car Zooms simultaneously
          tl.to(eraImages[i], {
            scale: 0.9,
            duration: 1.5,
            ease: "power2.inOut",
          }).to(
            motionCars[i],
            { x: "100vw", duration: 1.5, ease: "power2.inOut" },
            "<", // Start exact same time
          );

          // 2. Crossfade to Next Era
          // Current fades out, Next fades in
          tl.to(eraSections[i], { opacity: 0, duration: 0.5 })
            .to(
              eraSections[i + 1],
              { opacity: 1, zIndex: 10, duration: 0.5 },
              "<",
            )
            // Next BG starts slightly zoomed in (1.2) and settles to 1.1
            .fromTo(
              eraImages[i + 1],
              { scale: 1.2 },
              { scale: 1.1, duration: 1 },
              "<",
            );
        } else {
          // Final Era (Modern)
          // ONLY Car Zoom. No BG Scale. No Text Fade.
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

  return (
    <section
      ref={sectionRef}
      className="relative bg-carbon-black text-white overflow-hidden h-screen"
    >
      <div ref={containerRef} className="w-full h-full relative">
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

              <div className="relative p-8 md:p-12 border-l-4 border-mclaren-orange bg-white/10 backdrop-blur-md shadow-2xl">
                <blockquote className="text-xl md:text-2xl lg:text-3xl font-light italic leading-normal text-white">
                  "{era.quote}"
                </blockquote>
                <footer className="mt-6 text-mclaren-orange font-bold uppercase tracking-wider">
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
