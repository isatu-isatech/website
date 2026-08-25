import {
  FooterComponent,
  HeaderComponent,
  HeaderOffset,
} from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";
import { ScrollActivityIndicator } from "@/components/common/scroll-activity-indicator";
import { OverlayScrollbarsProvider } from "@/components/common/overlay-scrollbars-provider";

/**
 * Static pages layout - includes standard header and footer.
 *
 * Hosts the page chrome that only makes sense on scrollable marketing pages
 * (not the full-viewport quiz): the custom body scrollbar + scroll-activity
 * indicator, and the toast viewport. The page-transition wipe lives in the
 * ROOT layout so it survives the static ⇄ quiz layout swap mid-transition.
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
      {children}
      <FooterComponent />
      <Toaster />
      <ScrollActivityIndicator />
      <OverlayScrollbarsProvider />
    </>
  );
}
