"use client";

import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/common";
import Link from "next/link";
import { TopographyTexture } from "../texture/topography";

const Team4HMembers = [
  {
    role: "Hustler",
    path: "/assets/decorations/hustler.png",
  },
  {
    role: "Hacker",
    path: "/assets/decorations/hacker.png",
  },
  {
    role: "Hipster",
    path: "/assets/decorations/hipster.png",
  },
  {
    role: "Hound",
    path: "/assets/decorations/hound.png",
  },
];

export function HomepageTeamSection() {
  return (
    <section
      className="bg-primary relative flex w-full flex-col items-center justify-center"
      id="4h"
    >
      {/* Decorations */}
      <div className="absolute flex h-full w-full items-center justify-center">
        <TopographyTexture
          color={"#ececec"}
          className="absolute h-full w-full opacity-5"
        />
      </div>
      <div className="flex w-full max-w-6xl flex-col px-6 py-20 lg:px-8 xl:px-16">
        <div className="flex w-full flex-col items-center justify-center gap-6">
          {/* Header Container */}
          <div className="flex w-full flex-col items-center justify-center gap-2 text-center">
            <h2 className="text-secondary">Are You One of the 4H?</h2>
            <h5 className="text-primary-foreground flex lg:w-5/6 xl:w-2/3">
              At ISATech Society, we believe every great innovation starts with
              a diverse team. Whether you&apos;re a creative, a coder, a
              go-getter, or a researcher — there&apos;s a place for you here.
              Which one are you?
            </h5>
          </div>
          {/* Cards Container */}
          <div className="grid grid-cols-2 gap-6 sm:flex sm:items-center sm:justify-center sm:gap-6">
            {Team4HMembers.map((member, key) => (
              <div
                key={key}
                className="flex flex-col items-center justify-center gap-4 rounded-2xl border-white bg-gradient-to-b from-white to-gray-500 p-[1px] backdrop-blur-md lg:rounded-4xl"
              >
                <div className="bg-primary flex flex-col items-center justify-center gap-4 rounded-2xl lg:rounded-4xl">
                  <div className="bg-card/25 flex flex-col flex-wrap items-center justify-center gap-4 rounded-2xl px-6 py-8 lg:rounded-4xl lg:px-8 lg:py-10">
                    <div className="bg-secondary flex items-center justify-center rounded-2xl p-2 lg:rounded-3xl lg:p-6 xl:size-40">
                      <OptimizedImage
                        src={member.path}
                        alt={member.role}
                        width={1000}
                        height={1000}
                        className="size-20 rounded-2xl sm:size-16 md:size-24 lg:size-28"
                        sizes="(min-width: 1040px) 112px, (min-width: 780px) 96px, (min-width: 640px) 64px, (min-width: 380px) 80px, calc(46.67vw - 90px)"
                        brandPlaceholder
                      />
                    </div>
                    <h6 className="text-primary-foreground font-bold">
                      {member.role}
                    </h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/membership" className="text-caption z-1">
            <Button variant={"secondary"} size={"lg"}>
              Join Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
