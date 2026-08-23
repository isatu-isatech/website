"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Button } from "@/components/ui/button";
import YouTubePlayer from "@/components/ui/youtube-player";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CountUpComponent } from "@/components/common";
import { HERO_STATS, SITE_CONFIG } from "@/lib/constants/site";

// Curated library of org videos — one is picked per visit (variety for returning
// visitors). Always ambient: muted autoplay, no controls, no fullscreen, no
// keyboard control (FR-009/FR-010). The user is never given manual control of
// the hero player.
const HeroYoutubeVideos: readonly string[] = [
  "ZuaelmDnU5w", // Office Showcase 2025
  "wZgTdPMMve8", // ISATech 2024 Teaser
  "qUC_RJRLAnE", // Codelympics 2024 Day 3
  "ahHdHX80lYQ", // Codelympics 2024 Day 2
  "qPGHid_8q2Q", // Codelympics 2024 Day 1
  "Hy5PPhihZZc", // ISATech 2023 Teaser
];

export function HomepageHeroSection() {
  const reduceMotion = useReducedMotion();

  // Parallax: the video translates up slower than the content does on scroll, so
  // it appears to stay in place while the foreground rolls over it. The wrapper
  // is oversized (top:-25%, h:150%) so the drift never exposes a gap. Reduced
  // motion disables the drift entirely.
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const videoTranslate = useTransform(scrollYProgress, (value) =>
    reduceMotion ? "0%" : `${(value * 25).toFixed(2)}%`,
  );

  // Randomize client-side only. The player stays unmounted during SSR/hydration
  // (videoId = null) so the randomized src can never mismatch the server HTML —
  // the branded loading frame covers the gap until the pick lands. The ref guard
  // makes the pick idempotent under React Strict Mode's double-invoked effects.
  const [videoId, setVideoId] = useState<string | null>(null);
  const pickedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pickedRef.current) {
      pickedRef.current =
        HeroYoutubeVideos[Math.floor(Math.random() * HeroYoutubeVideos.length)];
    }
    setVideoId(pickedRef.current);
  }, []);

  const [playerReady, setPlayerReady] = useState(false);

  return (
    <section
      ref={heroRef}
      className="bg-primary relative isolate flex min-h-svh w-full flex-col items-center justify-center overflow-hidden"
      id="hero"
    >
      {/* Branded loading frame — covers the player until it paints; never a blank black box */}
      <div
        className={cn(
          "absolute inset-0 z-0 transition-opacity duration-700 ease-out",
          playerReady ? "pointer-events-none opacity-0" : "opacity-100",
        )}
        aria-hidden="true"
      >
        <div className="from-primary via-primary-foreground/10 to-secondary/40 h-full w-full bg-linear-to-br" />
      </div>

      {/* Ambient background video — parallax layer. Pointer-events disabled; the
          wrapper is oversized and drifts below its rest position on scroll so the
          video appears pinned while the content scrolls past it. */}
      {videoId && (
        <motion.div
          style={{ y: videoTranslate, willChange: "transform" }}
          className="absolute top-[-25%] -z-1 flex h-[150%] w-full items-center justify-center"
        >
          <YouTubePlayer
            videoId={videoId}
            autoPlay
            loop
            mute
            hideControls
            disableKeyboard
            allowFullScreen={false}
            loading="eager"
            onLoad={() => setPlayerReady(true)}
            className="pointer-events-none absolute top-1/2 left-1/2 aspect-video h-full max-w-none min-w-full -translate-x-1/2 -translate-y-1/2"
          />
        </motion.div>
      )}

      {/* Readability veil — soft neutral scrim: subtle at the center so the video
          stays the focal point, stronger at the edges for text/header contrast */}
      <div
        className="to-primary/60 absolute inset-0 z-1 bg-linear-to-b from-black/55 via-black/25"
        aria-hidden="true"
      />

      <div className="z-10 flex w-full flex-1 flex-col items-center justify-center px-6 pt-24 pb-10 md:px-16">
        <div className="flex w-full max-w-7xl">
          <div className="flex w-full flex-col items-center gap-6 text-center lg:items-start lg:justify-start lg:text-start">
            <p className="text-secondary text-caption tracking-[0.35em] uppercase">
              Dream • Innovate • Succeed
            </p>
            <div className="gap-2 px-4 md:px-0">
              <h1 className="leading-tight text-white">
                Welcome to
                <span className="text-secondary block">ISATech Society</span>
              </h1>
              <h5 className="text-white">
                Empowering student founders to achieve their dreams.
              </h5>
              <p className="text-caption mt-2 text-white/80">
                Est. {SITE_CONFIG.foundingYear} · ISAT U
              </p>
            </div>
            <Link href="/membership" className="text-caption">
              <Button variant={"secondary"} size={"lg"}>
                Join ISATech
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* In-hero stats — one continuous glass band (bottom → top) with thin
          divider lines between columns; no per-card glass pills. */}
      <div className="relative z-10 w-full bg-linear-to-t from-black/50 to-transparent px-6 pb-10 md:px-16">
        <div className="relative mx-auto flex w-full max-w-7xl flex-col overflow-hidden sm:flex-row sm:divide-x">
          {HERO_STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduceMotion ? 0 : 0.15 * (index + 1),
                duration: 0.5,
                ease: "easeOut",
              }}
              className="relative flex flex-1 flex-col items-center justify-center gap-1.5 px-2 py-5 sm:py-6"
            >
              <p className="text-secondary text-2xl leading-none font-bold tabular-nums md:text-4xl">
                <CountUpComponent from={0} to={stat.quantity} />+
              </p>
              <p className="text-caption leading-tight text-white/80">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
