"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

interface CarSpec {
  engine: string;
  power: string;
  torque: string;
  acceleration: string;
  topSpeed: string;
  weight: string;
  price: string;
  transmission: string;
}

interface CarModel {
  id: string;
  name: string;
  year: string;
  description: string;
  image: string;
  specs: CarSpec;
}

interface CarSpecModalProps {
  car: CarModel;
  onClose: () => void;
}

export default function CarSpecModal({ car, onClose }: CarSpecModalProps) {
  const modalPanelRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
  };

  useEffect(() => {
    // Closing animation
    if (isClosing) {
      const closeTl = gsap.timeline({
        onComplete: onClose,
      });

      closeTl
        .to(".spec-row", {
          x: 20,
          opacity: 0,
          stagger: -0.05,
          duration: 0.3,
        })
        .to(
          ".modal-image",
          {
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            ease: "back.in(1.7)",
          },
          "-=0.2"
        )
        .to(
          ".modal-panel",
          {
            y: 100,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
          },
          "-=0.3"
        )
        .to(
          ".modal-backdrop",
          {
            opacity: 0,
            duration: 0.3,
          },
          "-=0.2"
        );

      return;
    }

    // Entry animation
    const tl = gsap.timeline();

    tl.fromTo(
      ".modal-backdrop",
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    )
      .fromTo(
        ".modal-panel",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.2"
      )
      .fromTo(
        ".modal-image",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.3"
      )
      .fromTo(
        ".spec-row",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.05, duration: 0.4 },
        "-=0.2"
      );

    // Escape key handler
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    // Prevent wheel scroll from closing modal
    const handleWheel = (e: WheelEvent) => {
      const panel = modalPanelRef.current;
      if (!panel) return;

      const isScrollingDown = e.deltaY > 0;
      const isAtBottom = panel.scrollHeight - panel.scrollTop <= panel.clientHeight + 1;
      const isAtTop = panel.scrollTop === 0;

      // If at bottom/top and trying to scroll beyond, prevent the event
      if ((isAtBottom && isScrollingDown) || (isAtTop && e.deltaY < 0)) {
        e.preventDefault();
      }

      e.stopPropagation();
    };

    // Prevent touch scroll from closing modal
    const handleTouchMove = (e: TouchEvent) => {
      const panel = modalPanelRef.current;
      if (!panel) return;

      const isAtBottom = panel.scrollHeight - panel.scrollTop <= panel.clientHeight + 1;
      const isAtTop = panel.scrollTop === 0;

      // Prevent scrolling beyond the modal boundaries
      if ((isAtBottom || isAtTop)) {
        e.preventDefault();
      }

      e.stopPropagation();
    };

    // Prevent body and html scroll while modal is open
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    window.addEventListener("keydown", handleEscape);

    // Prevent any wheel/scroll on the backdrop
    const handleBackdropWheel = (e: WheelEvent) => {
      if ((e.target as Element).classList?.contains("modal-backdrop")) {
        e.preventDefault();
      }
    };

    // Add non-passive listeners to prevent default scroll behavior on modal panel
    if (modalPanelRef.current) {
      modalPanelRef.current.addEventListener("wheel", handleWheel, { passive: false });
      modalPanelRef.current.addEventListener("touchmove", handleTouchMove, { passive: false });
    }

    document.addEventListener("wheel", handleBackdropWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.removeEventListener("wheel", handleBackdropWheel);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;

      if (modalPanelRef.current) {
        modalPanelRef.current.removeEventListener("wheel", handleWheel);
        modalPanelRef.current.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [isClosing, onClose]);

  const specEntries = [
    { label: "Engine", value: car.specs.engine },
    { label: "Power", value: car.specs.power },
    { label: "Torque", value: car.specs.torque },
    { label: "0-60 mph", value: car.specs.acceleration },
    { label: "Top Speed", value: car.specs.topSpeed },
    { label: "Weight", value: car.specs.weight },
    { label: "Transmission", value: car.specs.transmission },
    { label: "Price", value: car.specs.price },
  ];

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[70] bg-carbon-black/95 backdrop-blur-lg flex items-center justify-center p-8 pointer-events-auto"
      onClick={(e) => {
        // Only close if clicking the backdrop itself, not the panel
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        ref={modalPanelRef}
        className="modal-panel relative max-w-5xl w-full bg-carbon-black border border-white/10 p-12 max-h-[90vh] overflow-y-auto pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
        onScroll={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-white/50 hover:text-mclaren-orange text-3xl transition-colors"
        >
          ×
        </button>

        {/* Car name and year */}
        <div className="mb-8">
          <h2 className="text-5xl font-display font-bold text-white mb-2">
            {car.name}
          </h2>
          <div className="text-mclaren-orange text-xl font-mono">
            {car.year}
          </div>
        </div>

        {/* Car image */}
        <div className="modal-image relative w-full h-80 mb-12">
          <Image
            src={car.image}
            alt={car.name}
            fill
            className="object-contain"
          />
        </div>

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-6">
          {specEntries.map((spec, index) => (
            <div
              key={index}
              className="spec-row border-l-2 border-mclaren-orange/50 pl-4"
            >
              <div className="text-white/50 text-sm uppercase tracking-wider mb-1">
                {spec.label}
              </div>
              <div className="text-white text-xl font-display">
                {spec.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
