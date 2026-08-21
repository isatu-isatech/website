import { Metadata } from "next";
import { QuizContainer } from "@/components/quiz/quiz-container";

export const metadata: Metadata = {
  title: "4H Personality Quiz | Discover Your Founder Archetype",
  description:
    "Take the 4H Personality Quiz to discover your founder archetype. Are you a Hustler, Hacker, Hipster, or Hound? Find out which role suits you best in a startup team.",
  keywords: [
    "personality quiz",
    "founder archetype",
    "4H quiz",
    "Hustler",
    "Hacker",
    "Hipster",
    "Hound",
    "startup personality",
    "team roles",
    "ISATech",
    "technopreneurship",
  ],
  openGraph: {
    title: "4H Personality Quiz | Discover Your Founder Archetype",
    description:
      "Take the 4H Personality Quiz to discover your founder archetype. Are you a Hustler, Hacker, Hipster, or Hound?",
    url: "https://isatech.club/quiz",
    siteName: "ISATech Society",
    images: [
      {
        url: "/assets/seo/ogimage.jpg",
        width: 1200,
        height: 630,
        alt: "4H Personality Quiz - ISATech Society",
      },
    ],
    type: "website",
  },
};

export default function QuizPage() {
  return (
    <main className="from-background via-background to-muted/30 relative h-[calc(100vh-60px)] w-full overflow-hidden bg-gradient-to-b">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-secondary/5 absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-pink-500/5 to-blue-500/5 blur-3xl" />
      </div>

      <div className="relative flex h-full w-full items-center justify-center px-4 py-4 md:py-8">
        <QuizContainer />
      </div>
    </main>
  );
}
