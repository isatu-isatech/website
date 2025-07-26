import {
  ISATechDecorationLeft,
  ISATechDecorationRight,
} from "@/components/assets/decorations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  LucideCog,
  LucideFacebook,
  LucideGraduationCap,
  LucideHandshake,
  LucideLinkedin,
  LucideRocket,
} from "lucide-react";
import Link from "next/link";

const partnerList = [
  { emoji: LucideCog, text: "Industry partners for real-world projects" },
  { emoji: LucideRocket, text: "Startups for hackathon sponsorships" },
  {
    emoji: LucideGraduationCap,
    text: "Faculty advisors for research projects",
  },
  { emoji: LucideHandshake, text: "Student clubs for cross-campus events" },
];

function ContactUsPartnerSection() {
  return (
    <section
      id="partner"
      className="relative flex w-full items-center justify-center px-6 lg:px-12 xl:px-16"
    >
      <div className="debug absolute flex h-full w-full max-w-7xl justify-center">
        {/* Decorations */}
        <ISATechDecorationLeft className="absolute top-0 left-0 h-full w-auto opacity-5" />
        <ISATechDecorationRight className="absolute top-0 right-0 hidden h-full w-auto opacity-5 md:block" />
      </div>
      <div className="debug flex w-full max-w-6xl flex-col py-16">
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <h1 className="text-primary">Partner With Us!</h1>
          <h4>We&apos;re seeking:</h4>
        </div>
        <div>
          <div className="mt-4 grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
            {partnerList.map((why) => (
              <div
                className="bg-primary/10 flex flex-row items-center gap-4 rounded-lg px-6 py-4 shadow-2xs backdrop-blur-md"
                key={why.text}
              >
                <why.emoji />
                <h6 className="text-sm xl:text-xl">{why.text}</h6>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactForm() {
  return (
    <section className="flex h-full w-full flex-col justify-start gap-9 rounded-lg bg-[rgba(230,230,231,0.5)] px-8 py-8 md:py-16 lg:py-16 xl:py-16">
      <ContactFormHeader />
      {/* form separator */}
      <div className="h-[1px] bg-gray-300"></div>
      <ContactFormContent />
    </section>
  );
}

export function ContactFormHeader() {
  return (
    <header className="flex flex-col items-center gap-6 text-center">
      <h2
        className="text-secondary text-3xl xl:text-4xl"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        Contact Us
      </h2>
      <h5
        className="text-sm font-medium xl:text-xl"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        We thrive on connections! Reach out for partnerships, event ideas,
        feedback, or just to geek out over tech. Your voice shapes our
        community.
      </h5>
    </header>
  );
}

export function ContactFormContent() {
  return (
    <form className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="text-caption"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Full Name
          </label>
          <Input placeholder="Your Name" className="border-black" />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-caption"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Email
          </label>
          <Input
            placeholder="youremail@example.com"
            type="email"
            className="border-black"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="message"
          className="text-caption"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Message
        </label>
        <Textarea
          placeholder="Your Message"
          className="field-sizing-fixed border-black"
        />
      </div>
      <div className="flex flex-col items-end gap-4">
        <Button type="submit" className="mt-4 h-fit px-6 py-3">
          Send Message
        </Button>
      </div>
    </form>
  );
}

export function ContactInfoAside() {
  return (
    <aside className="flex flex-col gap-4 overflow-hidden">
      {/* replace with maps embed later */}
      <section className="aspect-square w-full content-center rounded-lg bg-[rgba(230,230,231,0.5)] text-center">
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=122.56649672985077%2C10.716133510188474%2C122.56900727748872%2C10.717925599031416&amp;layer=mapnik&amp;marker=10.717029555936012%2C122.56775200366974"
          className="aspect-square w-full rounded-lg"
        />
      </section>
      <div className="flex flex-row content-stretch gap-4">
        <div className="w-full rounded-lg bg-[rgba(230,230,231,0.5)] px-4 py-6 text-center">
          <Button variant="default" className="aspect-square rounded-full py-6">
            <Link
              href="https://www.facebook.com/ISATech.ISATU"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LucideFacebook />
            </Link>
          </Button>
        </div>
        <div className="w-full rounded-lg bg-[rgba(230,230,231,0.5)] px-4 py-6 text-center">
          <Button variant="default" className="aspect-square rounded-full py-6">
            <Link
              href="https://www.linkedin.com/company/isatech-society"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LucideLinkedin />
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}

export default function ContactPage() {
  return (
    <main className="flex flex-col items-center justify-center">
      <ContactUsPartnerSection />
      <ContactForm />
      <ContactInfoAside />
    </main>
  );
}
