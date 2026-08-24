import {
  LucideCog,
  LucideGraduationCap,
  LucideHandshake,
  LucideRocket,
  MailIcon,
  MapPin,
} from "lucide-react";
import { Metadata } from "next";
import { SOCIAL_LINKS } from "@/lib/constants/site";
import Link from "next/link";
import { FacebookIcon, LinkedinIcon } from "@/components/assets/social-icons";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import ContactUsForm from "./form";
import ContactHeroLockup from "./contact-hero";

/**
 * ################################################################################
 * ################################### METADATA ###################################
 * ################################################################################
 */
export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with ISATech Society for partnerships, inquiries, or feedback.",
  keywords: [
    "philippines",
    "contact",
    "iloilo",
    "ISATU",
    "startups",
    "technopreneurship",
    "ISATech Society",
    "student founders",
    "innovation",
    "collaboration",
    "community",
  ],
  openGraph: {
    title: "Contact ISATech Society",
    description:
      "Get in touch with ISATech Society for partnerships, inquiries, or feedback.",
    url: "https://isatech.club/contact",
    siteName: "ISATech Society",
    images: [
      {
        url: "/assets/seo/ogimage.jpg",
        width: 1200,
        height: 630,
        alt: "ISATech Society Header Image",
      },
    ],
    type: "website",
  },
};

/**
 * ################################################################################
 * #################################### CONFIG ####################################
 * ################################################################################
 */
const partnerList = [
  { icon: LucideCog, text: "Industry partners for real-world projects" },
  { icon: LucideRocket, text: "Startups for hackathon sponsorships" },
  {
    icon: LucideGraduationCap,
    text: "Faculty advisors for research projects",
  },
  { icon: LucideHandshake, text: "Student clubs for cross-campus events" },
];
const socialLinks = [
  {
    emoji: MailIcon,
    text: `${SOCIAL_LINKS.email}`,
    href: `mailto:${SOCIAL_LINKS.email}`,
  },
  {
    emoji: FacebookIcon,
    text: "ISATech Society",
    href: "https://www.facebook.com/ISATech.ISATU",
  },
  {
    emoji: LinkedinIcon,
    text: "ISATech - Society",
    href: "https://www.linkedin.com/company/isatech-society/",
  },
];

/**
 * ################################################################################
 * ################################## COMPONENTS ##################################
 * ################################################################################
 */
function ContactUsHeroSection() {
  return (
    <section
      className="relative flex w-full items-center justify-center px-4 py-12 sm:px-6 md:px-8 md:py-6 lg:px-12 xl:px-16 2xl:px-20"
      id="contact-hero"
    >
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div
          aria-hidden
          className="absolute top-0 left-0 hidden aspect-364/527 h-auto w-[min(364px,100%)] bg-current mask-left opacity-5 md:block"
        />
        <div
          aria-hidden
          className="absolute right-0 bottom-0 aspect-320/528 h-auto w-[min(320px,100%)] bg-current mask-right opacity-5"
        />
      </div>
      <div className="flex w-full max-w-7xl flex-col items-center justify-center gap-8 py-8 lg:py-16">
        <ContactHeroLockup />
        {/* Brand divider accent */}
        <div className="from-primary to-secondary h-1 w-24 rounded-full bg-linear-to-r" />
      </div>
    </section>
  );
}

function ContactUsMainSection() {
  return (
    <section
      id="partner"
      className="flex w-full flex-col items-center justify-center px-4 py-16 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20"
    >
      <div className="grid w-full max-w-7xl grid-cols-1 items-stretch gap-8 lg:grid-cols-5">
        {/* Partner column (left ~2/5) — context and purpose for reaching out */}
        <div className="border-primary/10 flex flex-col justify-center gap-2 border-b pb-8 lg:col-span-2 lg:border-r lg:border-b-0 lg:pr-8 lg:pb-0">
          <h2 className="text-secondary-dark dark:text-secondary">
            Partner With Us!
          </h2>
          <h4>We&apos;re seeking:</h4>
          <div className="divide-primary/10 flex w-full flex-col divide-y">
            {partnerList.map((why) => (
              <div
                className="flex flex-row items-center gap-4 py-5"
                key={why.text}
              >
                <div className="bg-primary aspect-square rounded-full p-2.5">
                  <why.icon className="h-4 w-4 text-white" />
                </div>
                <h6 className="text-sm xl:text-lg">{why.text}</h6>
              </div>
            ))}
          </div>
        </div>
        {/* Form column (right ~3/5) — prominence and comfortable space */}
        <div className="bg-accent border-primary/10 flex w-full flex-col justify-center gap-6 rounded-3xl border px-6 py-10 sm:px-10 lg:col-span-3">
          <div className="flex flex-col items-center text-center">
            <p className="text-body text-muted-foreground max-w-xl">
              We thrive on connections! Reach out for partnerships, event ideas,
              feedback, or just to geek out over tech. Your voice shapes our
              community.
            </p>
          </div>
          {/* Form Separator */}
          <div className="border-primary/20 w-full border-b"></div>
          {/* Form Content */}
          <ContactUsForm />
        </div>
      </div>
    </section>
  );
}

function ContactUsSocialMapSection() {
  return (
    <section className="flex w-full flex-col items-center justify-center px-4 py-16 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
      <div className="grid w-full max-w-7xl grid-cols-1 items-stretch gap-8 lg:grid-cols-3">
        {/* Map panel (left ~2/3) — the info card sits in the map's upper-left
            corner; OSM's native marker (bound to the office lat/lon) marks the
            location and tracks map pan/zoom */}
        <div className="bg-accent border-primary/10 relative min-h-64 w-full overflow-hidden rounded-3xl border lg:col-span-2">
          <iframe
            title="ISATech Society location map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=122.56649672985077%2C10.716133510188474%2C122.56900727748872%2C10.717925599031416&amp;layer=mapnik&amp;marker=10.717029555936012%2C122.56775200366974"
            className="absolute inset-0 h-full w-full border-0"
          />
          {/* Info card — upper-left corner of the map */}
          <div className="bg-primary absolute top-4 left-4 z-10 max-w-xs rounded-2xl p-5 shadow-md">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-white" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-white">
                  ISATech Society
                </p>
                <p className="text-sm text-white/80">
                  Iloilo Science and Technology University, Iloilo City
                </p>
                <a
                  href={`mailto:${SOCIAL_LINKS.email}`}
                  className="text-secondary text-sm font-medium underline underline-offset-4"
                >
                  {SOCIAL_LINKS.email}
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Socials column (right ~1/3) — bare icon + name rows, separated by
            thin secondary lines, with a hover indicator per row */}
        <div className="border-primary/10 flex flex-col justify-center gap-6 border-b pb-8 lg:col-span-1 lg:border-b-0 lg:border-l lg:pb-0 lg:pl-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-secondary-dark dark:text-secondary">
              Follow Us!
            </h2>
            <p className="text-label">
              Stay connected with us through our social media channels.
            </p>
          </div>
          <div className="divide-secondary/50 flex w-full flex-col divide-y">
            {socialLinks.map((link) => (
              <Link
                key={link.text}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-row items-center gap-4 py-5"
              >
                <link.emoji className="text-primary group-hover:text-secondary h-6 w-6 transition-all duration-200 group-hover:scale-110" />
                <p className="text-label group-hover:text-secondary-dark dark:group-hover:text-secondary transition-colors duration-200">
                  {link.text}
                </p>
              </Link>
            ))}
          </div>
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
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Contact Us", path: "/contact" },
        ]}
      />
      <ContactUsHeroSection />
      <ContactUsMainSection />
      <ContactUsSocialMapSection />
    </main>
  );
}
