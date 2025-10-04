import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware for Next.js Application
 *
 * This middleware implements:
 * - Strict Content Security Policy (CSP) with nonce-based script execution
 * - Security headers for enhanced protection
 * - Request tracking and logging capabilities
 *
 * The nonce is generated per-request and passed to the layout via headers
 * to enable inline scripts while maintaining strict CSP.
 */
export function middleware(request: NextRequest) {
  // Generate a unique nonce for this request using globalThis for explicit global access
  const nonce = Buffer.from(globalThis.crypto.randomUUID()).toString("base64");

  // Define a strict Content Security Policy
  // In development, we need 'unsafe-eval' for React Fast Refresh
  const isDevelopment = process.env.NODE_ENV === "development";

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'wasm-unsafe-eval' ${isDevelopment ? "'unsafe-eval'" : ""} https://challenges.cloudflare.com https://www.youtube.com https://s.ytimg.com https://cdn.jsdelivr.net https://va.vercel-scripts.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://www.notion.so https://prod-files-secure.s3.us-west-2.amazonaws.com https://images.unsplash.com;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' https://challenges.cloudflare.com https://api.notion.com https://vitals.vercel-analytics.com https://va.vercel-scripts.com https://*.vercel-insights.com https://*.vercel-analytics.com;
    frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://challenges.cloudflare.com https://www.openstreetmap.org;
    worker-src 'self' blob:;
    child-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${isDevelopment ? "" : "upgrade-insecure-requests;"}
    ${isDevelopment ? "" : "block-all-mixed-content;"}
  `;

  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  // Additional security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );

  // Only enable HSTS in production to avoid issues in local development
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  return response;
}

/**
 * Configure which routes the middleware should run on
 *
 * This matcher excludes static files, images, and Next.js internal routes
 * for better performance while maintaining security on all application routes.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap files (public assets)
     * - assets directory (images, fonts, etc.)
     */
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|sitemap-.*\\.xml|assets).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
