import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LucideCog, LucideFacebook, LucideGraduationCap, LucideHandshake, LucideIcon, LucideLinkedin, LucideRocket } from "lucide-react";

const partnerList = [
  { emoji: LucideCog, text: "Industry partners for real-world projects" },
  { emoji: LucideRocket, text: "Startups for hackathon sponsorships" },
  { emoji: LucideGraduationCap, text: "Faculty advisors for research projects" },
  { emoji: LucideHandshake, text: "Student clubs for cross-campus events" },
]

export default function ContactPage() {
  return (
    <div className="py-16 xl:px-16 px-8">
        <PartnerSection />
      <main className="grid xl:grid-cols-2 gap-4">
        <ContactForm />
        <ContactInfoAside />
      </main>
    </div>
  );
}

export function PartnerSection() {
  return (
    <div className="flex flex-col justify-start py-16 gap-4">
      <header className="text-center flex flex-col gap-2 ">
          <h1 className="text-primary" style={{fontFamily: "var(--font-poppins)"}}>Partner with Us</h1>
          <h4 style={{fontFamily: "var(--font-poppins)"}}>We're seeking:</h4>
      </header>
      <ul className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
        {partnerList.map((why) => (
          <li key={why.text}>
            <SeekCard emoji={why.emoji} text={why.text} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SeekCard({ emoji: Emoji, text }: { emoji: LucideIcon, text: string }) {
  return (
    <div className="flex flex-row px-6 py-4 rounded-lg gap-4 bg-[rgba(230,230,231,0.5)]">
      <Emoji />
      <p className="text-xl">{text}</p>
    </div>
  )
}

export function ContactForm() {
  return (
    <section className="bg-[rgba(230,230,231,0.5)] h-full w-full rounded-lg justify-start flex flex-col py-16 px-8 gap-9 backdrop-blur-md z-0 relative">
      <ContactFormHeader />
      {/* form separator */}
      <div className="h-[1px] bg-gray-300"></div>
      <ContactFormContent />
    </section>
  )
}

export function ContactFormHeader() {
  return (
    <header className="flex flex-col items-center text-center gap-6">
      <h2 className="text-secondary">Contact Us</h2>
      <p className="text-lg" style={{fontFamily: "var(--font-poppins)"}}>
        We thrive on connections!
        Reach out for partnerships,
        event ideas, feedback, or
        just to geek out over tech.
        Your voice shapes our community.
      </p>
    </header>
  );
}

export function ContactFormContent() {
  return(
    <form className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <Button type="submit" className="h-fit px-6 py-3 mt-4" >Send Message</Button>
      </div>
    </form>
  )
}

export function ContactInfoAside() {
  return (
    <aside className="flex flex-col gap-4">
      {/* replace with maps embed later */}
      <section className="w-full bg-[rgba(230,230,231,0.5)] aspect-square rounded-lg text-center content-center">Maps here</section>
      <div className="flex flex-row content-stretch gap-4">
        <div className="w-full text-center bg-[rgba(230,230,231,0.5)] py-6 px-4 rounded-lg">
          <Button variant="default" className="rounded-full aspect-square">
            <LucideFacebook />
          </Button>
        </div>
        <div className="w-full text-center bg-[rgba(230,230,231,0.5)] py-6 px-4 rounded-lg">
          <Button variant="default" className="rounded-full aspect-square">
            <LucideLinkedin />
          </Button>
        </div>
      </div>
    </aside>
  )

}

