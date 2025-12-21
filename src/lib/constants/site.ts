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
  twitter: "https://twitter.com/ISATech", // Update if you have Twitter
  email: "isatech.isatu@gmail.com", // Update with actual email
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

export const TEAM_4H = [
  {
    role: "Hustler",
    description: "The business mind - drives growth and builds connections",
    imagePath: "/assets/decorations/hustler.png",
  },
  {
    role: "Hacker",
    description: "The builder - turns ideas into working products",
    imagePath: "/assets/decorations/hacker.png",
  },
  {
    role: "Hipster",
    description: "The designer - creates beautiful user experiences",
    imagePath: "/assets/decorations/hipster.png",
  },
  {
    role: "Hound",
    description: "The researcher - validates ideas with data",
    imagePath: "/assets/decorations/hound.png",
  },
] as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Membership", href: "/membership" },
  { label: "Contact", href: "/contact" },
] as const;
