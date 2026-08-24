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
      "Focused learning communities designed for growth. Cohorts bring members together to explore specific skills and to build real-world projects.",
  },
];

export function HomepageOfferSection() {
  return (
    <section
      className="relative flex w-full flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6 md:px-8 lg:px-12 lg:py-28 xl:px-16 2xl:px-20"
      id="offers"
    >
      {/* Decoration */}
      <div className="absolute -z-1 flex h-full w-full items-center justify-center">
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 aspect-[306/466] h-11/12 w-auto -translate-x-1/2 -translate-y-1/2 bg-current mask-center opacity-5 lg:opacity-10"
        />
      </div>
      <div className="flex max-w-7xl flex-col items-center justify-center gap-6 text-center">
        <h2 className="text-secondary-dark dark:text-secondary">
          What do we offer?
        </h2>
        <div className="flex flex-col gap-6 md:grid md:grid-cols-2 xl:grid-cols-4">
          {isatechOffers.map((item, index) => (
            <div
              key={index}
              className="bg-foreground/5 items-left flex flex-col gap-4 rounded-2xl px-6 py-6 text-left backdrop-blur-xs"
            >
              <item.icon size={32} />
              <div className="flex flex-col gap-2">
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
