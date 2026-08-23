import {
  FooterComponent,
  HeaderComponent,
  HeaderOffset,
} from "@/components/layout";

/**
 * Static pages layout - includes standard header and footer
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
    </>
  );
}
