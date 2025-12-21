"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Default blur data URL - a tiny gray placeholder
 * This is inlined to avoid extra network requests
 */
const DEFAULT_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+";

/**
 * Primary brand color blur placeholder
 */
const PRIMARY_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjAzYzkwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==";

interface OptimizedImageProps extends Omit<ImageProps, "placeholder"> {
  /** Whether to show loading skeleton */
  showSkeleton?: boolean;
  /** Custom skeleton className */
  skeletonClassName?: string;
  /** Placeholder type */
  placeholderType?: "blur" | "skeleton" | "none";
  /** Use brand color for placeholder */
  brandPlaceholder?: boolean;
}

/**
 * OptimizedImage - An enhanced Image component with built-in loading states
 *
 * Features:
 * - Automatic blur placeholder
 * - Optional skeleton loading state
 * - Smooth fade-in transition on load
 * - Error handling with fallback
 *
 * @example
 * // Basic usage with blur
 * <OptimizedImage
 *   src="/photo.jpg"
 *   alt="Photo"
 *   width={400}
 *   height={300}
 * />
 *
 * @example
 * // With skeleton loading
 * <OptimizedImage
 *   src="/photo.jpg"
 *   alt="Photo"
 *   width={400}
 *   height={300}
 *   placeholderType="skeleton"
 * />
 */
export function OptimizedImage({
  src,
  alt,
  className,
  showSkeleton = false,
  skeletonClassName,
  placeholderType = "blur",
  brandPlaceholder = false,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    onLoad?.(event);
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(event);
  };

  // Show skeleton if using skeleton placeholder and still loading
  if (placeholderType === "skeleton" && isLoading) {
    return (
      <div className={cn("relative", className)}>
        {/* Skeleton placeholder */}
        <div
          className={cn(
            "absolute inset-0 animate-pulse rounded bg-muted",
            skeletonClassName
          )}
        />
        {/* Hidden image that loads in background */}
        <Image
          src={src}
          alt={alt}
          className="opacity-0"
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      </div>
    );
  }

  // Show error fallback
  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
        style={{
          width: props.width,
          height: props.height,
        }}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  // Standard blur placeholder
  return (
    <Image
      src={src}
      alt={alt}
      className={cn(
        "transition-opacity duration-300",
        isLoading ? "opacity-0" : "opacity-100",
        className
      )}
      placeholder={placeholderType === "blur" ? "blur" : undefined}
      blurDataURL={
        placeholderType === "blur"
          ? brandPlaceholder
            ? PRIMARY_BLUR_DATA_URL
            : DEFAULT_BLUR_DATA_URL
          : undefined
      }
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
}

/**
 * ImagePlaceholder - A simple placeholder for image slots
 * Use when you need to reserve space for an image
 */
export function ImagePlaceholder({
  width,
  height,
  className,
  animated = true,
}: {
  width?: number | string;
  height?: number | string;
  className?: string;
  animated?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded bg-muted",
        animated && "animate-pulse",
        className
      )}
      style={{ width, height }}
    >
      <svg
        className="h-10 w-10 text-muted-foreground/50"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );
}

export default OptimizedImage;
