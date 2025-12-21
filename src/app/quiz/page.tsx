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
    <main className="relative h-[calc(100vh-60px)] w-full overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-pink-500/5 to-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full h-full flex items-center justify-center px-4 py-4 md:py-8">
        <QuizContainer />
      </div>
    </main>
  );
}
