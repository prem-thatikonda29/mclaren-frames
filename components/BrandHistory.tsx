"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function BrandHistory() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const quoteRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(quoteRef.current, {
        scrollTrigger: {
          trigger: quoteRef.current,
          start: "top 75%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 1.5,
        ease: "expo.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-24 px-6 md:px-20 bg-carbon-black text-white overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div ref={textRef}>
          <h2 className="text-mclaren-orange text-sm font-bold tracking-widest uppercase mb-4">
            Our Heritage
          </h2>
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-8 leading-tight">
            Born on the Track. <br />
            Built for the Road.
          </h3>
          <p className="text-silver-metallic text-lg leading-relaxed mb-6">
            Founded in 1963 by Bruce McLaren, we are a company built on the
            relentless pursuit of perfection. From our roots in New Zealand to
            our headquarters in Woking, innovation is in our DNA.
          </p>
          <p className="text-silver-metallic text-lg leading-relaxed">
            We don't just build cars; we engineer experiences. Every curve,
            every line, and every component serves a purpose: performance.
          </p>
        </div>

        <div
          ref={quoteRef}
          className="relative p-8 md:p-12 border-l-4 border-mclaren-orange bg-white/5 backdrop-blur-sm"
        >
          <blockquote className="text-xl md:text-2xl lg:text-3xl font-light italic leading-normal text-white">
            "Life is measured in achievement, not in years alone."
          </blockquote>
          <footer className="mt-6 text-mclaren-orange font-bold uppercase tracking-wider">
            — Bruce McLaren
          </footer>
        </div>
      </div>
    </section>
  );
}
