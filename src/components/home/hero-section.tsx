"use client";

import { Button } from "@/components/ui/button";
import YouTubePlayer from "@/components/ui/youtube-player";
import Link from "next/link";

const HeroYoutubeVideos: string[] = [
  // List of YouTube video IDs for the hero section
  "ZuaelmDnU5w", // Office Showcase 2025
  "wZgTdPMMve8", // ISATech 2024 Teaser
  "qUC_RJRLAnE", // Codelympics 2024 Day 3
  "ahHdHX80lYQ", // Codelympics 2024 Day 2
  "qPGHid_8q2Q", // Codelympics 2024 Day 1
  // "k1vucCBXty8", // Codelypics 2024 Teaser
  // "Z9VmqP2JvXA", // ISATech 2023 U-Week Teaser
  "Hy5PPhihZZc", // ISATech 2023 Teaser
];

export function HomepageHeroSection() {
  return (
    <section
      className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-black/50"
      id="hero"
    >
      <div className="absolute -z-1 flex h-full w-full items-center justify-center">
        <YouTubePlayer
          videoId={
            HeroYoutubeVideos[
              Math.floor(Math.random() * HeroYoutubeVideos.length)
            ]
          }
          autoPlay
          loop
          mute
          hideControls
          className="pointer-events-none absolute aspect-video h-auto w-5xl lg:w-lvw"
        />
      </div>
      <div className="flex w-full items-center justify-center px-6 py-28 md:px-16">
        <div className="flex w-full max-w-6xl">
          <div className="flex w-full flex-col items-center gap-6 text-center lg:items-start lg:justify-start lg:text-start">
            <div className="gap-2 px-4 md:px-0">
              <div>
                <h1 className="leading-tight text-white">Welcome to</h1>
                <h1 className="text-secondary leading-tight">
                  ISATech Society
                </h1>
              </div>
              <h5 className="text-white">
                Empowering student founders to achieve their dreams.
              </h5>
            </div>
            <Link href="/about" className="text-caption">
              <Button variant={"secondary"} size={"lg"}>
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
