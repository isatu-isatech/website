"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

// List of navigation links
// This can be extended or modified as needed; Max of 5.
// If more links are needed, consider redesigning the header layout.
const navLinks: { label: string; href: string }[] = [
  { label: "Achievements", href: "/" },
  { label: "Contact Us", href: "/" },
  { label: "About Us", href: "/" },
];

export default function Header() {
  return (
<<<<<<< HEAD
    // <div className="border-b-grey-100 sticky top-0 flex items-center justify-center border-b bg-white/65 px-6 py-2 shadow-xs shadow-black/5 backdrop-blur-xs lg:px-8 xl:px-16">
    //   <div className="flex w-full max-w-6xl items-center justify-between">
    //     <Link href="/">
    //       <Image
    //         src="/assets/isatech-dark.svg"
    //         alt="Logo"
    //         width={24}
    //         height={40}
    //       />
    //     </Link>
    //     <div className="flex items-center gap-2 md:gap-2 lg:gap-4">
    //       <div className="hidden items-center gap-1 md:flex">
    //         <Button asChild variant={"ghost"} size={"sm"}>
    //           <Link href="/">
    //             <p className="text-caption">Achievements</p>
    //           </Link>
    //         </Button>
    //         <Button asChild variant={"ghost"} size={"sm"}>
    //           <Link href="/">
    //             <p className="text-caption">Contact Us</p>
    //           </Link>
    //         </Button>
    //         <Button asChild variant={"ghost"} size={"sm"}>
    //           <Link href="/">
    //             <p className="text-caption">About Us</p>
    //           </Link>
    //         </Button>
    //       </div>
    //       <div className="flex items-center gap-2">
    //         <Button asChild variant={"default"} size={"lg"}>
    //           <Link href="/">
    //             <p className="text-caption">Join Now</p>
    //           </Link>
    //         </Button>
    //         <Button asChild className="md:hidden" variant={"outline"}>
    //           <Link href="/">
    //             <Menu />
    //           </Link>
    //         </Button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="border-b-grey-100 sticky top-0 z-90 flex items-center justify-center border-b bg-white/65 px-6 py-2 shadow-xs shadow-black/5 backdrop-blur-xs lg:px-8 xl:px-16">
=======
    <div className="border-b-grey-100 sticky top-0 z-99 flex items-center justify-center border-b bg-white/65 px-6 py-2 shadow-xs shadow-black/5 backdrop-blur-xs lg:px-8 xl:px-16">
>>>>>>> bd134f2265533a2d6a5a8e9324b6f4f2721f4fb9
      <div className="flex w-full max-w-6xl items-center justify-between">
        <Link href="/">
          <Image
            src="/assets/isatech-icon-dark.svg"
            alt="Logo"
            width={24}
            height={40}
          />
        </Link>
        <div className="flex items-center gap-2 md:gap-2 lg:gap-4">
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Button asChild variant={"ghost"} size={"sm"} key={link.label}>
                <Link href={link.href}>
                  <p className="text-caption">{link.label}</p>
                </Link>
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant={"default"}
              size={"lg"}
              className="hidden md:flex"
            >
              <Link href="/">
                <p className="text-caption">Join Now</p>
              </Link>
            </Button>
            <Button
              asChild
              variant={"default"}
              size={"sm"}
              className="md:hidden"
            >
              <Link href="/">
                <p className="text-caption">Join Now</p>
              </Link>
            </Button>
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
                <div className="flex flex-col items-start gap-1 px-2">
                  {navLinks.map((link) => (
                    <Link
                      href={link.href}
                      className="w-full px-2 py-1"
                      key={link.label}
                    >
                      <p className="text-caption">{link.label}</p>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
