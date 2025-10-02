import { NextResponse } from "next/server";

export function middleware() {
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  // Only apply strict CSP in production
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Content-Security-Policy",
      `
      default-src 'self';
      script-src 'self' https://challenges.cloudflare.com https://www.youtube.com https://s.ytimg.com 'sha256-OBTN3RiyCV4Bq7dFqZ5a2pAXjnCcCYeTJMO2I/LYKeo=';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https: blob:;
      font-src 'self' data:;
      connect-src 'self' https://challenges.cloudflare.com https://api.notion.com https://vitals.vercel-analytics.com;
      frame-src https://www.youtube.com https://challenges.cloudflare.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      worker-src 'self' blob:;
      upgrade-insecure-requests;
    `
        .replace(/\s+/g, " ")
        .trim(),
    );
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }

  return response;
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
