"use client";

// If this file contains errors:
// run `npm i` to install the necessary dependencies.

import React, { useEffect, useRef, useMemo } from "react";

declare global {
  interface Window {
    YT: typeof YT | undefined;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

let ytApiReady: Promise<typeof window.YT> | null = null;

function loadYouTubeAPI(): Promise<typeof window.YT> {
  // If the YouTube API is already loaded, resolve immediately.
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }
  // If a loading process is already underway, return the existing promise.
  if (ytApiReady) {
    return ytApiReady;
  }

  // Otherwise, start loading the YouTube IFrame API.
  ytApiReady = new Promise((resolve, reject) => {
    // This global callback will be called by the YouTube API when it's ready.
    window.onYouTubeIframeAPIReady = () => {
      resolve(window.YT!);
    };
    // Create a script tag to load the YouTube IFrame API.
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    // If the script fails to load, reject the promise.
    tag.onerror = () => reject(new Error("Failed to load YouTube API"));
    // Add the script to the document to start loading.
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
  style?: React.CSSProperties;
}

// The main YouTubePlayer component, typed with the YouTubePlayerProps interface.
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
  style,
}) => {
  // Ref to hold the YouTube Player instance.
  const playerRef = useRef<YT.Player | null>(null);
  // Ref to the container div where the YouTube player will be mounted.
  const containerRef = useRef<HTMLDivElement>(null);
  // State to track if an error occurred.
  const [error, setError] = React.useState(false);

  // Memoize the playerVars object to avoid unnecessary re-renders.
  const mergedPlayerVars = useMemo<YT.PlayerVars>(
    () => ({
      playsinline: 1,
      autoplay: autoPlay ? 1 : 0,
      controls: hideControls ? 0 : 1,
      mute: mute ? 1 : 0,
      loop: loop ? 1 : 0,
      playlist: loop ? videoId : undefined, // Needed for looping a single video.
      ...playerVars,
    }),
    [autoPlay, hideControls, mute, loop, playerVars, videoId],
  );

  // Effect to load the YouTube API and initialize the player.
  useEffect(() => {
    let isMounted = true;

    loadYouTubeAPI()
      .then((YT) => {
        if (!isMounted || !containerRef.current) return;

        // Create a new YouTube Player instance.
        playerRef.current = new YT.Player(containerRef.current, {
          height,
          width,
          videoId,
          playerVars: mergedPlayerVars,
          events: {
            ...events,
            // Handle player errors.
            onError: (e) => {
              console.error("YouTube Player Error:", e);
              setError(true);
              events?.onError?.(e);
            },
          },
        });
      })
      .catch((err: Error) => {
        // Handle API loading errors.
        console.error("YouTube API failed to load:", err);
        setError(true);
      });

    // Cleanup: destroy the player instance on unmount.
    return () => {
      isMounted = false;
      playerRef.current?.destroy();
    };
  }, [videoId, height, width, mergedPlayerVars, events]);

  // Render a fallback UI if an error occurred.
  if (error) {
    return (
      <>
        <div className="h-fit w-fit bg-black"></div>
      </>
    );
  }

  // Render the container div for the YouTube player.
  return (
    <div
      ref={containerRef}
      title={title}
      role="region"
      aria-label={title}
      className={className}
      style={style}
    />
  );
};

export default YouTubePlayer;
