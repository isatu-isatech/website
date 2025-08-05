"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export interface ImageCycleProps {
  images: {
    src: string;
    alt: string;
  }[];
  interval?: number;
  className?: string;
}

export default function ImageCycleComponent({
  images,
  interval = 5000,
  className,
}: ImageCycleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {images.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          width={1620}
          height={1080}
          sizes="947px"
          priority={index === 0} // Prioritize loading the first image
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"} `}
        />
      ))}
    </div>
  );
}
