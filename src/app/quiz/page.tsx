import { Metadata } from "next";
import { QuizContainer } from "@/components/quiz/quiz-container";
import { BlobsAnimatedBackground } from "@/components/ui/blobs";
import { SITE_CONFIG } from "@/lib/constants/site";

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
    url: `${SITE_CONFIG.url}/quiz`,
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
    <main className="bg-background relative isolate h-full w-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 z-0 flex justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="bg-primary absolute top-0 left-0 hidden aspect-364/527 w-[min(300px,100%)] mask-left opacity-10 md:block" />
        <div className="bg-secondary absolute right-0 bottom-0 aspect-320/528 w-[min(280px,100%)] mask-right opacity-10" />
      </div>
      <BlobsAnimatedBackground
        blobs={[
          {
            id: "quiz-blob-primary",
            top: "-6rem",
            left: "-6rem",
            colorClass: "bg-primary/30",
            sizeClass: "h-[22rem] w-[22rem]",
            blurClass: "blur-[70px]",
            animateX: [0, 16, 0],
            animateY: [0, 24, 0],
            duration: 8,
          },
          {
            id: "quiz-blob-secondary",
            bottom: "-6rem",
            right: "-6rem",
            colorClass: "bg-secondary/30",
            sizeClass: "h-[22rem] w-[22rem]",
            blurClass: "blur-[70px]",
            animateX: [0, -20, 0],
            animateY: [0, -30, 0],
            duration: 10,
          },
        ]}
        className="absolute inset-0 z-0! h-full w-full opacity-100"
        gridPatternOpacity="opacity-0"
        gridPatternDarkOpacity="opacity-0"
      />
      {/* Orientation-aware rhythm: symmetric scroll padding doubles as
          overflow guard; the card's auto margins center on landscape and
          eye-level nudge on portrait */}
      <div className="relative z-10 flex h-full w-full overflow-y-auto px-4 py-6 md:py-8">
        <QuizContainer />
      </div>
    </main>
  );
}
