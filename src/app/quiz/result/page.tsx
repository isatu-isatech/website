import { Metadata } from "next";
import { redirect } from "next/navigation";
import { archetypes } from "@/lib/quiz-data";

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
 */
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const role = params.role || "4H Personality Quiz";
  const archetype = params.archetype || "Hustler";
  const isGeneralist = params.generalist === "true";

  const description =
    archetypes[role] ||
    "Take the 4H Personality Quiz to discover your founder archetype! Are you a Hustler, Hacker, Hipster, or Hound?";

  const ogImageUrl = new URL("/api/og/quiz", "https://isatech.club");
  ogImageUrl.searchParams.set("role", role);
  ogImageUrl.searchParams.set("archetype", archetype);
  if (isGeneralist) {
    ogImageUrl.searchParams.set("generalist", "true");
  }

  return {
    title: `I'm a ${role}! | 4H Personality Quiz`,
    description: `${description} Take the quiz to discover your founder archetype!`,
    openGraph: {
      title: `I'm a ${role}!`,
      description: `${description} Take the quiz to discover YOUR founder archetype!`,
      url: `https://isatech.club/quiz/result?role=${encodeURIComponent(role)}&archetype=${archetype}`,
      siteName: "ISATech Society",
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: `${role} - 4H Personality Quiz Result`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `I'm a ${role}!`,
      description: `${description} Take the quiz to discover YOUR founder archetype!`,
      images: [ogImageUrl.toString()],
    },
  };
}

export default async function QuizResultPage() {
  // Redirect visitors to the quiz page so they can take the test
  redirect("/quiz");
}
