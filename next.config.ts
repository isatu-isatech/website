import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Note: This is where you point to your service worker file
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // Keep the first-install cache fill light: the large images (advisers,
  // photos, ogimage) and the 3D model assets are fetched on demand and
  // runtime-cached by the service worker instead of precached up front.
  exclude: [
    /^assets\/advisers\//,
    /^assets\/decorations\/models\//,
    /^assets\/decorations\/.*\.jpg$/,
    /^assets\/decorations\/speaker-collage\.png$/,
    /^assets\/decorations\/hound\.png$/,
    /^assets\/logos\/umwad\.png$/,
    /^assets\/seo\/ogimage\.jpg$/,
  ],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
    // Capped at 1920: 2048/3840 variants × SWR image cache blew up encode
    // cost on 1.4MB sources with no visible gain on this layout.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "www.notion.so" },
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "motion",
      "@react-three/drei",
      "@react-three/fiber",
      "three",
      "@react-three/rapier",
      "meshline",
    ],
  },
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default bundleAnalyzer(withSerwist(nextConfig));
