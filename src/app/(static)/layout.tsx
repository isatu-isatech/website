import { Poppins, Chivo } from "next/font/google";
import "@/app/globals.css";
import FooterComponent from "@/components/footer";
import HeaderComponent from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsentProvider } from "@/components/cookie-consent";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const chivo = Chivo({
  variable: "--font-chivo",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${chivo.variable} antialiased`}>
        <CookieConsentProvider>
          <HeaderComponent />
          {children}
          <FooterComponent />
          <Toaster />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
