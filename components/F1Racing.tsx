"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useScroll } from "@/context/ScrollContext";

export default function F1Racing() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const { registerSection, unregisterSection } = useScroll();

  // Register section with scroll context
  useEffect(() => {
    if (sectionRef.current) {
      registerSection("racing", sectionRef.current);
    }
    return () => {
      if (sectionRef.current) {
        unregisterSection("racing");
      }
    };
  }, [registerSection, unregisterSection]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const statElements = statsRef.current?.children;
      if (!statElements) return;

      const stats = [
        {
          label: "Race Victories",
          value: "203",
          details: [
            { year: "1968", event: "First F1 victory (Spa)" },
            { year: "1984", event: "First Constructors' Championship" },
            { year: "1988", event: "Dominant season - 15/16 wins" },
            { year: "2023", event: "Most recent victory" },
          ],
        },
        {
          label: "Drivers' Championships",
          value: "12",
          details: [
            { year: "1974", event: "Emerson Fittipaldi" },
            { year: "1984", event: "Niki Lauda" },
            { year: "1988-1991", event: "Ayrton Senna (3 titles)" },
            { year: "2008", event: "Lewis Hamilton" },
          ],
        },
        {
          label: "Constructors' Championships",
          value: "8",
          details: [
            { year: "1974", event: "First Constructor's title" },
            { year: "1984-1985", event: "Back-to-back wins" },
            { year: "1988-1991", event: "Dominant era (4 consecutive)" },
            { year: "1998", event: "Return to glory" },
          ],
        },
      ];

      Array.from(statElements).forEach((el, index) => {
        const valueElement = el.querySelector(".stat-value");
        if (!valueElement) return;

        const targetValue = parseInt(stats[index].value);

        gsap.to(
          { val: 0 },
          {
            val: targetValue,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            onUpdate: function () {
              valueElement.textContent = Math.round((this as any).targets()[0].val).toString();
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    {
      label: "Race Victories",
      value: "203",
      details: [
        { year: "1968", event: "First F1 victory (Spa)" },
        { year: "1984", event: "First Constructors' Championship" },
        { year: "1988", event: "Dominant season - 15/16 wins" },
        { year: "2023", event: "Most recent victory" },
      ],
    },
    {
      label: "Drivers' Championships",
      value: "12",
      details: [
        { year: "1974", event: "Emerson Fittipaldi" },
        { year: "1984", event: "Niki Lauda" },
        { year: "1988-1991", event: "Ayrton Senna (3 titles)" },
        { year: "2008", event: "Lewis Hamilton" },
      ],
    },
    {
      label: "Constructors' Championships",
      value: "8",
      details: [
        { year: "1974", event: "First Constructor's title" },
        { year: "1984-1985", event: "Back-to-back wins" },
        { year: "1988-1991", event: "Dominant era (4 consecutive)" },
        { year: "1998", event: "Return to glory" },
      ],
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="racing"
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

        <div
          ref={statsRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-carbon-black/50 p-8 border border-white/10 hover:border-mclaren-orange/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden"
              onClick={() =>
                setExpandedCard(expandedCard === index ? null : index)
              }
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-mclaren-orange/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Left accent */}
              <div className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-1 bg-mclaren-orange transition-all duration-300" />

              {/* Value */}
              <div className="stat-value text-6xl font-display font-bold text-white mb-4 tabular-nums relative z-10">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-white/60 text-sm uppercase tracking-wider mb-4 relative z-10">
                {stat.label}
              </div>

              {/* Expand chevron */}
              <div
                className={`text-mclaren-orange transition-transform duration-300 relative z-10 ${
                  expandedCard === index ? "rotate-180" : ""
                }`}
              >
                ▼
              </div>

              {/* Details panel */}
              <div
                className={`transition-all duration-300 ${
                  expandedCard === index
                    ? "max-h-80 opacity-100 mt-4"
                    : "max-h-0 opacity-0"
                } overflow-hidden relative z-10`}
              >
                <div className="border-t border-white/10 pt-4 space-y-3">
                  {stat.details.map((detail, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-mclaren-orange font-mono text-sm flex-shrink-0">
                        {detail.year}
                      </span>
                      <span className="text-white/70 text-sm">{detail.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
