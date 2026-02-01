"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function CarModels() {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {}); // Initialize empty context

    // Use matchMedia for responsive animation
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      ctx = gsap.context(() => {
        const sections = gsap.utils.toArray(".car-card");
        gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            snap: 1 / (sections.length - 1),
            end: "+=3000",
          },
        });
      }, sectionRef);
    });

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  const models = [
    {
      id: "f1",
      name: "McLaren F1",
      year: "1992",
      description:
        "The greatest supercar ever built. A fastidious attention to detail. A central driving position. A gold-lined engine bay.",
      image: "/images/mclaren_f1_classic.png",
    },
    {
      id: "p1",
      name: "McLaren P1",
      year: "2013",
      description:
        "Designed to be the best driver's car in the world on road and track. Utilizing hybrid power not for economy, but for pure performance.",
      image: "/images/mclaren_p1_hybrid.png",
    },
    {
      id: "750s",
      name: "McLaren 750S",
      year: "2024",
      description:
        "The lightest and most powerful series-production McLaren ever. 30% of components are new or changed from the 720S to perfect the formula.",
      image: "/images/mclaren_750s_modern.png",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-carbon-black text-white h-auto md:h-screen overflow-hidden flex flex-col justify-center relative py-20 md:py-0"
    >
      <div className="absolute top-10 left-6 md:left-20 z-10">
        <h2 className="text-mclaren-orange text-sm font-bold tracking-widest uppercase mb-2">
          The Lineup
        </h2>
        <h3 className="text-4xl md:text-5xl font-display font-bold">
          LEGENDARY MODELS
        </h3>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex flex-col md:flex-row w-full md:w-[300%] h-auto md:h-[70vh] mt-24 md:mt-20 gap-20 md:gap-0"
      >
        {models.map((model) => (
          <div
            key={model.id}
            className="car-card w-full md:w-1/3 h-auto md:h-full flex flex-col md:flex-row items-center justify-center px-6 md:px-20 shrink-0"
          >
            <div className="w-full md:w-1/2 relative h-[300px] md:h-[500px] mb-8 md:mb-0">
              {/* Note: Using Fill for responsive image behavior */}
              <Image
                src={model.image}
                alt={model.name}
                fill
                className="object-contain drop-shadow-[0_20px_50px_rgba(255,106,0,0.15)]"
                priority
              />
              <div className="absolute -bottom-10 -right-4 text-[4rem] md:text-[6rem] lg:text-[8rem] font-display font-bold text-white/60 select-none z-10 pointer-events-none">
                {model.year}
              </div>
            </div>

            <div className="w-full md:w-1/2 md:pl-16">
              <h4 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-white">
                {model.name}
              </h4>
              <p className="text-silver-metallic text-base md:text-xl leading-relaxed max-w-xl border-l-2 border-mclaren-orange pl-6">
                {model.description}
              </p>
              <button className="mt-8 px-8 py-3 border border-white/20 hover:bg-mclaren-orange hover:border-mclaren-orange hover:text-black transition-all duration-300 uppercase tracking-widest text-sm font-bold">
                Discover More
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-10 right-10 flex gap-2">
        {/* Simple indicator dots could go here */}
      </div>
    </section>
  );
}
