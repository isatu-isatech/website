import { ISATechLogoMark } from "@/components/assets/logos";

/**
 * Global loading component shown during page transitions
 * This file is automatically used by Next.js App Router
 */
export default function Loading() {
  return (
    <main className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-6">
      {/* Animated Logo */}
      <div className="relative flex items-center justify-center">
        {/* Pulse ring */}
        <div className="bg-primary/20 absolute h-24 w-24 animate-ping rounded-full" />
        <div className="bg-primary/30 absolute h-20 w-20 animate-pulse rounded-full" />
        {/* Logo */}
        <div className="relative z-10 animate-pulse">
          <ISATechLogoMark className="h-16 w-auto" />
        </div>
      </div>

      {/* Loading text */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-foreground text-lg font-medium">Loading...</p>
        <p className="text-muted-foreground text-sm">
          Please wait while we prepare the page
        </p>
      </div>

      {/* Animated dots */}
      <div className="flex gap-1.5">
        <span
          className="bg-primary h-2 w-2 animate-bounce rounded-full"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="bg-primary h-2 w-2 animate-bounce rounded-full"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="bg-primary h-2 w-2 animate-bounce rounded-full"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </main>
  );
}
