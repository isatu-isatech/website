"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { useCookieConsent } from "../cookie-consent";

declare global {
  interface Window {
    YT: typeof YT | undefined;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

let ytApiReady: Promise<typeof window.YT> | null = null;

function loadYouTubeAPI(): Promise<typeof window.YT> {
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }
  if (ytApiReady) {
    return ytApiReady;
  }

  ytApiReady = new Promise((resolve, reject) => {
    window.onYouTubeIframeAPIReady = () => {
      resolve(window.YT!);
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.onerror = () => reject(new Error("Failed to load YouTube API"));
    document.body.appendChild(tag);
  });
  return ytApiReady;
}

interface YouTubePlayerProps {
  videoId: string;
  height?: string;
  width?: string;
  autoPlay?: boolean;
  hideControls?: boolean;
  mute?: boolean;
  loop?: boolean;
  title?: string;
  playerVars?: Omit<
    YT.PlayerVars,
    "autoplay" | "mute" | "loop" | "playsinline" | "playlist" | "controls"
  >;
  events?: Partial<YT.Events>;
  className?: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  height = "390",
  width = "640",
  autoPlay = false,
  hideControls = false,
  mute = false,
  loop = false,
  title = "YouTube video player",
  playerVars,
  events,
  className,
}) => {
  const { acceptedCategories } = useCookieConsent();
  const canPlayVideo = acceptedCategories.includes("analytics");

  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState(false);

  const mergedPlayerVars = useMemo<YT.PlayerVars>(
    () => ({
      playsinline: 1,
      autoplay: autoPlay ? 1 : 0,
      controls: hideControls ? 0 : 1,
      mute: mute ? 1 : 0,
      loop: loop ? 1 : 0,
      playlist: loop ? videoId : undefined,
      ...playerVars,
    }),
    [autoPlay, hideControls, mute, loop, playerVars, videoId],
  );

  useEffect(() => {
    if (!canPlayVideo) return; // <-- Do not proceed if consent is not given

    let isMounted = true;

    loadYouTubeAPI()
      .then((YT) => {
        if (!isMounted || !containerRef.current) return;

        playerRef.current = new YT.Player(containerRef.current, {
          height,
          width,
          videoId,
          playerVars: mergedPlayerVars,
          events: {
            ...events,
            onError: (e) => {
              console.error("YouTube Player Error:", e);
              setError(true);
              events?.onError?.(e);
            },
          },
        });
      })
      .catch((err: Error) => {
        console.error("YouTube API failed to load:", err);
        if (isMounted) setError(true);
      });

    return () => {
      isMounted = false;
      playerRef.current?.destroy();
    };
  }, [videoId, height, width, mergedPlayerVars, events, canPlayVideo]);

  if (!canPlayVideo || error) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <p className="text-gray-500">
          {error
            ? "Error loading video. Please try again later."
            : "Video playback is disabled due to cookie consent settings."}
        </p>
        <div className="absolute inset-0 bg-gray-200 opacity-50" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      title={title}
      role="region"
      aria-label={title}
      className={className}
    />
  );
};

export default YouTubePlayer;
