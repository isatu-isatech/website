"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Facebook, Linkedin, LucideIcon, Mail } from "lucide-react";
import { OptimizedImage } from "@/components/common";
import {
  FooterArchDecoration,
  ISATechDecoration,
} from "@/components/assets/decorations";
import { ISATechLogoType } from "@/components/assets/logos";
import { SITE_CONFIG, SOCIAL_LINKS } from "@/lib/constants";

/**
 * ################################################################################
 * #################################### CONFIG ####################################
 * ################################################################################
 */
// List of navigation links
// This can be extended or modified as needed; Max of 4 columns, 5 items each.
// If more links are needed, consider redesigning the footer layout.
const navLinks: {
  section: string;
  links: { label: string; href: string }[];
}[] = [
  {
    section: "Sitemap",
    links: [
      { label: "Homepage", href: "/#" },
      // { label: "Achievements", href: "/" },
      { label: "About Us", href: "/about#" },
      { label: "Contact Us", href: "/contact#" },
      { label: "Quiz", href: "/quiz#" },
    ],
  },
  {
    section: "Membership",
    links: [
      { label: "Member Application", href: "/membership#member" },
      { label: "Core Member Application", href: "/membership#core" },
    ],
  },
  {
    section: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy#" },
      { label: "Cookie Preferences", href: "/privacy#manage-cookies" },
    ],
  },
];

// List of social links using centralized constants
const socialLinks: {
  icon: LucideIcon;
  href: string;
  label: string;
}[] = [
  { icon: Mail, href: `mailto:${SOCIAL_LINKS.email}`, label: "Email" },
  { icon: Facebook, href: SOCIAL_LINKS.facebook, label: "Facebook" },
  { icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: "LinkedIn" },
];

/**
 * ################################################################################
 * ################################### COMPONENT ##################################
 * ################################################################################
 */
export default function FooterComponent() {
  return (
    <footer>
      <div className="bg-primary relative flex w-full items-center justify-center px-6 lg:px-8 xl:px-16">
        <ISATechDecoration
          className="pointer-events-none absolute right-0 bottom-0 w-fit opacity-10 md:top-0 md:h-full"
          color="#ffffff"
        />
        <FooterArchDecoration
          className="pointer-events-none absolute right-0 -bottom-0.5 h-fit w-fit"
          color="#FFAC03"
        />
        <div className="absolute right-0 bottom-0 h-fit w-2/3 lg:w-1/3 xl:w-1/4">
          <OptimizedImage
            src="/assets/decorations/4h-horizontal.png"
            alt="4H Footer Decoration"
            width={1060}
            height={385}
            sizes="(min-width: 1280px) 25.06vw, (min-width: 1040px) 33.64vw, 50.14vw"
            className="pointer-events-none h-auto w-full object-cover"
            brandPlaceholder
          />
        </div>

        <div className="flex max-w-6xl flex-col items-center justify-center gap-6 self-stretch pt-8 pb-32">
          <div className="flex w-full flex-col gap-6 lg:flex-row lg:justify-between">
            <div className="flex w-full flex-col items-start justify-start gap-2 self-stretch sm:gap-4 lg:max-w-1/3">
              <div className="flex max-h-28">
                <ISATechLogoType lightMode className="h-20 w-auto md:h-28" />
              </div>
              <p className="text-label text-primary-foreground">
                Breeding innovation, awareness on startups, intellectual
                property, and technology—molding students to become
                technopreneurs and innovators of the future.
              </p>
            </div>
            <div className="flex w-full flex-col flex-wrap content-start items-start justify-between gap-y-6 self-stretch sm:flex-row lg:max-w-7/12">
              {navLinks.map((section) => (
                <div
                  className="flex flex-col items-start gap-4 sm:w-[calc(33.333333%-1rem)] lg:w-[calc(50%-1rem)] xl:w-[calc(33.333333%-1rem)]"
                  key={section.section}
                >
                  <p className="text-body text-primary-foreground font-semibold">
                    {section.section}
                  </p>
                  <div className="flex flex-col items-start gap-2">
                    {section.links.map((link) => (
                      <Link
                        href={link.href}
                        key={link.label}
                        className="decoration-secondary hover:underline hover:underline-offset-4"
                      >
                        <p className="text-label text-primary-foreground">
                          {link.label}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex w-full items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <Button
                  asChild
                  size={"icon"}
                  variant={"accent"}
                  key={social.label}
                  aria-label={social.label}
                >
                  <Link href={social.href} target="_blank">
                    <Icon />
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-secondary flex w-full justify-center">
        <div className="flex w-full max-w-6xl items-center justify-center px-12 py-2 text-center">
          <p className="text-micro">
            © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights
            reserved. All logos and brands are property of their respective
            owners. Made by ISATech Creatives.
          </p>
        </div>
      </div>
    </footer>
  );
}
