"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useScroll } from "@/context/ScrollContext";
import CarSpecModal from "./CarSpecModal";

const models = [
  {
    id: "f1",
    name: "McLaren F1",
    year: "1992",
    description:
      "The greatest supercar ever built. A fastidious attention to detail. A central driving position. A gold-lined engine bay.",
    image: "/images/mclaren_f1_classic.png",
    specs: {
      engine: "6.1L BMW V12",
      power: "627 hp",
      torque: "479 lb-ft",
      acceleration: "3.2 seconds",
      topSpeed: "240 mph",
      weight: "2,509 lbs",
      transmission: "6-speed manual",
      price: "$1,000,000",
    },
  },
  {
    id: "p1",
    name: "McLaren P1",
    year: "2013",
    description:
      "Designed to be the best driver's car in the world on road and track. Utilizing hybrid power not for economy, but for pure performance.",
    image: "/images/mclaren_p1_hybrid.png",
    specs: {
      engine: "3.8L Twin-Turbo V8 + Electric",
      power: "903 hp",
      torque: "664 lb-ft",
      acceleration: "2.8 seconds",
      topSpeed: "217 mph",
      weight: "3,411 lbs",
      transmission: "7-speed dual-clutch",
      price: "$1,150,000",
    },
  },
  {
    id: "750s",
    name: "McLaren 750S",
    year: "2024",
    description:
      "The lightest and most powerful series-production McLaren ever. 30% of components are new or changed from the 720S to perfect the formula.",
    image: "/images/mclaren_750s_modern.png",
    specs: {
      engine: "4.0L Twin-Turbo V8",
      power: "740 hp",
      torque: "590 lb-ft",
      acceleration: "2.7 seconds",
      topSpeed: "206 mph",
      weight: "2,952 lbs",
      transmission: "7-speed dual-clutch",
      price: "$324,000",
    },
  },
];

export default function CarModels() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const [selectedModel, setSelectedModel] = useState<(typeof models)[0] | null>(null);
  const [activeCar, setActiveCar] = useState(0);
  const { registerSection, unregisterSection } = useScroll();

  // Register section with scroll context
  useEffect(() => {
    if (sectionRef.current) {
      registerSection("models", sectionRef.current);
    }
    return () => {
      if (sectionRef.current) {
        unregisterSection("models");
      }
    };
  }, [registerSection, unregisterSection]);

  useEffect(() => {
    let ctx = gsap.context(() => {}); // Initialize empty context

    // Use matchMedia for responsive animation
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      ctx = gsap.context(() => {
        const sections = gsap.utils.toArray(".car-card");
        gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            end: "+=3000",
            onUpdate: (self) => {
              const progress = self.progress;
              const newActiveCar = Math.round(
                progress * (models.length - 1)
              );
              setActiveCar(newActiveCar);
            },
          },
        });

        // Store the scroll trigger instance
        const st = ScrollTrigger.getAll().find(
          (trigger) => trigger.vars.trigger === sectionRef.current
        );
        scrollTriggerRef.current = st || null;
      }, sectionRef);
    });

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  const handleDotClick = (index: number) => {
    const sections = gsap.utils.toArray(".car-card") as HTMLElement[];
    if (sections.length === 0) return;

    // Calculate scroll distance for this car
    const carIndex = index;
    const progress = carIndex / (sections.length - 1);

    // Get the scroll trigger instance from the first car card
    const st = ScrollTrigger.getAll().find(
      (trigger) => trigger.vars.trigger === sectionRef.current
    );

    if (st) {
      const scrollStart = st.start || 0;
      const scrollEnd = st.end || 0;
      const scrollPosition = scrollStart + (scrollEnd - scrollStart) * progress;

      gsap.to(window, {
        scrollTo: scrollPosition,
        duration: 1,
        ease: "power2.inOut",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="models"
      className="bg-carbon-black text-white h-auto lg:h-screen overflow-hidden flex flex-col justify-center relative py-20 lg:py-0"
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
        className="flex flex-col lg:flex-row w-full lg:w-[300%] h-auto lg:h-[70vh] mt-24 lg:mt-20 gap-20 lg:gap-0"
      >
        {models.map((model) => (
          <div
            key={model.id}
            className="car-card group w-full lg:w-1/3 h-auto lg:h-full flex flex-col lg:flex-row items-center justify-center px-6 lg:px-20 shrink-0"
          >
            <div className="w-full lg:w-1/2 relative h-[300px] lg:h-[500px] mb-8 lg:mb-0">
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

            <div className="w-full lg:w-1/2 lg:pl-16">
              <h4 className="text-4xl text-5xl lg:text-6xl font-display font-bold mb-6 text-white">
                {model.name}
              </h4>
              <p className="text-silver-metallic text-base lg:text-lg leading-relaxed max-w-xl border-l-2 border-mclaren-orange pl-6">
                {model.description}
              </p>
              <button
                onClick={() => setSelectedModel(model)}
                className="mt-8 px-8 py-3 border border-white/20 hover:bg-mclaren-orange hover:border-mclaren-orange hover:text-black transition-all duration-300 uppercase tracking-widest text-sm font-bold"
              >
                Discover More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Progress dots */}
      <div className="fixed bottom-10 right-10 z-30 flex gap-3">
        {models.map((model, index) => (
          <button
            key={model.id}
            onClick={() => handleDotClick(index)}
            className={`transition-all duration-300 ${
              activeCar === index
                ? "w-8 h-3 bg-mclaren-orange rounded-full"
                : "w-3 h-3 bg-white/30 rounded-full hover:bg-white/60"
            }`}
            aria-label={`Go to ${model.name}`}
          />
        ))}
      </div>

      {/* Modal */}
      {selectedModel && (
        <CarSpecModal
          car={selectedModel}
          onClose={() => setSelectedModel(null)}
        />
      )}
    </section>
  );
}
