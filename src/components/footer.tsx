"use client";

import React, { ForwardRefExoticComponent, RefAttributes } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Facebook,
  Linkedin,
  LucideIcon,
  LucideProps,
  Mail,
} from "lucide-react";
import Image from "next/image";
import { FooterArchDecoration, ISATechDecoration } from "./assets/decorations";
import { ISATechLogoType } from "./assets/logos";

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
      { label: "Homepage", href: "/" },
      // { label: "Achievements", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
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
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Preferences", href: "/privacy#manage-cookies" },
    ],
  },
];
// List of social links
// This can be extended or modified as needed; Max of 5.
// If more links are needed, consider redesigning the footer layout.
const socialLinks: {
  emoji: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  href: string;
}[] = [
  { emoji: Mail, href: "mailto:isatech@isatu.edu.ph" },
  { emoji: Facebook, href: "https://www.facebook.com/ISATech.ISATU" },
  {
    emoji: Linkedin,
    href: "https://www.linkedin.com/company/isatech-society/",
  },
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
        <div className="absolute right-0 bottom-0 h-fit w-1/2 lg:w-1/3 xl:w-1/4">
          <Image
            src="/assets/decorations/4h-horizontal.png"
            alt="4H Footer Decoration"
            width={1060}
            height={385}
            sizes="(min-width: 1280px) 25.06vw, (min-width: 1040px) 33.64vw, 50.14vw"
            className="pointer-events-none h-full w-full object-cover"
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
            {socialLinks.map((social, key) => {
              const Icon: LucideIcon = social.emoji;
              return (
                <Button asChild size={"icon"} variant={"accent"} key={key}>
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
            © 2025 ISATech Society. All rights reserved. All logos and brands
            are property of their respective owners. Made by ISATech Creatives.
          </p>
        </div>
      </div>
    </footer>
  );
}
