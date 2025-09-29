"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const images = [
  "/assets/Mlbb.png",
  "/assets/Mlbb2.png",
  "/assets/Mlbb3.png",
  "/assets/Mlbb4.png",
  "/assets/Mlbb.png",
];

export default function ScrollSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const deltaX = useRef(0);

  // Auto-scroll logic
  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    stopAutoScroll();
  };

  const handleMouseUp = () => {
    if (deltaX.current > 50) {
      goToPrev();
    } else if (deltaX.current < -50) {
      goToNext();
    }
    deltaX.current = 0;
    setIsDragging(false);
    startAutoScroll();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      deltaX.current = e.clientX - startX.current;
    }
  };

  const startAutoScroll = () => {
    stopAutoScroll();
    intervalRef.current = setInterval(() => {
      goToNext();
    }, 3000);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleManualClick = (callback: () => void) => {
    stopAutoScroll();
    callback();
    startAutoScroll();
  };

  return (
    <div
      className="relative w-full h-[250px] overflow-hidden bg-amber-600 rounded-2xl"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (isDragging) {
          handleMouseUp();
        }
      }}
      onClick={(e) => {
        const bounds = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - bounds.left;
        if (!isDragging) {
          if (clickX < bounds.width / 3) {
            handleManualClick(goToPrev);
          } else if (clickX > (bounds.width / 3) * 2) {
            handleManualClick(goToNext);
          }
        }
      }}
    >
      {/* Slides - Fixed width calculation */}
      <div
        className="absolute top-0 left-0 flex transition-transform duration-700 ease-in-out h-full"
        style={{
          width: `${images.length * 100}%`,
          transform: `translateX(-${currentIndex * (100 / images.length)}%)`,
        }}
      >
        {images.map((src, index) => (
          <div
            key={index}
            className="relative h-full"
            style={{ width: `${100 / images.length}%` }}
          >
            <Image
              src={src}
              alt={`Slide ${index}`}
              fill
              className="object-cover [object-position:center_30%]"
              sizes="(max-width: 768px) 100vw, 50vw" 
            />
          </div>
        ))}
      </div>

      {/* Navigation buttons remain the same */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleManualClick(goToPrev);
        }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 rotate-90 bg-opacity-50 text-white px-3 py-1 rounded hover:bg-opacity-70 z-10"
      >
        <Image
          src="/assets/image2.png"
          alt="left-icon"
          width={100}
          height={100}
        />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleManualClick(goToNext);
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 -rotate-90 bg-opacity-50 text-white px-3 py-1 rounded hover:bg-opacity-70 z-10"
      >
        <Image
          src="/assets/image2.png"
          alt="right-icon"
          width={100}
          height={100}
        />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              handleManualClick(() => setCurrentIndex(index));
            }}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            } hover:bg-white transition-all duration-300`}
          />
        ))}
      </div>
    </div>
  );
}
