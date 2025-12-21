import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ISATechLogoMark } from "@/components/assets/logos";

/**
 * Quiz Layout - Simplified header without navigation, no footer
 */
export default function QuizLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Simplified Header */}
      <header className="sticky top-0 z-90 flex items-center justify-center border-b border-border/50 bg-background/80 px-6 py-3 backdrop-blur-md">
        <div className="flex w-full max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Button>
          </Link>

          <Link href="/">
            <ISATechLogoMark />
          </Link>
        </div>
      </header>

      {/* Main Content - No Footer */}
      {children}
    </>
  );
}
