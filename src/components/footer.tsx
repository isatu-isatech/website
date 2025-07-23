import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Facebook, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

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
      { label: "Achievements", href: "/" },
      { label: "About Us", href: "/" },
      { label: "Contact Us", href: "/" },
    ],
  },
  {
    section: "Membership",
    links: [
      { label: "Member Application", href: "/" },
      { label: "Core Member Application", href: "/" },
    ],
  },
  {
    section: "Legal",
    links: [{ label: "Privacy Policy", href: "/" }],
  },
];

const Footer = () => {
  return (
    <>
      <div className="bg-primary relative flex w-full items-center justify-center px-6 lg:px-8 xl:px-16">
        <Image
          src="/assets/isatech-decoration-1.svg"
          alt="ISATech Society Decoration"
          width={190}
          height={75}
          className="absolute right-0 bottom-0 w-fit md:top-0 md:h-full"
        />
        <Image
          src="/assets/footer-decoration-1.svg"
          alt="Footer Decoration"
          width={190}
          height={75}
          className="absolute right-0 bottom-0 h-fit w-fit"
        />
        <div className="absolute right-0 bottom-0 h-fit w-1/2 lg:w-1/3 xl:w-1/4">
          <Image
            src="/assets/footer-decoration-2.png"
            alt="4H Footer Decoration"
            width={190}
            height={75}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex max-w-6xl flex-col items-center justify-center gap-6 self-stretch pt-8 pb-32">
          <div className="flex w-full flex-col gap-6 lg:flex-row lg:justify-between">
            <div className="flex w-full flex-col items-start justify-center gap-2 self-stretch sm:gap-4 lg:max-w-1/3">
              <Image
                src="/assets/isatech-logo-light.svg"
                alt="ISATech Society Logo"
                width={190}
                height={75}
              />
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
            <Button asChild size={"icon"} variant={"accent"}>
              <Link href="/">
                <Mail />
              </Link>
            </Button>
            <Button asChild size={"icon"} variant={"accent"}>
              <Link href="/">
                <Facebook />
              </Link>
            </Button>
            <Button asChild size={"icon"} variant={"accent"}>
              <Link href="/">
                <Linkedin />
              </Link>
            </Button>
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
    </>
  );
};

export default Footer;
