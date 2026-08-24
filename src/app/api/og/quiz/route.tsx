import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { NextRequest, NextResponse } from "next/server";
import { COLORS } from "@/lib/constants/design-tokens";
import { SITE_CONFIG } from "@/lib/constants/site";
import {
  archetypeIcons,
  GENERALIST_ROLE,
  deriveArchetype,
  isArchetypeKey,
  isCanonicalRole,
} from "@/lib/quiz";

export const runtime = "nodejs";

/**
 * Result-share OG banner (spec 003, FR-009…FR-016).
 *
 * Abuse defense (org decision, constitution P5): only the 17 canonical quiz
 * outcomes render — any other `role` value 302-redirects to the invite
 * default, so the renderable/cacheable URL set is bounded (17 + 1) and no
 * per-requester rate limiting or key-value store is needed. The response is
 * public + long-lived cached (FR-016, SC-004).
 */

const FONT_DIR = path.join(process.cwd(), "src/app/api/og/quiz/fonts");
const ICON_DIR = path.join(process.cwd(), "public/assets/decorations");

const defaultPair = COLORS.quiz.archetypes.Hacker;

// Single source of truth: archetype/quiz colors live in design-tokens (COLORS.quiz).
const archetypePairs = COLORS.quiz.archetypes as Record<
  string,
  { from: string; to: string }
>;

// Icon filenames derived from the canonical icon map (quiz-data → TEAM_4H),
// so the asset paths live in exactly one place.
const ARCHETYPE_ICON: Record<string, string> = Object.fromEntries(
  Object.entries(archetypeIcons).map(([key, fullPath]) => [
    key,
    path.basename(fullPath),
  ]),
);

const CACHE_CONTROL =
  "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800";

/** Bundled Poppins TTF (latin) — read once per cold start (R1). */
let fontDataPromise: Promise<{ regular: Buffer; bold: Buffer }> | null = null;
function loadFonts(): Promise<{ regular: Buffer; bold: Buffer }> {
  fontDataPromise ??= Promise.all([
    readFile(path.join(FONT_DIR, "Poppins-400.ttf")),
    readFile(path.join(FONT_DIR, "Poppins-700.ttf")),
  ]).then(
    ([regular, bold]) => ({ regular, bold }),
    (error: unknown) => {
      // A transient read failure must not brick the banner until restart:
      // clear the cached promise so the next request retries.
      fontDataPromise = null;
      throw error;
    },
  );
  return fontDataPromise;
}

/** Local archetype icon PNGs as data URIs — same art as the in-app result (FR-010). */
const iconCache = new Map<string, Promise<string>>();
function iconDataUri(name: string): Promise<string> {
  let pending = iconCache.get(name);
  if (!pending) {
    pending = readFile(path.join(ICON_DIR, name)).then(
      (buffer) => `data:image/png;base64,${buffer.toString("base64")}`,
      (error: unknown) => {
        // Don't cache rejections — a transient read failure should not
        // permanently break this icon.
        iconCache.delete(name);
        throw error;
      },
    );
    iconCache.set(name, pending);
  }
  return pending;
}

/** Scale the role title down so long canonical roles never overflow (FR-011). */
function titleFontSize(role: string): number {
  if (role.length > 20) return 44;
  if (role.length > 16) return 56;
  return 64;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const role = searchParams.get("role");
  const archetypeParam = searchParams.get("archetype");
  const isGeneralistParam = searchParams.get("generalist") === "true";

  // Missing params → render the canonical invite banner in place. Present
  // but non-canonical role → 302 to the invite URL so no unbounded banner
  // variants can ever be created (FR-009 / SC-003).
  if (role !== null && !isCanonicalRole(role)) {
    return NextResponse.redirect(new URL("/api/og/quiz", request.url), 302);
  }

  const displayRole = role ?? "4H Personality Quiz";
  const isGeneralist = displayRole === GENERALIST_ROLE || isGeneralistParam;

  const archetype =
    isGeneralist || !isArchetypeKey(archetypeParam)
      ? (deriveArchetype(displayRole) ?? "Hustler")
      : archetypeParam;

  const pair = isGeneralist
    ? COLORS.quiz.generalist
    : (archetypePairs[archetype] ?? defaultPair);
  const [gradientStart, gradientEnd] = [pair.from, pair.to];
  const primaryColor = pair.from;

  const iconName = isGeneralist
    ? "4h-vertical.png"
    : (ARCHETYPE_ICON[archetype] ?? "hustler.png");
  const iconUri = await iconDataUri(iconName);
  const { regular, bold } = await loadFonts();

  const ogResponse = new ImageResponse(
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
        fontFamily: "Poppins",
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
        {/* Archetype icon badge — same art as the in-app result (FR-010) */}
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
            overflow: "hidden",
          }}
        >
          {/* oxlint-disable-next-line next/no-img-element -- Satori/ImageResponse requires a raw <img>; next/image cannot render inside server-generated OG images */}
          <img
            src={iconUri}
            alt=""
            style={{ width: "132px", height: "132px", objectFit: "contain" }}
          />
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
            fontSize: `${titleFontSize(displayRole)}px`,
            fontWeight: 700,
            background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
            backgroundClip: "text",
            color: "transparent",
            margin: "0 0 24px 0",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          {displayRole}
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
            4H Personality Quiz •{" "}
            {`${SITE_CONFIG.url.replace(/^https?:\/\//, "")}/quiz`}
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
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Poppins", data: regular, weight: 400, style: "normal" },
        { name: "Poppins", data: bold, weight: 700, style: "normal" },
      ],
    },
  );

  ogResponse.headers.set("Cache-Control", CACHE_CONTROL);

  return ogResponse;
}
