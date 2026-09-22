"use client";

import { RotateCw, Smartphone } from "lucide-react";

/**
 * Mobile-landscape rotate guard — a blocking cover shown only on true
 * phone-landscape viewports (see the `mobile-landscape` custom variant).
 * Pure CSS visibility: no JS state, so form/quiz progress survives rotation
 * untouched and there is no hydration risk.
 *
 * Screen-reader users still get an announcement (role="alert") while the
 * underlying form stays operable — some visitors cannot rotate, and locking
 * them out would be worse than a cramped layout.
 */
export function RotateGuard() {
  return (
    <div
      className="mobile-landscape:flex bg-background fixed inset-0 z-100 hidden flex-col items-center justify-center gap-4 px-8 text-center"
      role="alert"
    >
      <div aria-hidden className="relative">
        <Smartphone className="text-muted-foreground size-12" />
        <RotateCw className="text-primary absolute -right-3 -bottom-1 size-6" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Please rotate your device</h2>
        <p className="text-muted-foreground text-sm">
          This experience works best in portrait mode.
        </p>
      </div>
    </div>
  );
}
