"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function F1Racing() {
  const sectionRef = useRef(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (statsRef.current) {
        gsap.from(statsRef.current.children, {
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { label: "Race Victories", value: "203" },
    { label: "Drivers' Championships", value: "12" },
    { label: "Constructors' Championships", value: "8" },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-24 px-6 md:px-20 bg-[#111] relative border-t border-white/5 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-1/3 h-full bg-mclaren-orange/5 skew-x-12 transform origin-top-right" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-mclaren-orange text-sm font-bold tracking-widest uppercase mb-4">
            Formula 1 Legend
          </h2>
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6">
            THE TRIPLE CROWN
          </h3>
          <p className="text-silver-metallic text-xl max-w-2xl">
            McLaren is the only team in history to claim the Triple Crown of
            Motorsport: winning the Monaco Grand Prix, the Indianapolis 500, and
            the 24 Hours of Le Mans.
          </p>
        </div>

        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-8 bg-black/40 border border-white/10 hover:border-mclaren-orange/50 transition-colors duration-500 group"
            >
              <div className="text-4xl md:text-5xl lg:text-8xl font-bold text-white mb-2 group-hover:text-mclaren-orange transition-colors duration-500">
                {stat.value}
              </div>
              <div className="text-sm md:text-sm lg:text-lg text-silver-metallic uppercase tracking-widest duration-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
