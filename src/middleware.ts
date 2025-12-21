import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware for Next.js Application
 *
 * This middleware implements:
 * - Content Security Policy (CSP) for enhanced security
 * - Security headers for protection against common attacks
 *
 * Note: We use 'unsafe-inline' for scripts because Next.js relies on
 * inline scripts that are difficult to properly nonce. This is the
 * standard approach for Next.js applications.
 */
export function middleware(request: NextRequest) {
  // Define Content Security Policy
  // Detect environment: local dev vs preview vs production
  const isDevelopment = process.env.NODE_ENV === "development";

  // Use 'unsafe-inline' for scripts because Next.js relies on inline scripts
  // that are difficult to properly nonce. This is the standard approach for Next.js apps.
  // Production still maintains strong security through other headers and directives.
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' ${isDevelopment ? "'unsafe-eval'" : ""} https://challenges.cloudflare.com https://va.vercel-scripts.com ${isDevelopment ? "https://vercel.live https://*.vercel.app https://cdn.jsdelivr.net" : ""};
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://www.notion.so https://prod-files-secure.s3.us-west-2.amazonaws.com https://images.unsplash.com ${isDevelopment ? "https://*.githubusercontent.com" : ""};
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://challenges.cloudflare.com https://vitals.vercel-analytics.com https://va.vercel-scripts.com https://*.vercel-insights.com https://*.vercel-analytics.com ${isDevelopment ? "https://vercel.live ws://localhost:* wss://localhost:* http://localhost:* https://localhost:* https://dev.isatech.club https://*.vercel.app" : ""};
    frame-src 'self' https://www.youtube-nocookie.com https://challenges.cloudflare.com https://www.openstreetmap.org;
    media-src 'self' https://www.youtube-nocookie.com;
    worker-src 'self' blob:;
    child-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    manifest-src 'self';
    ${!isDevelopment ? "upgrade-insecure-requests;" : ""}
  `;

  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
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
    "camera=(), microphone=(), geolocation=()",
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
