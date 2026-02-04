"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll } from "@/context/ScrollContext";
import { useLenis } from "@/context/LenisContext";

const frameCount = 192;

export default function ScrollCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { setFrameLoadProgress, setImagesReady } = useScroll();
  const lenis = useLenis();

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      // Format number to 3 digits (e.g., 001, 010, 100)
      const frameNumber = i.toString().padStart(3, "0");
      img.src = `/frames/ezgif-frame-${frameNumber}.jpg`;
      img.onload = () => {
        loadedCount++;
        setFrameLoadProgress(Math.round((loadedCount / frameCount) * 100));
        if (loadedCount === frameCount) {
          setImagesLoaded(true);
          setImagesReady(true);
        }
      };
      // Handle error just in case, though we expect files to exist
      img.onerror = () => {
        loadedCount++;
        setFrameLoadProgress(Math.round((loadedCount / frameCount) * 100));
        if (loadedCount === frameCount) {
          setImagesLoaded(true);
          setImagesReady(true);
        }
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, [setFrameLoadProgress, setImagesReady]);

  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Helper to resize canvas
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    const render = () => {
      // We want the animation to finish by the time we scroll past the HeroSection.
      // Let's assume the HeroSection is roughly 400vh to 500vh tall.
      // We can create a "scroll window" for the animation.
      // e.g., 0 to 4 * window.innerHeight

      const scrollHeight = window.innerHeight * 4;
      const scrollPos = lenis?.scroll ?? 0;

      // Calculate fraction 0 to 1 based on the target scroll height
      const scrollFraction = Math.max(0, Math.min(1, scrollPos / scrollHeight));

      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount),
      );

      const img = images[frameIndex];

      if (img) {
        // Draw image cover style (Object-fit: cover)
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          centerShift_x,
          centerShift_y,
          img.width * ratio,
          img.height * ratio,
        );
      }

      requestAnimationFrame(render);
    };

    const animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", updateSize);
      cancelAnimationFrame(animationId);
    };
  }, [imagesLoaded, images, lenis]);

  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none bg-black">
      <canvas ref={canvasRef} className="w-full h-full object-cover" />
      {/* Optional Overlay to darken/tint if needed */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
    </div>
  );
}
