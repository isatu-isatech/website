"use client";

import { ISATechDecorationRight } from "@/components/assets/decorations";
import { ISATechLogoMark } from "@/components/assets/logos";
import { BlobsAnimatedBackground, BlobsConfig } from "@/components/ui/blobs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HomepageAboutSection() {
  // Configuration for the animated blobs in the background
  const blobsConfig: BlobsConfig[] = [
    {
      id: "default-blob-2",
      top: "-10rem",
      left: "-10rem",
      animateX: [0, -30, 0],
      animateY: [0, -40, 0],
      duration: 6,
      colorClass: "bg-secondary/60",
      sizeClass: "h-96 w-96",
      blurClass: "blur-[100px]",
    },
  ];

  return (
    <section
      className="relative flex w-full flex-col items-center justify-center px-6 py-16 lg:px-16 lg:py-28"
      id="about"
    >
      {/* Decorations */}
      <div className="absolute -z-1 flex h-full w-full items-center justify-center">
        <BlobsAnimatedBackground
          className="absolute h-full w-full"
          blobs={blobsConfig}
        />
        <ISATechDecorationRight className="absolute top-0 right-0 h-full w-auto opacity-10" />
      </div>
      <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-6 md:flex-row-reverse">
        {/* Main Image Container */}
        <div className="flex w-full items-center justify-center md:w-1/2">
          <ISATechLogoMark className="z-1 h-[150px] w-[100px] md:h-[270px] md:w-[185px]" />
        </div>
        {/* Section Content Container */}
        <div className="flex w-full flex-col items-center justify-center gap-4 md:w-1/2 md:gap-6">
          <div className="flex w-full flex-col items-center justify-center gap-2 text-center md:items-end md:text-end">
            <h2>What is ISATech Society?</h2>
            <h5 className="text-center lg:text-right">
              ISATech is a special interest organization operating under the
              Intellectual Property Management Office (IPMO) and the Kwadra
              Technology Business Incubator (Kwadra-TBI).
            </h5>
          </div>
          <div className="flex w-full items-center justify-center md:justify-end">
            <Link href="/about" className="text-caption">
              <Button variant={"default"} size={"lg"}>
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
