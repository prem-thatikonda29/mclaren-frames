"use client";

import { useEffect, useState, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useScroll } from "@/context/ScrollContext";

export default function LoadingScreen() {
  const { frameLoadProgress, imagesReady } = useScroll();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [shouldExit, setShouldExit] = useState(false);
  const [hasMinDisplayTimePassed, setHasMinDisplayTimePassed] = useState(false);
  const minDisplayTimeRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const percentageRef = useRef<HTMLDivElement>(null);

  // Minimum display time of 1.5s to avoid flash
  useEffect(() => {
    const timer = setTimeout(() => {
      minDisplayTimeRef.current = true;
      setHasMinDisplayTimePassed(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Smoothly animate displayed progress
  useEffect(() => {
    const animation = gsap.to({ val: displayProgress }, {
      val: frameLoadProgress,
      duration: 0.3,
      ease: "power1.out",
      onUpdate: function () {
        setDisplayProgress(Math.round(this.targets()[0].val));
      },
    });

    return () => {
      animation.kill();
    };
  }, [frameLoadProgress]);

  // Lock overflow on html during load
  useEffect(() => {
    if (!shouldExit) {
      document.documentElement.style.overflow = "hidden";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [shouldExit]);

  // Exit animation when ready and minimum time has passed
  useEffect(() => {
    if (imagesReady && hasMinDisplayTimePassed && !shouldExit) {
      setShouldExit(true);

      // Animate progress bar to 100% if not already there
      gsap.to(barRef.current, {
        scaleX: 1,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          // Title scale up + fade out
          gsap.to(titleRef.current, {
            scale: 1.1,
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
          });

          // Overlay slide up
          gsap.to(overlayRef.current, {
            y: "-100%",
            duration: 0.8,
            ease: "power4.inOut",
            onComplete: () => {
              // Refresh ScrollTrigger after layout stabilizes
              setTimeout(() => {
                ScrollTrigger.refresh();
              }, 100);
            },
          });
        },
      });
    }
  }, [imagesReady, hasMinDisplayTimePassed, shouldExit]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-carbon-black flex flex-col items-center justify-center"
    >
      <div
        ref={titleRef}
        className="text-6xl md:text-8xl font-display font-bold text-white tracking-tighter uppercase"
      >
        MCLAREN
      </div>

      {/* Progress bar */}
      <div className="w-64 mt-8 h-0.5 bg-white/10 overflow-hidden">
        <div
          ref={barRef}
          className="h-full bg-mclaren-orange origin-left"
          style={{ transform: `scaleX(${displayProgress / 100})` }}
        />
      </div>

      {/* Percentage counter */}
      <div
        ref={percentageRef}
        className="mt-4 text-sm text-white/50 font-mono tabular-nums tracking-widest uppercase"
      >
        {displayProgress}%
      </div>
    </div>
  );
}