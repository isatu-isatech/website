import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

export const runtime = "edge";

let ratelimit: Ratelimit | null = null;

try {
  ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(20, "1 h"),
  });
} catch {
  // Graceful degradation if Vercel KV is not configured
}

const archetypeColors: Record<string, string> = {
  Hustler: "#F59E0B",
  Hacker: "#3B82F6",
  Hipster: "#EC4899",
  Hound: "#10B981",
};

const archetypeGradients: Record<string, [string, string]> = {
  Hustler: ["#F59E0B", "#EA580C"],
  Hacker: ["#3B82F6", "#4F46E5"],
  Hipster: ["#EC4899", "#9333EA"],
  Hound: ["#10B981", "#0D9488"],
};

export async function GET(request: NextRequest) {
  if (ratelimit) {
    const ip =
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      "127.0.0.1";
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return new Response("Too many requests", { status: 429 });
    }
  }

  const { searchParams } = new URL(request.url);

  const role = searchParams.get("role") || "4H Personality Quiz";
  const archetype = searchParams.get("archetype") || "Hustler";
  const isGeneralist = searchParams.get("generalist") === "true";

  const [gradientStart, gradientEnd] = isGeneralist
    ? ["#8B5CF6", "#7C3AED"]
    : archetypeGradients[archetype] || ["#3B82F6", "#1D4ED8"];

  const primaryColor = isGeneralist
    ? "#8B5CF6"
    : archetypeColors[archetype] || "#3B82F6";

  const ogResponse = new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${gradientStart}22 0%, ${gradientEnd}22 100%)`,
          backgroundColor: "#0f172a",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Background decorations */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${primaryColor}30 0%, transparent 70%)`,
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          {/* Badge circle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
              boxShadow: `0 20px 60px ${primaryColor}50`,
              marginBottom: "32px",
            }}
          >
            <span style={{ fontSize: "80px" }}>
              {isGeneralist
                ? "🌟"
                : archetype === "Hustler"
                  ? "🚀"
                  : archetype === "Hacker"
                    ? "💻"
                    : archetype === "Hipster"
                      ? "🎨"
                      : "🔍"}
            </span>
          </div>

          {/* "I am a..." text */}
          <p
            style={{
              fontSize: "24px",
              color: "#94A3B8",
              marginBottom: "8px",
            }}
          >
            I am a...
          </p>

          {/* Role title */}
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
              backgroundClip: "text",
              color: "transparent",
              margin: "0 0 24px 0",
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            {role}
          </h1>

          {/* Quiz branding */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "32px",
            }}
          >
            <p
              style={{
                fontSize: "20px",
                color: "#64748B",
              }}
            >
              4H Personality Quiz • isatech.club/quiz
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <p
            style={{
              fontSize: "18px",
              color: "#475569",
            }}
          >
            Discover your founder archetype
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );

  ogResponse.headers.set(
    "Cache-Control",
    "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
  );

  return ogResponse;
}
