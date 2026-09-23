"use client";

import { useEffect } from "react";

// Root-layout failure shell: renders its own <html>/<body> since the root
// layout itself failed. Keeps the glossary voice (no "Hypeman") and surfaces
// the digest for support reference.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] unhandled root error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main
          style={{
            display: "flex",
            minHeight: "100svh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "1.5rem",
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h1>Something went wrong!</h1>
          <p>We apologize for the inconvenience. Please try again.</p>
          {error.digest && (
            <p style={{ fontSize: "0.75rem", opacity: 0.7 }}>
              Reference: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
