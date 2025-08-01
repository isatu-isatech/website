import {
  ISATechDecorationLeft,
  ISATechDecorationRight,
} from "@/components/assets/decorations";
import {
  LucideCog,
  LucideFacebook,
  LucideGraduationCap,
  LucideHandshake,
  LucideLinkedin,
  LucideRocket,
  MailIcon,
} from "lucide-react";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";
import ContactUsForm from "./form";

/**
 * ################################################################################
 * ################################### METADATA ###################################
 * ################################################################################
 */
export const metadata: Metadata = {
  title: "Contact Us | ISATech Society",
  description:
    "Get in touch with ISATech Society for partnerships, inquiries, or feedback.",
  openGraph: {
    title: "Contact Us | ISATech Society",
    description:
      "Get in touch with ISATech Society for partnerships, inquiries, or feedback.",
    url: "https://isatech.club/contact",
    siteName: "ISATech Society",
    type: "website",
  },
};

/**
 * ################################################################################
 * #################################### CONFIG ####################################
 * ################################################################################
 */
const partnerList = [
  { emoji: LucideCog, text: "Industry partners for real-world projects" },
  { emoji: LucideRocket, text: "Startups for hackathon sponsorships" },
  {
    emoji: LucideGraduationCap,
    text: "Faculty advisors for research projects",
  },
  { emoji: LucideHandshake, text: "Student clubs for cross-campus events" },
];
const socialLinks = [
  { emoji: MailIcon, text: "Email", href: "mailto:info@isatech.com" },
  { emoji: LucideFacebook, text: "Facebook", href: "https://facebook.com" },
  { emoji: LucideLinkedin, text: "LinkedIn", href: "https://linkedin.com" },
];

/**
 * ################################################################################
 * ################################## COMPONENTS ##################################
 * ################################################################################
 */
function ContactUsPartnerSection() {
  return (
    <section
      id="partner"
      className="relative flex w-full items-center justify-center px-6 lg:px-12 xl:px-16"
    >
      <div className="absolute flex h-full w-full max-w-7xl justify-center">
        {/* Decorations */}
        <ISATechDecorationLeft className="absolute top-0 left-0 h-full w-auto opacity-5" />
        <ISATechDecorationRight className="absolute top-0 right-0 hidden h-full w-auto opacity-5 md:block" />
      </div>
      <div className="flex w-full max-w-6xl flex-col py-16">
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

function ContactUsFormSection() {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-8 px-6">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 py-16 md:grid-cols-2">
        <div className="bg-primary/10 flex h-full w-full flex-col items-center justify-center gap-6 rounded-3xl px-8 py-16">
          {/* Header */}
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-secondary">Contact Us</h2>
            <p className="text-label">
              We thrive on connections! Reach out for partnerships, event ideas,
              feedback, or just to geek out over tech. Your voice shapes our
              community.
            </p>
          </div>
          {/* Form Separator */}
          <div className="border-primary/20 w-full border-b-1"></div>
          {/* Form Content */}
          <ContactUsForm />
        </div>
        <div className="top-8 flex h-full flex-col gap-4 self-start">
          {/* Map Embed Container */}
          <div className="bg-primary/10 aspect-square h-full w-full content-center rounded-3xl text-center">
            {/* Map Embed */}
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=122.56649672985077%2C10.716133510188474%2C122.56900727748872%2C10.717925599031416&amp;layer=mapnik&amp;marker=10.717029555936012%2C122.56775200366974"
              className="h-full w-full rounded-3xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactUsSocialLinksSection() {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-8 px-6 py-16">
      <div className="grid w-full max-w-6xl gap-6">
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <h2 className="text-secondary">Follow Us!</h2>
          <p className="text-label text-center">
            Stay connected with us through our social media channels.
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {socialLinks.map((link) => (
            <Link
              key={link.text}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-primary/20 bg-primary/10 flex w-full flex-col items-center justify-center gap-2 rounded-lg px-4 py-6 text-center md:flex-row"
            >
              <div className="bg-primary aspect-square rounded-full p-3">
                <link.emoji className="text-white" />
              </div>
              <p className="text-label">{link.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * ################################################################################
 * ##################################### PAGE #####################################
 * ################################################################################
 */
export default function ContactPage() {
  return (
    <main className="flex flex-col items-center justify-center">
      <ContactUsPartnerSection />
      <ContactUsFormSection />
      <ContactUsSocialLinksSection />
      <Toaster />
    </main>
  );
}
