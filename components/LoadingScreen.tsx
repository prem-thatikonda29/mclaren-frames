"use client";

import { useEffect, useState, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useScroll } from "@/context/ScrollContext";
import { getCarSilhouettePoints, generateParticles, type Particle } from "@/utils/carSilhouette";

export default function LoadingScreen() {
  const { frameLoadProgress, imagesReady } = useScroll();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [shouldExit, setShouldExit] = useState(false);
  const [hasMinDisplayTimePassed, setHasMinDisplayTimePassed] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const minDisplayTimeRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const particleContainerRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const percentageRef = useRef<HTMLDivElement>(null);

  // Initialize particles with car silhouette targets
  useEffect(() => {
    const carPath = getCarSilhouettePoints();
    const newParticles = generateParticles(carPath, 180, 600, 300);
    setParticles(newParticles);
  }, []);

  // Create GSAP timeline for particle animation
  useEffect(() => {
    if (particles.length === 0 || !particleContainerRef.current) return;

    // Kill existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline({ paused: true });

    // Phase 1: Spawn & Float (0-30%)
    particles.forEach((particle, index) => {
      tl.fromTo(
        particleRefs.current[index],
        {
          x: particle.startX - 300,
          y: particle.startY - 150,
          opacity: 0,
          scale: 0.5,
        },
        {
          x: particle.startX - 300 + (Math.random() - 0.5) * 100,
          y: particle.startY - 150 + (Math.random() - 0.5) * 100,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power1.out",
        },
        particle.delay
      );
    });

    // Phase 2: Converge to Car Shape (30-80%)
    particles.forEach((particle, index) => {
      tl.to(
        particleRefs.current[index],
        {
          x: particle.targetX - 300,
          y: particle.targetY - 150,
          duration: 1.2,
          ease: "power2.inOut",
        },
        0.3 // Start at 30% of timeline
      );
    });

    // Phase 3: Shimmer while loading (80-100%)
    particles.forEach((particle, index) => {
      tl.to(
        particleRefs.current[index],
        {
          scale: () => 0.8 + Math.random() * 0.4,
          opacity: () => 0.6 + Math.random() * 0.4,
          duration: 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        },
        0.75 // Start at 75% of timeline
      );
    });

    // Phase 4: Exit explosion
    particles.forEach((particle, index) => {
      tl.to(
        particleRefs.current[index],
        {
          x: particle.startX - 300 + (Math.random() - 0.5) * 400,
          y: particle.startY - 150 + (Math.random() - 0.5) * 400,
          opacity: 0,
          scale: 0,
          duration: 0.5,
          ease: "power2.in",
        },
        0.95 // Start at 95% of timeline
      );
    });

    timelineRef.current = tl;
  }, [particles]);

  // Sync timeline progress with loading progress
  useEffect(() => {
    if (!timelineRef.current || particles.length === 0) return;

    // For normal loading, sync with frameLoadProgress
    let targetProgress = frameLoadProgress / 100;

    // If exiting, jump to end
    if (shouldExit) {
      targetProgress = 1;
    }

    timelineRef.current.progress(targetProgress);
  }, [frameLoadProgress, shouldExit, particles.length]);

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
          // Progress bar fade out
          gsap.to(barRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut",
          });

          gsap.to(percentageRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut",
          });

          // Overlay slide up with particles
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

  // Cleanup timeline on unmount
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-carbon-black flex flex-col items-center justify-center"
    >
      {/* Particle Container */}
      <div
        ref={particleContainerRef}
        className="relative w-[600px] h-[300px]"
      >
        {particles.map((particle, i) => (
          <div
            key={particle.id}
            ref={(el) => {
              particleRefs.current[i] = el;
            }}
            className="absolute w-2 h-2 rounded-full will-change-transform"
            style={{
              backgroundColor: particle.color,
              left: "300px",
              top: "150px",
              boxShadow:
                particle.color === "#ff6a00"
                  ? "0 0 8px rgba(255, 106, 0, 0.8)"
                  : "0 0 4px rgba(255, 255, 255, 0.6)",
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-64 mt-12 h-0.5 bg-white/10 overflow-hidden">
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