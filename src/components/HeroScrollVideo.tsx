"use client";

import { useEffect, useRef } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";

interface Props {
  progress: MotionValue<number>;
}

export default function HeroScrollVideo({ progress }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCount = 65; // Keeping at 65 as that's the number of actual images available in the folder
  const images = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    // Preload images
    const preloadedImages: HTMLImageElement[] = [];
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `/hero-sequence/ezgif-frame-${i.toString().padStart(3, "0")}.jpg`;
      preloadedImages.push(img);
    }
    images.current = preloadedImages;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    preloadedImages[0].onload = () => {
      canvas.width = preloadedImages[0].width;
      canvas.height = preloadedImages[0].height;
      context.drawImage(preloadedImages[0], 0, 0);
    };
  }, []);

  useMotionValueEvent(progress, "change", (latest) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const frameIndex = Math.min(
      frameCount - 1,
      Math.max(0, Math.floor(latest * frameCount))
    );

    requestAnimationFrame(() => {
      const img = images.current[frameIndex];
      if (img && img.complete && canvas.width > 0) {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    });
  });

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover z-0"
    />
  );
}
