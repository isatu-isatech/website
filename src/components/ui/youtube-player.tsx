"use client";

import React, { useEffect, useRef, useState } from "react";

type YTWindow = Window & {
  YT?: any;
  onYouTubeIframeAPIReady?: () => void;
};

interface YouTubePlayerProps {
  videoId: string;
  height?: string;
  width?: string;
  autoPlay?: boolean;
  hideControls?: boolean;
  mute?: boolean;
  loop?: boolean;
  title?: string;
  className?: string;
  loading?: "lazy" | "eager";
  disableKeyboard?: boolean;
  onLoad?: () => void;
}

/**
 * Loads the YouTube IFrame Player API once and queues callbacks until it is
 * ready. The Player API (unlike the URL-embed `controls=0` param) produces a
 * truly chromeless player — no control bar and no center play/pause button —
 * which is what the ambient hero background needs (FR-009/FR-010).
 */
let apiReady = false;
const pendingReady: Array<() => void> = [];

function loadYouTubeAPI(callback: () => void): void {
  if (apiReady) {
    callback();
    return;
  }
  pendingReady.push(callback);
  const win = window as YTWindow;
  if (win.YT) {
    apiReady = true;
    pendingReady.splice(0).forEach((cb) => cb());
    return;
  }
  win.onYouTubeIframeAPIReady = () => {
    apiReady = true;
    pendingReady.splice(0).forEach((cb) => cb());
  };
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  tag.async = true;
  document.head.appendChild(tag);
}

const YT_NOCOOKIE_HOST = "https://www.youtube-nocookie.com";

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  autoPlay = false,
  hideControls = false,
  mute = false,
  loop = false,
  title = "YouTube video player",
  className,
  loading = "eager",
  disableKeyboard = false,
  onLoad,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [deferred, setDeferred] = useState(loading === "eager");

  // Ambient player config is intentionally static for a given video; keep the
  // latest prop values in a ref so the player is constructed once per videoId
  // while onReady still sees current props (and the linter sees complete deps).
  const ambientConfigRef = useRef({
    autoPlay,
    hideControls,
    mute,
    loop,
    disableKeyboard,
    onLoad,
  });
  useEffect(() => {
    ambientConfigRef.current = {
      autoPlay,
      hideControls,
      mute,
      loop,
      disableKeyboard,
      onLoad,
    };
  });

  // `loading="lazy"` defers API + player construction until the container
  // nears the viewport; `eager` preserves current hero behavior.
  useEffect(() => {
    if (loading === "eager") {
      setDeferred(true);
      return;
    }
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setDeferred(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setDeferred(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loading]);

  useEffect(() => {
    if (!deferred) return;
    const container = containerRef.current;
    if (!container) return;

    loadYouTubeAPI(() => {
      if (!containerRef.current) return;
      // The API replaces this placeholder element with the sized iframe. It must
      // fill the container or the iframe inherits a zero-height box.
      const host = document.createElement("div");
      host.style.position = "absolute";
      host.style.inset = "0";
      host.style.width = "100%";
      host.style.height = "100%";
      containerRef.current.appendChild(host);

      const cfg = ambientConfigRef.current;

      playerRef.current = new (window as YTWindow).YT.Player(host, {
        videoId,
        width: "100%",
        height: "100%",
        host: YT_NOCOOKIE_HOST,
        playerVars: {
          autoplay: cfg.autoPlay ? 1 : 0,
          controls: cfg.hideControls ? 0 : 1,
          mute: cfg.mute ? 1 : 0,
          loop: cfg.loop ? 1 : 0,
          ...(cfg.loop ? { playlist: videoId } : {}),
          ...(cfg.disableKeyboard ? { disablekb: 1 } : {}),
          // Captions off by default — the ambient video must stay visually quiet.
          cc_load_policy: 0,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (event: any) => {
            if (cfg.mute) {
              event.target.setVolume(0);
              event.target.mute();
            }
            if (cfg.autoPlay) {
              event.target.playVideo();
            }
            cfg.onLoad?.();
          },
        },
      });
    });

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // Props are static for this ambient player; constructed once per videoId.
  }, [videoId, deferred]);

  return (
    <div
      ref={containerRef}
      className={className}
      title={title}
      aria-label={title}
    />
  );
};

export default YouTubePlayer;
