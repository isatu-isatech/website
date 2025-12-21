"use client";

import { ISATechDecorationCenter } from "@/components/assets/decorations";
import { GraduationCap, NotepadText, Rocket, Users } from "lucide-react";

const isatechOffers = [
  {
    icon: Rocket,
    title: "Hackathons",
    description:
      "A race of innovation where ideas thrive and take shape. Hackathons challenge students to build creative tech solutions under pressure.",
  },
  {
    icon: NotepadText,
    title: "Seminars",
    description:
      "Insightful talks from industry leaders. Seminars offer fresh perspectives, discuss emerging trends, and share valuable knowledge beyond the classroom.",
  },
  {
    icon: GraduationCap,
    title: "Trainings",
    description:
      "Skill-up sessions to help you stay ahead. Whether it's coding, design, or entrepreneurship — our trainings empower members with hands-on experience and practical tools.",
  },

  {
    icon: Users,
    title: "Cohorts",
    description:
      "Focused learning communities designed for growth. Cohorts bring members together to explore specific skills, to build real-world projects, and to support one another in a collaborative environment.",
  },
];

export function HomepageOfferSection() {
  return (
    <section
      className="relative flex w-full flex-col items-center justify-center overflow-hidden px-6 py-16 lg:px-16 lg:py-28"
      id="offers"
    >
      {/* Decoration */}
      <div className="absolute -z-1 flex h-full w-full items-center justify-center">
        <ISATechDecorationCenter className="translate absolute top-1/2 left-1/2 h-11/12 w-auto -translate-x-1/2 -translate-y-1/2 opacity-5 lg:opacity-10" />
      </div>
      <div className="flex max-w-6xl flex-col items-center justify-center gap-6 text-center">
        <h2 className="text-primary">What do we offer?</h2>
        <div className="flex flex-col gap-6 md:grid md:grid-cols-2">
          {isatechOffers.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 rounded-2xl bg-gray-300/50 px-6 py-4 backdrop-blur-xs"
            >
              <item.icon size={32} />
              <div className="flex flex-col gap-2 text-start">
                <p className="text-body-bold">{item.title}</p>
                <p className="text-label">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
