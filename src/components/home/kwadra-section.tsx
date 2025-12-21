"use client";

import { ISATechDecorationLeft } from "@/components/assets/decorations";
import { BlobsAnimatedBackground, BlobsConfig } from "@/components/ui/blobs";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/common";
import Link from "next/link";

export function HomepageKwadraSection() {
  // Configuration for the animated blobs in the background
  const blobsConfig: BlobsConfig[] = [
    {
      id: "default-blob-2",
      top: "-10rem",
      right: "-10rem",
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
      id="kwadra"
    >
      {/* Decorations */}
      <div className="absolute -z-1 flex h-full w-full items-center justify-center">
        <BlobsAnimatedBackground
          className="absolute h-full w-full"
          blobs={blobsConfig}
        />
        <ISATechDecorationLeft className="absolute top-0 left-0 h-auto w-full opacity-10 md:h-full md:w-auto" />
      </div>
      <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-6 md:flex-row">
        {/* Main Image Container */}
        <div className="flex w-full items-center justify-center md:w-1/2">
          <OptimizedImage
            src="/assets/logos/kwadra-tbi.png"
            alt="KWADRA TBI Icon"
            width={1080}
            height={1080}
            className="h-[150px] w-[150px] md:h-[290px] md:w-[290px]"
            sizes="(min-width: 780px) 290px, 150px"
            brandPlaceholder
          />
        </div>
        {/* Section Content Container */}
        <div className="flex w-full flex-col items-center justify-center gap-4 md:w-1/2 md:gap-6">
          <div className="flex w-full flex-col items-center justify-center gap-2 text-center md:items-start md:text-start">
            <h2>What is Kwadra-TBI?</h2>
            <h5>
              The Kwadra-TBI functions as a technology business incubator,
              aiming to commercialize university research into startups and to
              nurture deep technology startups.
            </h5>
          </div>
          <div className="flex w-full items-center justify-center md:justify-start">
            <Link
              href="https://www.facebook.com/KwadraTBI"
              target="_blank"
              className="text-caption"
            >
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
