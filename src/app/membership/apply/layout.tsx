import { Toaster } from "@/components/ui/sonner";
import { OverlayScrollbarsProvider } from "@/components/common/overlay-scrollbars-provider";
import { ScrollActivityIndicator } from "@/components/common/scroll-activity-indicator";
import { RotateGuard } from "@/components/common";
import { KioskHeader, KioskProvider } from "@/components/kiosk";

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
    <KioskProvider>
      <div className="flex h-svh flex-col overflow-hidden">
        {/* Sticky Simplified Header — fixed h-16 so the mobile progress
            bar's sticky offset is exact. The right-side logo toggles kiosk
            mode on desktop portrait screens (see `components/kiosk`). */}
        <KioskHeader
          backHref="/membership"
          backLabel="Back to Membership"
          headerClassName="border-border/50 bg-background/80 sticky top-0 z-90 flex h-16 shrink-0 items-center justify-center border-b px-6 backdrop-blur-md"
        />

        {/* Main Content - No Footer; fixed height chain */}
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <RotateGuard />
        <Toaster />
        <OverlayScrollbarsProvider />
        <ScrollActivityIndicator />
      </div>
    </KioskProvider>
  );
}
