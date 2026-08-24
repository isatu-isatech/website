import {
  FooterComponent,
  HeaderComponent,
  HeaderOffset,
} from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";
import { PageTransition } from "@/components/common/page-transition";
import { ScrollActivityIndicator } from "@/components/common/scroll-activity-indicator";
import { OverlayScrollbarsProvider } from "@/components/common/overlay-scrollbars-provider";

/**
 * Static pages layout - includes standard header and footer.
 *
 * Also hosts the page chrome that only makes sense on scrollable marketing
 * pages (not the full-viewport quiz): the page-transition wipe, the custom
 * body scrollbar + scroll-activity indicator, and the toast viewport.
 */
export default function StaticLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderComponent />
      <HeaderOffset />
      <PageTransition>{children}</PageTransition>
      <FooterComponent />
      <Toaster />
      <ScrollActivityIndicator />
      <OverlayScrollbarsProvider />
    </>
  );
}
