"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Custom className */
  className?: string;
  /** Show loading text */
  showText?: boolean;
  /** Custom loading text */
  text?: string;
  /** Spinner variant */
  variant?: "default" | "dots" | "pulse";
}

/**
 * LoadingSpinner - A versatile loading indicator component
 *
 * @example
 * // Default spinner
 * <LoadingSpinner />
 *
 * @example
 * // With text
 * <LoadingSpinner showText text="Loading data..." />
 *
 * @example
 * // Dots variant
 * <LoadingSpinner variant="dots" />
 */
export function LoadingSpinner({
  size = "md",
  className,
  showText = false,
  text = "Loading...",
  variant = "default",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "rounded-full bg-primary animate-bounce",
              size === "xs" && "h-1 w-1",
              size === "sm" && "h-1.5 w-1.5",
              size === "md" && "h-2 w-2",
              size === "lg" && "h-2.5 w-2.5",
              size === "xl" && "h-3 w-3"
            )}
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
        {showText && (
          <span className={cn("ml-2 text-muted-foreground", textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className={cn("animate-pulse rounded-full bg-primary", sizeClasses[size])} />
        {showText && (
          <span className={cn("text-muted-foreground", textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  // Default spinner
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        className={cn("animate-spin text-primary", sizeClasses[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {showText && (
        <span className={cn("text-muted-foreground", textSizeClasses[size])}>
          {text}
        </span>
      )}
    </div>
  );
}

/**
 * FullPageLoader - A full-page loading overlay
 */
export function FullPageLoader({
  text = "Loading...",
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="xl" />
        <p className="text-lg font-medium text-foreground">{text}</p>
      </div>
    </div>
  );
}

/**
 * InlineLoader - A small inline loading indicator
 */
export function InlineLoader({
  className,
}: {
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <LoadingSpinner size="xs" />
    </span>
  );
}

export default LoadingSpinner;
