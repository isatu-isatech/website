"use client";

import React from "react";

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
  className,
}) => {
  const params = [
    `autoplay=${autoPlay ? 1 : 0}`,
    `controls=${hideControls ? 0 : 1}`,
    `mute=${mute ? 1 : 0}`,
    `loop=${loop ? 1 : 0}`,
    ...(loop ? [`playlist=${videoId}`] : []),
    "playsinline=1",
  ].join("&");

  return (
    <div className={className}>
      <iframe
        className={className ? `${className} border-0` : "border-0"}
        width={width}
        height={height}
        src={`https://www.youtube-nocookie.com/embed/${videoId}?${params}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
};

export default YouTubePlayer;
