"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

/**
 * Props for the SectionErrorBoundary component
 */
interface SectionErrorBoundaryProps {
  children: ReactNode;
  /** Section name for better error context */
  sectionName?: string;
  /** Callback fired when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Whether to show a compact version */
  compact?: boolean;
}

/**
 * State for the SectionErrorBoundary component
 */
interface SectionErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * SectionErrorBoundary - A lightweight error boundary designed for wrapping
 * individual page sections. Shows a minimal, inline error UI that doesn't
 * break the page layout.
 *
 * @example
 * <SectionErrorBoundary sectionName="Team Section">
 *   <HomepageTeamSection />
 * </SectionErrorBoundary>
 */
export class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(
    error: Error,
  ): Partial<SectionErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { sectionName, onError } = this.props;

    console.error(
      `SectionErrorBoundary${sectionName ? ` (${sectionName})` : ""} caught an error:`,
      error,
    );

    if (onError) {
      onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { hasError } = this.state;
    const { children, sectionName, compact } = this.props;

    if (hasError) {
      if (compact) {
        // Compact inline error display
        return (
          <div
            className="bg-muted/50 text-muted-foreground flex w-full items-center justify-center gap-3 rounded-lg px-4 py-6"
            role="alert"
          >
            <AlertCircle className="text-destructive h-5 w-5" />
            <span className="text-sm">
              {sectionName
                ? `Failed to load ${sectionName}`
                : "This section failed to load"}
            </span>
            <Button
              onClick={this.handleReset}
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2"
            >
              <RefreshCw className="h-3 w-3" />
              Retry
            </Button>
          </div>
        );
      }

      // Standard section error display
      return (
        <section
          className="flex w-full flex-col items-center justify-center gap-4 px-6 py-16"
          role="alert"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="bg-muted rounded-full p-3">
              <AlertCircle className="text-muted-foreground h-8 w-8" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-foreground text-lg font-medium">
                {sectionName
                  ? `Unable to load ${sectionName}`
                  : "Section temporarily unavailable"}
              </h3>
              <p className="text-muted-foreground max-w-md text-sm">
                We&apos;re having trouble displaying this content. Don&apos;t
                worry, the rest of the page should work fine.
              </p>
            </div>
            <Button
              onClick={this.handleReset}
              variant="outline"
              size="sm"
              className="mt-2 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Loading Again
            </Button>
          </div>
        </section>
      );
    }

    return children;
  }
}

export default SectionErrorBoundary;
