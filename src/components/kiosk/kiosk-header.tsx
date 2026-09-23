"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ISATechLogoMark } from "@/components/assets/logos";
import { cn } from "@/lib/utils";
import { useKiosk } from "./kiosk-context";

/**
 * Simplified kiosk-aware header shared by the quiz and membership apply
 * layouts (no nav, no footer on either page).
 *
 * The right-side logo is the kiosk toggle: a real button rendered only on
 * desktop portrait screens (`lg:portrait:`), while smaller viewports keep
 * the decorative brand mark. While kiosk display is enforced, the outbound
 * back link is hidden — the logo toggle is the staff exit path.
 */
export function KioskHeader({
  backHref,
  backLabel,
  headerClassName,
}: {
  backHref: string;
  backLabel: string;
  headerClassName: string;
}) {
  const { isKiosk, isKioskEnforced, toggle } = useKiosk();

  return (
    <header className={headerClassName}>
      <div className="flex w-full max-w-6xl items-center justify-between">
        {!isKioskEnforced && (
          <Button variant="ghost" size="sm" className="gap-2" asChild>
            <Link
              href={backHref}
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">{backLabel}</span>
            </Link>
          </Button>
        )}

        {/* Decorative brand everywhere except desktop portrait, where the
            toggle below takes this slot. */}
        <div
          aria-hidden="true"
          className="pointer-events-none opacity-60 select-none lg:portrait:hidden"
        >
          <ISATechLogoMark />
        </div>

        {/* Desktop-portrait only: click enters fullscreen + kiosk display,
            click again exits both. `ml-auto` keeps it right-aligned when
            the back link is hidden. */}
        <button
          type="button"
          onClick={toggle}
          aria-pressed={isKiosk}
          aria-label={isKiosk ? "Exit kiosk mode" : "Enter kiosk mode"}
          title={isKiosk ? "Exit kiosk mode" : "Enter kiosk mode"}
          className={cn(
            "focus-visible:ring-secondary ml-auto hidden cursor-pointer rounded-md opacity-60 transition-opacity select-none hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:outline-none lg:portrait:block",
            isKiosk && "ring-secondary opacity-100 ring-2",
          )}
        >
          <ISATechLogoMark aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
