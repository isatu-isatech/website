import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ISATechLogoMark } from "@/components/assets/logos";
import { Toaster } from "@/components/ui/sonner";
import { OverlayScrollbarsProvider } from "@/components/common/overlay-scrollbars-provider";
import { ScrollActivityIndicator } from "@/components/common/scroll-activity-indicator";
import { RotateGuard } from "@/components/common";

/**
 * Membership Apply Layout - simplified header without navigation, no footer.
 *
 * The header is sticky so the brand + back action stay reachable while the
 * (naturally scrolling) application page is read. The page uses the same
 * OverlayScrollbars custom scrollbar as the rest of the site.
 */
export default function MembershipApplyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Contained app shell at every width: fixed viewport, nothing scrolls
    // except the form pane. svh (not dvh) so mobile toolbars don't make
    // the shell jump.
    <div className="flex h-svh flex-col overflow-hidden">
      {/* Sticky Simplified Header — fixed h-16 so the mobile progress
          bar's sticky offset is exact. */}
      <header className="border-border/50 bg-background/80 sticky top-0 z-90 flex h-16 shrink-0 items-center justify-center border-b px-6 backdrop-blur-md">
        <div className="flex w-full max-w-6xl items-center justify-between">
          <Link
            href="/membership"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
          >
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Back to Membership</span>
            </Button>
          </Link>

          <div
            aria-hidden="true"
            className="pointer-events-none opacity-60 select-none"
          >
            <ISATechLogoMark />
          </div>
        </div>
      </header>

      {/* Main Content - No Footer; fixed height chain */}
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <RotateGuard />
      <Toaster />
      <OverlayScrollbarsProvider />
      <ScrollActivityIndicator />
    </div>
  );
}
