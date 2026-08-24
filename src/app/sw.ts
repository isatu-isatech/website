/// <reference lib="webworker" />
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist } from "@serwist/sw";
import {
  CacheFirst,
  ExpirationPlugin,
  NetworkFirst,
  NetworkOnly,
  StaleWhileRevalidate,
  type RuntimeCaching,
} from "serwist";

declare global {
  interface WorkerGlobalScope {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

/**
 * Tuned runtime caching for a static marketing site.
 *
 * Replaces serwist's `defaultCache`, which cached every same-origin GET for
 * up to 24h (robots.txt / sitemap.xml / manifest.json freshness) and every
 * cross-origin GET for 1h (YouTube, Turnstile, analytics). Those now fall
 * through to the browser's HTTP cache instead of the service worker.
 *
 * - Build assets are content-hashed → CacheFirst (immutable).
 * - Public images are cached stale-while-revalidate (30 days, bounded).
 * - Navigations and RSC payloads stay NetworkFirst so deployed content is
 *   never more than a timeout away from fresh.
 * - In development everything is NetworkOnly (no stale-asset surprises).
 */
const runtimeCaching: RuntimeCaching[] =
  process.env.NODE_ENV !== "production"
    ? [{ matcher: /.*/i, handler: new NetworkOnly() }]
    : [
        // Google-hosted fonts — long-lived, few entries.
        {
          matcher: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
          handler: new CacheFirst({
            cacheName: "google-fonts",
            plugins: [
              new ExpirationPlugin({
                maxEntries: 8,
                maxAgeSeconds: 365 * 24 * 60 * 60,
                maxAgeFrom: "last-used",
              }),
            ],
          }),
        },
        // Self-hosted font files.
        {
          matcher: /\.(?:woff2?|ttf|otf|eot)$/i,
          handler: new CacheFirst({
            cacheName: "static-fonts",
            plugins: [
              new ExpirationPlugin({
                maxEntries: 16,
                maxAgeSeconds: 30 * 24 * 60 * 60,
                maxAgeFrom: "last-used",
              }),
            ],
          }),
        },
        // Content-hashed build output — immutable by design.
        {
          matcher: /\/_next\/static\/.+\.(?:js|css)$/i,
          handler: new CacheFirst({
            cacheName: "build-assets",
            plugins: [
              new ExpirationPlugin({
                maxEntries: 128,
                maxAgeSeconds: 30 * 24 * 60 * 60,
                maxAgeFrom: "last-used",
              }),
            ],
          }),
        },
        // Public images (large ones are deliberately NOT precached — they
        // land here on first use instead, keeping the install light).
        {
          matcher: /\.(?:png|jpe?g|gif|svg|webp|avif|ico)$/i,
          handler: new StaleWhileRevalidate({
            cacheName: "static-images",
            plugins: [
              new ExpirationPlugin({
                maxEntries: 128,
                maxAgeSeconds: 30 * 24 * 60 * 60,
                maxAgeFrom: "last-used",
              }),
            ],
          }),
        },
        // next/image optimized responses.
        {
          matcher: /\/_next\/image\?url=.+$/i,
          handler: new StaleWhileRevalidate({
            cacheName: "next-image",
            plugins: [
              new ExpirationPlugin({
                maxEntries: 128,
                maxAgeSeconds: 30 * 24 * 60 * 60,
                maxAgeFrom: "last-used",
              }),
            ],
          }),
        },
        // App Router route data.
        {
          matcher: /\/_next\/data\/.+\/.+\.json$/i,
          handler: new NetworkFirst({
            cacheName: "next-data",
            plugins: [
              new ExpirationPlugin({
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60,
                maxAgeFrom: "last-used",
              }),
            ],
            networkTimeoutSeconds: 10,
          }),
        },
        // RSC payloads for client-side navigations.
        {
          matcher: ({ request, url: { pathname }, sameOrigin }) =>
            request.headers.get("RSC") === "1" &&
            sameOrigin &&
            !pathname.startsWith("/api/"),
          handler: new NetworkFirst({
            cacheName: "pages-rsc",
            plugins: [
              new ExpirationPlugin({
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60,
              }),
            ],
          }),
        },
        // Document navigations — fresh HTML wins; precache is the fallback.
        {
          matcher: ({ request }) => request.mode === "navigate",
          handler: new NetworkFirst({
            cacheName: "pages",
            networkTimeoutSeconds: 3,
          }),
        },
        // Everything else (robots/sitemap/manifest + all cross-origin):
        // leave to the browser cache.
        {
          matcher: /.*/i,
          method: "GET",
          handler: new NetworkOnly(),
        },
      ];

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching,
});
