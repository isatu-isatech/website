import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LucideCog, LucideFacebook, LucideGraduationCap, LucideHandshake, LucideIcon, LucideLinkedin, LucideRocket } from "lucide-react";
import Link from "next/link";

const partnerList = [
  { emoji: LucideCog, text: "Industry partners for real-world projects" },
  { emoji: LucideRocket, text: "Startups for hackathon sponsorships" },
  { emoji: LucideGraduationCap, text: "Faculty advisors for research projects" },
  { emoji: LucideHandshake, text: "Student clubs for cross-campus events" },
]

export default function ContactPage() {
  return (
    <div className="px-8 py-16 xl:px-16">
      <PartnerSection />
      <main className="grid gap-4 xl:grid-cols-2">
        <ContactForm />
        <ContactInfoAside />
      </main>
    </div>
  );
}

export function PartnerSection() {
  return (
    <div className="flex flex-col justify-start gap-4 py-16">
      <header className="flex flex-col gap-2 text-center">
        <h1 className="text-primary">Partner with Us</h1>
        <h4 style={{ fontFamily: "var(--font-poppins)" }}>We're seeking:</h4>
      </header>
      <ul className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {partnerList.map((why) => (
          <li key={why.text}>
            <SeekCard emoji={why.emoji} text={why.text} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SeekCard({
  emoji: Emoji,
  text,
}: {
  emoji: LucideIcon;
  text: string;
}) {
  return (
    <div className="flex flex-row gap-4 rounded-lg bg-[rgba(230,230,231,0.5)] px-6 py-4">
      <Emoji />
      <p className="text-xl">{text}</p>
    </div>
  );
}

export function ContactForm() {
  return (
    <section className="flex h-full w-full flex-col justify-start gap-9 rounded-lg bg-[rgba(230,230,231,0.5)] px-8 py-16">
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
      <h2 className="text-secondary">Contact Us</h2>
      <p className="text-lg" style={{ fontFamily: "var(--font-poppins)" }}>
        We thrive on connections! Reach out for partnerships, event ideas,
        feedback, or just to geek out over tech. Your voice shapes our
        community.
      </p>
    </header>
  );
}

export function ContactFormContent() {
  return (
    <form className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <p className="text-caption">Full Name</p>
          <Input placeholder="Your Name" />
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-caption">Email</p>
          <Input placeholder="youremail@example.com" type="email" />
        </div>
      </div>
      <p className="text-caption">Subject</p>
      <Textarea placeholder="Your Message" />
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
