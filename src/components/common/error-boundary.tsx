"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * Props for the ErrorBoundary component
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback component to display when an error occurs */
  fallback?: ReactNode;
  /** Callback fired when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Custom reset handler */
  onReset?: () => void;
  /** Whether to show error details (useful for development) */
  showDetails?: boolean;
  /** Custom className for the error container */
  className?: string;
}

/**
 * State for the ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary - A reusable error boundary component for catching and handling
 * JavaScript errors in child components.
 *
 * @example
 * // Basic usage
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * @example
 * // With custom fallback
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * @example
 * // With error callback
 * <ErrorBoundary onError={(error) => logToService(error)}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Update state with error info
    this.setState({ errorInfo });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    // Reset the error boundary state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call the onReset callback if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback, showDetails, className } = this.props;

    if (hasError) {
      // If a custom fallback is provided, render it
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div
          className={`border-destructive/50 bg-destructive/5 flex min-h-[200px] w-full flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-6 text-center ${className || ""}`}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="bg-destructive/10 rounded-full p-3">
              <AlertTriangle className="text-destructive h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">Something went wrong</h3>
            <p className="text-muted-foreground max-w-sm text-sm">
              An error occurred while rendering this section. Please try again.
            </p>
          </div>

          {/* Error details (shown in development or when showDetails is true) */}
          {(showDetails || process.env.NODE_ENV === "development") && error && (
            <details className="w-full max-w-md text-left">
              <summary className="text-muted-foreground hover:text-foreground cursor-pointer text-sm">
                View error details
              </summary>
              <pre className="bg-muted mt-2 overflow-auto rounded p-3 text-xs">
                <code>{error.message}</code>
                {error.stack && (
                  <>
                    {"\n\n"}
                    <code className="text-muted-foreground">{error.stack}</code>
                  </>
                )}
              </pre>
            </details>
          )}

          <Button
            onClick={this.handleReset}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      );
    }

    return children;
  }
}

/**
 * withErrorBoundary - HOC to wrap a component with an ErrorBoundary
 *
 * @example
 * const SafeComponent = withErrorBoundary(MyComponent, {
 *   onError: (error) => logError(error),
 * });
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">,
): React.FC<P> {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";

  const ComponentWithErrorBoundary: React.FC<P> = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

  return ComponentWithErrorBoundary;
}

export default ErrorBoundary;
