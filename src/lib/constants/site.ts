/**
 * Centralized site configuration
 * Update these values to reflect changes across the entire site
 */

export const SITE_CONFIG = {
  name: "ISATech Society",
  shortName: "ISATech",
  description:
    "Empowering student founders to achieve their dreams through innovation, collaboration, and community.",
  url: "https://isatech.club",
  foundingYear: 2021,
  locale: "en_PH",
} as const;

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/ISATech.ISATU",
  linkedin: "https://www.linkedin.com/company/isatech-society/",
  email: "isatech@isatu.edu.ph", // Update with actual email
} as const;

export const CONTACT_INFO = {
  address: {
    locality: "Iloilo City",
    region: "Western Visayas",
    country: "PH",
    full: "Iloilo Science and Technology University, Iloilo City, Philippines",
  },
} as const;

export const HERO_STATS = [
  { quantity: 5, label: "Startups Established" },
  { quantity: 25, label: "Awards Earned" },
  { quantity: 50, label: "Events Participated" },
  // { quantity: 100, label: "Members Registered" },
] as const;

/**
 * Canonical 4H archetype catalog — single source for the archetype icons,
 * the "Meet the 4H" sections (homepage + membership), and the quiz icon map.
 * Keep `role` values exactly aligned with the quiz `ArchetypeKey` union.
 */
export const TEAM_4H = [
  {
    role: "Hustler",
    imagePath: "/assets/decorations/hustler.png",
    subtitle:
      "The strategic brain who drives momentum and turns vision into action.",
  },
  {
    role: "Hacker",
    imagePath: "/assets/decorations/hacker.png",
    subtitle: "The builder, coder, and architect who makes ideas real.",
  },
  {
    role: "Hipster",
    imagePath: "/assets/decorations/hipster.png",
    subtitle:
      "The creative who shapes innovation with design, branding, and vibe.",
  },
  {
    role: "Hound",
    imagePath: "/assets/decorations/hound.png",
    subtitle:
      "The researcher and analyst who keeps the team grounded and informed.",
  },
] as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Membership", href: "/membership" },
  { label: "Quiz", href: "/quiz" },
  { label: "Contact", href: "/contact" },
] as const;
