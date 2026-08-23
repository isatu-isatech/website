"use client";

import { CountUpComponent } from "@/components/common";

const heroStats: { quantity: string; description: string }[] = [
  { quantity: "5+", description: "Startups Established" },
  { quantity: "25+", description: "Awards Earned" },
  { quantity: "50+", description: "Events Participated" },
  // { quantity: "100+", description: "Members Registered" },
];

export function HomepageStatsSection() {
  return (
    <section
      className="flex w-full flex-col items-center justify-center px-4 py-6 sm:px-6 md:px-8 lg:px-12 lg:py-16 xl:px-16 2xl:px-20"
      id="stats"
    >
      <div className="flex w-full max-w-7xl flex-wrap items-center justify-center gap-y-4 lg:gap-y-6">
        {heroStats.map((stat, index) => (
          <div
            key={index}
            className="flex w-full flex-col items-center justify-center sm:w-1/2 md:w-1/3"
          >
            <h1>
              <CountUpComponent from={0} to={parseInt(stat.quantity)} />+
            </h1>
            <h3>{stat.description}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
