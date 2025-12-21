"use client";

import { useEffect } from "react";
import { BlobsAnimatedBackground, BlobsConfig } from "@/components/ui/blobs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

// Configuration for the animated blobs in the background
const blobsConfig: BlobsConfig[] = [
  {
    id: "error-blob-1",
    top: "-10%",
    left: "-10%",
    animateX: [0, 20, 0],
    animateY: [0, 30, 0],
    duration: 8,
    colorClass: "bg-destructive/40",
    sizeClass: "h-96 w-96",
    blurClass: "blur-[100px]",
  },
  {
    id: "error-blob-2",
    bottom: "-10%",
    right: "-10%",
    animateX: [0, -20, 0],
    animateY: [0, -30, 0],
    duration: 8,
    colorClass: "bg-primary/40",
    sizeClass: "h-96 w-96",
    blurClass: "blur-[100px]",
  },
];

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex h-[calc(100vh-2rem)] w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Background Decorations */}
      <div className="absolute -z-10 h-full w-full">
        <BlobsAnimatedBackground blobs={blobsConfig} />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-destructive/10 rounded-full p-4">
            <AlertCircle className="text-destructive h-12 w-12" />
          </div>
          <h1 className="text-4xl font-bold md:text-5xl">
            Something went wrong!
          </h1>
          <p className="text-muted-foreground max-w-md text-lg">
            We apologize for the inconvenience. An unexpected error has
            occurred.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button onClick={() => reset()} size="lg">
            Try again
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
