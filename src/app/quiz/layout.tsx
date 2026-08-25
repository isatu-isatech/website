import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ISATechLogoMark } from "@/components/assets/logos";
import { Toaster } from "@/components/ui/sonner";

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
    <div className="flex h-svh flex-col">
      {/* Simplified Header */}
      <header className="border-border/50 bg-background/80 z-90 flex shrink-0 items-center justify-center border-b px-6 py-3 backdrop-blur-md">
        <div className="flex w-full max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
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

      {/* Main Content - No Footer; fills the remaining viewport height */}
      <div className="min-h-0 flex-1">{children}</div>
      <Toaster />
    </div>
  );
}
