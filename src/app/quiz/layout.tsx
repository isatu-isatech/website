import { Toaster } from "@/components/ui/sonner";
import { RotateGuard } from "@/components/common";
import { KioskHeader, KioskProvider } from "@/components/kiosk";

/**
 * Quiz Layout - Simplified header without navigation, no footer.
 *
 * The layout fills exactly one screen (`h-svh` flex column): the header
 * takes its natural height and the page content (`flex-1 min-h-0`) occupies
 * the remaining viewport, so the quiz always fits height and width of the
 * screen. Content too tall for the viewport scrolls inside the quiz area
 * (see the page's `overflow-y-auto`), never on the document itself.
 */
export default function QuizLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <KioskProvider>
      <div className="flex h-svh flex-col">
        {/* Simplified Header — the right-side logo toggles kiosk mode on
            desktop portrait screens (see `components/kiosk`). */}
        <KioskHeader
          backHref="/"
          backLabel="Back to Home"
          headerClassName="border-border/50 bg-background/80 z-90 flex shrink-0 items-center justify-center border-b px-6 py-3 backdrop-blur-md"
        />

        {/* Main Content - No Footer; fills the remaining viewport height */}
        <div className="min-h-0 flex-1">{children}</div>
        <RotateGuard />
        <Toaster />
      </div>
    </KioskProvider>
  );
}
