"use client";

import { BlobsAnimatedBackground, BlobsConfig } from "@/components/ui/blobs";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * ################################################################################
 * ################################### TYPE DEF ###################################
 * ################################################################################
 */
export interface AdviserProps {
  name: string;
  title: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageSize?: string;
}

/**
 * ################################################################################
 * ################################## COMPONENTS ##################################
 * ################################################################################
 */
export default function AboutUsAdvisersSection({
  advisers,
}: {
  advisers: AdviserProps[];
}) {
  const adviserSectionBG: BlobsConfig[] = [
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

  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Set up carousel state and auto-scroll behavior
  useEffect(() => {
    if (!carouselApi) return;

    // Update the current index and total items when carousel changes
    const updateCarouselState = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
      setTotalItems(carouselApi.scrollSnapList().length);
    };

    updateCarouselState();

    // Listen for carousel selection changes
    carouselApi.on("select", updateCarouselState);

    // Automatically scroll to the next item every 12 seconds
    const interval = setInterval(() => {
      carouselApi.scrollTo(
        (carouselApi.selectedScrollSnap() + 1) %
          carouselApi.scrollSnapList().length,
      );
    }, 12000);

    // Cleanup listeners and interval on unmount or carouselApi change
    return () => {
      carouselApi.off("select", updateCarouselState);
      clearInterval(interval);
    };
  }, [carouselApi]);

  const scrollToIndex = (index: number) => {
    carouselApi?.scrollTo(index);
  };

  return (
    <section
      className="relative flex w-full items-center justify-center px-6 py-8 md:py-6 lg:px-16 lg:py-14"
      id="advisers"
    >
      {/* Animated Blobs BG */}
      <BlobsAnimatedBackground
        className="absolute h-full w-full"
        blobs={adviserSectionBG}
      />
      <div className="flex w-full max-w-6xl flex-col gap-6 lg:flex-row">
        <div className="flex w-full flex-col items-center justify-center gap-4 lg:max-w-2xs">
          <h3 className="text-primary text-center md:text-start">
            Meet our ever supportive Advisers
          </h3>
          {/* Large Screen Carousel Controls */}
          <div className="hidden w-full gap-2 lg:flex">
            <Button
              size={"icon"}
              onClick={() => scrollToIndex(currentIndex - 1)}
            >
              <ArrowLeftIcon />
            </Button>
            <Button
              size={"icon"}
              onClick={() => scrollToIndex(currentIndex + 1)}
            >
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
        <div className="flex w-full flex-col gap-4">
          {/* Image Carousel */}
          <Carousel
            setApi={setCarouselApi}
            className="w-full"
            opts={{
              align: "start",
              duration: 20,
              loop: true,
            }}
          >
            <CarouselContent>
              {advisers.map((adviser, idx) => (
                <CarouselItem
                  key={adviser.name + idx}
                  className="select-none md:basis-1/2 lg:basis-1/2 xl:basis-1/3"
                >
                  <div className="bg-accent relative flex h-full flex-col items-center justify-center gap-2 rounded-3xl">
                    <Image
                      src={adviser.image}
                      alt={adviser.name}
                      width={adviser.imageWidth}
                      height={adviser.imageHeight}
                      sizes={adviser.imageSize}
                      className="h-full w-auto rounded-3xl object-cover"
                    />
                    <div className="from-primary to-primary/1 absolute bottom-0 h-3/12 w-full justify-start gap-2 rounded-b-3xl bg-gradient-to-t px-8 py-8 text-white">
                      <p className="text-base font-bold">{adviser.name}</p>
                      <p className="text-sm">{adviser.title}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          {/* Mobile Carousel Controls and Indicators */}
          <div className="flex w-full justify-center gap-2">
            <Button
              size={"icon"}
              className="lg:hidden"
              onClick={() => scrollToIndex(currentIndex - 1)}
            >
              <ArrowLeftIcon />
            </Button>
            <div className="flex w-fit items-center justify-center space-x-2">
              {Array.from({ length: totalItems }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`h-3 w-3 rounded-full ${
                    currentIndex === index ? "bg-primary/80" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
            <Button
              size={"icon"}
              className="lg:hidden"
              onClick={() => scrollToIndex(currentIndex + 1)}
            >
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
