import { NextResponse } from "next/server";

function makeNonce() {
  // Prefer Web Crypto's randomUUID when available (Edge runtime). Fallback to
  // a pseudo-random string in environments without it.
  const globalWithCrypto = globalThis as unknown as { crypto?: unknown };
  const globalCrypto = globalWithCrypto.crypto as
    | undefined
    | { randomUUID?: () => string };

  const hasRandomUUID =
    typeof globalCrypto !== "undefined" &&
    typeof globalCrypto.randomUUID === "function";

  const rnd = hasRandomUUID
    ? globalCrypto!.randomUUID!()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

  // Base64 encode the UUID-like string when Buffer is available (Node).
  if (typeof Buffer !== "undefined") {
    return Buffer.from(rnd).toString("base64");
  }
  // Fallback to btoa in browser-like runtimes
  if (typeof btoa !== "undefined") {
    return btoa(rnd);
  }
  return rnd;
}

export function middleware(request: Request) {
  // Generate a per-request nonce and attach it to the request headers so
  // server components can read and apply it to inline <script nonce="..."> tags.
  const nonce = makeNonce();

  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http: https://challenges.cloudflare.com https://www.youtube.com https://s.ytimg.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https: blob:;
    font-src 'self' data:;
    connect-src 'self' https://challenges.cloudflare.com https://api.notion.com https://vitals.vercel-analytics.com;
    frame-src https://www.youtube.com https://www.youtube-nocookie.com https://challenges.cloudflare.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    worker-src 'self' blob:;
    upgrade-insecure-requests;
  `
    .replace(/\s+/g, " ")
    .trim();

  // Prepare modified request headers forwarded to the app
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  // Build NextResponse with modified request headers so server components can
  // access the nonce via next/headers().get('x-nonce')
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set security response headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Content-Security-Policy", csp);
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
