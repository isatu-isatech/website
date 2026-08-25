import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ISATechLogoMark } from "@/components/assets/logos";
import { Toaster } from "@/components/ui/sonner";
import { OverlayScrollbarsProvider } from "@/components/common/overlay-scrollbars-provider";
import { ScrollActivityIndicator } from "@/components/common/scroll-activity-indicator";

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
    <div className="flex min-h-svh flex-col">
      {/* Sticky Simplified Header */}
      <header className="border-border/50 bg-background/80 sticky top-0 z-90 flex shrink-0 items-center justify-center border-b px-6 py-3 backdrop-blur-md">
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

          <Link href="/">
            <ISATechLogoMark />
          </Link>
        </div>
      </header>

      {/* Main Content - No Footer; page scrolls naturally */}
      <div className="flex-1">{children}</div>
      <Toaster />
      <OverlayScrollbarsProvider />
      <ScrollActivityIndicator />
    </div>
  );
}
