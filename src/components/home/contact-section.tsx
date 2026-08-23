"use client";

import { Button } from "@/components/ui/button";
import { TopographyTexture } from "@/components/texture/topography";
import Link from "next/link";

export function HomepageContactSection() {
  return (
    <section
      className="flex w-full flex-col items-center justify-center px-4 py-16 sm:px-6 md:px-8 lg:px-12 lg:py-28 xl:px-16 2xl:px-20"
      id="contact"
    >
      <div className="bg-primary relative flex w-full max-w-7xl flex-col items-center justify-center gap-4 rounded-2xl px-4 py-8 sm:gap-6 sm:rounded-3xl">
        {/* Decorations */}
        <div className="pointer-events-none absolute flex h-full w-full items-center justify-center">
          <TopographyTexture className="absolute inset-0 h-full w-full opacity-10" />
        </div>
        <div className="text-primary-foreground flex flex-col text-center">
          <h2>Let&apos;s dream big!</h2>
          <h6>Got an idea? Let&apos;s make it happen.</h6>
        </div>
        <Link href="/contact" className="text-caption z-1">
          <Button variant={"secondary"} size={"lg"}>
            Contact Us
          </Button>
        </Link>
      </div>
    </section>
  );
}
