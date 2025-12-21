import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Note: This is where you point to your service worker file
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
      "date-fns",
    ],
  },
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default bundleAnalyzer(withSerwist(nextConfig));
