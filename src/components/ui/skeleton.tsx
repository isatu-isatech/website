"use client";

import { cn } from "@/lib/utils";

/**
 * Skeleton - A loading placeholder component with shimmer animation
 *
 * @example
 * // Basic skeleton
 * <Skeleton className="h-4 w-full" />
 *
 * @example
 * // Card skeleton
 * <Skeleton className="h-48 w-full rounded-xl" />
 *
 * @example
 * // Avatar skeleton
 * <Skeleton className="h-12 w-12 rounded-full" />
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-muted relative overflow-hidden rounded-md",
        "before:absolute before:inset-0",
        "before:-translate-x-full before:animate-[shimmer_2s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        className,
      )}
      {...props}
    />
  );
}

/**
 * SkeletonText - A text placeholder with multiple lines
 */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full", // Last line is shorter
          )}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonCard - A card placeholder with image and text areas
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-card flex flex-col gap-4 rounded-xl border p-4",
        className,
      )}
    >
      <Skeleton className="h-40 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

/**
 * SkeletonAvatar - A circular avatar placeholder
 */
export function SkeletonAvatar({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  return (
    <Skeleton className={cn("rounded-full", sizeClasses[size], className)} />
  );
}

/**
 * SkeletonButton - A button placeholder
 */
export function SkeletonButton({
  size = "default",
  className,
}: {
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-8 w-20",
    default: "h-10 w-24",
    lg: "h-12 w-32",
  };

  return (
    <Skeleton className={cn("rounded-md", sizeClasses[size], className)} />
  );
}

/**
 * SectionSkeleton - A full section loading placeholder
 */
export function SectionSkeleton({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "flex w-full flex-col items-center justify-center gap-6 px-6 py-16",
        className,
      )}
    >
      <div className="flex w-full max-w-6xl flex-col items-center gap-6">
        {/* Header skeleton */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Skeleton className="h-8 w-48 md:h-10 md:w-64" />
          <Skeleton className="h-5 w-72 md:w-96" />
        </div>

        {/* Content grid skeleton */}
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard className="hidden sm:flex" />
          <SkeletonCard className="hidden lg:flex" />
        </div>
      </div>
    </section>
  );
}

export default Skeleton;
