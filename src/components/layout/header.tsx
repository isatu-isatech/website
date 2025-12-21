"use client";

import Link from "next/link";
import React from "react";
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
import { redirect } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";

/**
 * ################################################################################
 * ################################### COMPONENT ##################################
 * ################################################################################
 */
export default function HeaderComponent() {
  return (
    <header className="border-b-grey-100 sticky top-0 z-90 flex items-center justify-center border-b bg-white/65 px-6 py-2 shadow-xs shadow-black/5 backdrop-blur-xs lg:px-8 xl:px-16">
      <div className="flex w-full max-w-6xl items-center justify-between">
        <Link
          href="/#"
          onContextMenu={(e) => {
            e.preventDefault();
            redirect("/about");
          }}
        >
          <ISATechLogoMark />
        </Link>
        <div className="flex items-center gap-2 md:gap-2 lg:gap-4">
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.filter(
              (link) => link.href !== "/" && link.href !== "/membership",
            ).map((link) => (
              <Link href={`${link.href}#`} key={link.label}>
                <Button variant={"ghost"} size={"sm"}>
                  <p className="text-caption">{link.label}</p>
                </Button>
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/membership#">
              <Button
                variant={"default"}
                size={"lg"}
                className="hidden md:flex"
              >
                <p className="text-caption">Join Now</p>
              </Button>
            </Link>
            <Link href="/membership#">
              <Button variant={"default"} size={"sm"} className="md:hidden">
                <p className="text-caption">Join Now</p>
              </Button>
            </Link>
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant={"outline"} size={"icon"}>
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
                      href={`${link.href}#`}
                      className="w-full px-2 py-1"
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
