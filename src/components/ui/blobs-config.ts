/**
 * Blob config factory + type — intentionally NOT a `"use client"` module:
 * several blob consumers are server components that call `createBlobConfig`
 * at render time, which is illegal for values imported across a client
 * boundary. `BlobsAnimatedBackground` (client) re-exports the type.
 */

export interface BlobsConfig {
  id: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  animateX: number[];
  animateY: number[];
  duration: number;
  repeatType?: "loop" | "reverse" | "mirror";
  colorClass: string;
  sizeClass?: string;
  blurClass?: string;
}

/**
 * Factory for blob configs — the previous call sites each copy-pasted the
 * same `sizeClass`/`blurClass`/animation defaults with only id, position and
 * color varying. Defaults mirror the common usage; pass values to override.
 */
export function createBlobConfig(config: {
  id: string;
  colorClass: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  animateX?: number[];
  animateY?: number[];
  duration?: number;
  sizeClass?: string;
  blurClass?: string;
}): BlobsConfig {
  return {
    id: config.id,
    colorClass: config.colorClass,
    top: config.top,
    bottom: config.bottom,
    left: config.left,
    right: config.right,
    animateX: config.animateX ?? [0, 20, 0],
    animateY: config.animateY ?? [0, 30, 0],
    duration: config.duration ?? 8,
    sizeClass: config.sizeClass ?? "h-96 w-96",
    blurClass: config.blurClass ?? "blur-[100px]",
  };
}
