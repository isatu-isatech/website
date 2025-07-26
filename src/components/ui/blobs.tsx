"use client";
import { motion } from "framer-motion";

export interface BlobsConfig {
  id: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  animateX: number[];
  animateY: number[];
  duration: number;
  repeatType?: "loop" | "reverse" | "mirror";
  colorClass: string;
  sizeClass?: string;
  blurClass?: string;
}

// Added the className prop to the interface
interface BlobsAnimatedBackgroundProps {
  className?: string;
  blobs?: BlobsConfig[];
  gridPatternOpacity?: string;
  gridPatternDarkOpacity?: string;
}

export function BlobsAnimatedBackground({
  className,
  blobs,
  gridPatternOpacity = "opacity-[0.02]",
  gridPatternDarkOpacity = "dark:opacity-[0.03]",
}: BlobsAnimatedBackgroundProps) {
  const defaultBlobs: BlobsConfig[] = [
    {
      id: "default-blob-1",
      top: "-10rem",
      right: "-10rem",
      animateX: [0, 30, 0],
      animateY: [0, 40, 0],
      duration: 12,
      colorClass: "bg-primary",
      sizeClass: "h-96 w-96",
      blurClass: "blur-[100px]",
    },
    {
      id: "default-blob-2",
      bottom: "-10rem",
      left: "-10rem",
      animateX: [0, -30, 0],
      animateY: [0, -40, 0],
      duration: 6,
      colorClass: "bg-secondary",
      sizeClass: "h-96 w-96",
      blurClass: "blur-[100px]",
    },
  ];

  const blobsToRender = blobs && blobs.length > 0 ? blobs : defaultBlobs;

  return (
    // We combine the default classes with the new className prop
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <div
        className={`bg-grid-pattern absolute inset-0 ${gridPatternOpacity} ${gridPatternDarkOpacity}`}
      />

      {blobsToRender.map((blob) => (
        <motion.div
          key={blob.id}
          className={`absolute rounded-full ${blob.colorClass} ${blob.sizeClass || "h-96 w-96"} ${blob.blurClass || "blur-[100px]"}`}
          style={{
            top: blob.top,
            bottom: blob.bottom,
            left: blob.left,
            right: blob.right,
          }}
          animate={{
            x: blob.animateX,
            y: blob.animateY,
          }}
          transition={{
            duration: blob.duration,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: blob.repeatType || "reverse",
          }}
        />
      ))}
    </div>
  );
}
