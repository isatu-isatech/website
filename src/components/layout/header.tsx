"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ISATechLogoMark } from "@/components/assets/logos";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * ################################################################################
 * ################################### COMPONENT ##################################
 * ################################################################################
 */
export default function HeaderComponent() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [previousPathname, setPreviousPathname] = useState(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes (links inside it navigate
  // away, but the dialog itself would otherwise stay open).
  if (previousPathname !== pathname) {
    setPreviousPathname(pathname);
    setMenuOpen(false);
  }

  // Over the hero (homepage, top of page) the header blends into the hero's brand
  // surface; as soon as the user scrolls it detaches into a solid fixed bar.
  const overHero = pathname === "/" && !scrolled;

  // Widened copy so `pathname` narrowing (from the overHero check) doesn't break
  // the literal comparisons below.
  const currentPath: string = pathname;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-90 flex items-center justify-center px-6 transition-all duration-300 lg:px-8 xl:px-16",
        overHero
          ? "bg-transparent py-4"
          : "bg-white/25 py-2 shadow-xs shadow-black/5 backdrop-blur-xs",
      )}
    >
      <div className="flex w-full max-w-7xl items-center justify-between">
        <Link href="/" aria-label="ISATech Society — Home">
          <ISATechLogoMark lightMode={overHero} className="h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-2 md:gap-2 lg:gap-4">
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.filter(
              (link) => link.href !== "/" && link.href !== "/membership",
            ).map((link) => (
              <Link
                href={link.href}
                key={link.label}
                aria-current={currentPath === link.href ? "page" : undefined}
              >
                <Button
                  variant="ghost"
                  size={"sm"}
                  className={cn(
                    "relative",
                    overHero &&
                      currentPath !== link.href &&
                      "text-white hover:bg-white/10 hover:text-white",
                  )}
                >
                  <p className="text-caption">{link.label}</p>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "bg-secondary absolute inset-x-3 bottom-1 h-0.5 rounded-full transition-opacity duration-300",
                      currentPath === link.href ? "opacity-100" : "opacity-0",
                    )}
                  />
                </Button>
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/membership">
              <Button
                variant={overHero ? "secondary" : "default"}
                size={"lg"}
                className="hidden md:flex"
              >
                <p className="text-caption">Join Now</p>
              </Button>
            </Link>
            <Link href="/membership">
              <Button
                variant={overHero ? "secondary" : "default"}
                size={"sm"}
                className="md:hidden"
              >
                <p className="text-caption">Join Now</p>
              </Button>
            </Link>
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className={cn(
                    "md:hidden",
                    overHero &&
                      "border-white/40 text-white hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent className="z-100">
                <SheetHeader>
                  {/* This title is hidden but can be used for accessibility; Error occurs without this, don't ask why lol */}
                  <SheetTitle className="hidden">Navigation Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col items-start gap-4 px-2">
                  {NAV_LINKS.filter(
                    (link) => link.href !== "/" && link.href !== "/membership",
                  ).map((link) => (
                    <Link
                      href={link.href}
                      className={cn(
                        "w-full px-2 py-1",
                        currentPath === link.href &&
                          "text-secondary font-semibold",
                      )}
                      aria-current={
                        currentPath === link.href ? "page" : undefined
                      }
                      key={link.label}
                    >
                      <h3>{link.label}</h3>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
