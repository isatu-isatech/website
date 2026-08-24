import { Metadata } from "next";
import { redirect } from "next/navigation";
import { archetypes } from "@/lib/quiz-data";
import { SITE_CONFIG } from "@/lib/constants/site";
import {
  GENERALIST_ROLE,
  buildBannerUrl,
  buildShareUrl,
  isArchetypeKey,
  isCanonicalRole,
} from "@/lib/quiz";

interface Props {
  searchParams: Promise<{
    role?: string;
    archetype?: string;
    generalist?: string;
  }>;
}

/**
 * This page exists purely for SEO and social sharing purposes.
 * When a user shares their quiz result, the shared link will have
 * a dynamic OG image showing their result. However, when someone
 * clicks the link, they are redirected to take the quiz themselves.
 *
 * The share pages are excluded from search-engine indexing (FR-017):
 * they only exist to render banners for platforms.
 */
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const role = params.role ?? "";
  const archetypeParam = params.archetype ?? "";
  const isGeneralistParam = params.generalist === "true";

  // Only canonical outcomes get a result banner/share link; forged or
  // missing params fall back to the quiz invite (the banner route coerces
  // unknown roles the same way — FR-009).
  const canonical = isCanonicalRole(role);
  const archetype = isArchetypeKey(archetypeParam) ? archetypeParam : "Hustler";
  const isGeneralist = role === GENERALIST_ROLE || isGeneralistParam;
  const shareParams = canonical ? { role, archetype, isGeneralist } : null;

  const description =
    (canonical ? archetypes[role] : undefined) ||
    "Take the 4H Personality Quiz to discover your founder archetype! Are you a Hustler, Hacker, Hipster, or Hound?";

  const title = canonical
    ? `I'm a ${role}!`
    : "4H Personality Quiz | Discover Your Founder Archetype";

  // Byte-identical with the share button's URL (FR-014).
  const ogImageUrl = shareParams
    ? buildBannerUrl(shareParams).toString()
    : new URL("/api/og/quiz", SITE_CONFIG.url).toString();
  const pageUrl = shareParams
    ? buildShareUrl(shareParams).toString()
    : new URL("/quiz/result", SITE_CONFIG.url).toString();

  return {
    title,
    description: `${description} Take the quiz to discover your founder archetype!`,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description: `${description} Take the quiz to discover YOUR founder archetype!`,
      url: pageUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: canonical
            ? `${role} - 4H Personality Quiz Result`
            : "4H Personality Quiz - ISATech Society",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: `${description} Take the quiz to discover YOUR founder archetype!`,
      images: [ogImageUrl],
    },
  };
}

export default async function QuizResultPage() {
  // Redirect visitors to the quiz page so they can take the test
  redirect("/quiz");
}
