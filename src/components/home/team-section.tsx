"use client";

import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/common";
import Link from "next/link";
import { TopographyTexture } from "../texture/topography";

const Team4HMembers = [
  {
    role: "Hustler",
    path: "/assets/decorations/hustler.png",
    subtitle:
      "The strategic brain who drives momentum and turns vision into action.",
  },
  {
    role: "Hacker",
    path: "/assets/decorations/hacker.png",
    subtitle: "The builder, coder, and architect who makes ideas real.",
  },
  {
    role: "Hipster",
    path: "/assets/decorations/hipster.png",
    subtitle:
      "The creative who shapes innovation with design, branding, and vibe.",
  },
  {
    role: "Hound",
    path: "/assets/decorations/hound.png",
    subtitle:
      "The researcher and analyst who keeps the team grounded and informed.",
  },
];

export function HomepageTeamSection() {
  return (
    <section
      className="bg-primary relative flex w-full flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20"
      id="4h"
    >
      {/* Decorations */}
      <div className="pointer-events-none absolute flex h-full w-full items-center justify-center">
        <TopographyTexture
          color={"#ececec"}
          className="absolute h-full w-full opacity-5"
        />
      </div>
      <div className="flex w-full max-w-7xl flex-col py-16 lg:py-28">
        <div className="flex w-full flex-col items-center justify-center gap-6">
          {/* Header Container */}
          <div className="flex w-full flex-col items-center justify-center gap-2 text-center">
            <h2 className="text-secondary">Are You One of the 4H?</h2>
            <h5 className="text-primary-foreground lg:w-5/6 xl:w-2/3">
              At ISATech Society, we believe every great innovation starts with
              a diverse team. Whether you&apos;re a creative, a coder, a
              go-getter, or a researcher — there&apos;s a place for you here.
              Which one are you?
            </h5>
          </div>
          {/* Cards Container */}
          <div className="grid w-full grid-cols-2 gap-6 lg:grid-cols-4">
            {Team4HMembers.map((member, key) => (
              <div
                key={key}
                className="border-border/60 bg-card/25 flex flex-col items-center justify-center gap-4 rounded-2xl border px-6 py-8 text-center backdrop-blur-md lg:px-8 lg:py-10"
              >
                <div className="bg-secondary flex size-28 items-center justify-center rounded-2xl p-2 md:size-32 lg:rounded-3xl lg:p-6 xl:size-40">
                  <OptimizedImage
                    src={member.path}
                    alt={member.role}
                    height={1000}
                    width={1000}
                    className="h-full w-full object-contain"
                    brandPlaceholder
                  />
                </div>
                <h6 className="text-primary-foreground font-bold">
                  {member.role}
                </h6>
                <p className="text-caption text-primary-foreground/90">
                  {member.subtitle}
                </p>
              </div>
            ))}
          </div>
          <Link href="/quiz" className="text-caption z-1">
            <Button variant={"secondary"} size={"lg"}>
              Take the Quiz
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
