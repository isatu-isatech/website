import { BlobsAnimatedBackground, BlobsConfig } from "@/components/ui/blobs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const blobsConfig: BlobsConfig[] = [
  {
    id: "not-found-blob-1",
    top: "-10%",
    left: "-10%",
    animateX: [0, 20, 0],
    animateY: [0, 30, 0],
    duration: 8,
    colorClass: "bg-primary/60",
    sizeClass: "h-96 w-96",
    blurClass: "blur-[100px]",
  },
  {
    id: "not-found-blob-2",
    bottom: "-10%",
    right: "-10%",
    animateX: [0, -20, 0],
    animateY: [0, -30, 0],
    duration: 8,
    colorClass: "bg-secondary/60",
    sizeClass: "h-96 w-96",
    blurClass: "blur-[100px]",
  },
];

export default function NotFound() {
  return (
    <main className="relative flex h-[calc(100vh-2rem)] w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Background Decorations */}
      <div className="absolute -z-10 h-full w-full">
        <BlobsAnimatedBackground blobs={blobsConfig} />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center">
          <h1 className="text-primary text-8xl leading-24 font-bold md:text-9xl">
            404
          </h1>
          <h2 className="text-secondary">Page Not Found</h2>
        </div>
        <p className="max-w-md">
          Sorry, the page you are looking for does not exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    </main>
  );
}
