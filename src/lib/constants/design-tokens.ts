/**
 * Design tokens for use in JavaScript/TypeScript
 * These should match your globals.css CSS variables
 *
 * Use these for:
 * - Inline styles in special cases
 * - Three.js/Canvas colors
 * - Dynamic style calculations
 */

export const COLORS = {
  // Primary brand colors
  primary: {
    DEFAULT: "#203C90", // ISATech Blue
    foreground: "#E8EAFC",
  },
  secondary: {
    DEFAULT: "#FFAC03", // ISATech Gold
    foreground: "#1A1F35",
  },

  // Semantic colors
  background: {
    light: "#F5F7FC",
    dark: "#1A1F35",
  },
  foreground: {
    light: "#1A1F35",
    dark: "#E0E3F0",
  },

  // Chart colors
  chart: {
    1: "#7DD3C0",
    2: "#E5C96A",
    3: "#D18047",
    4: "#9567A3",
    5: "#5B9BD5",
  },
  /* Quiz + brand surfaces — single JS-consumed source for result-screen, OG route, confetti.
     Mirrors src/lib/quiz-data.ts archetypeGradients (Tailwind classes) — keep in sync. */
  quiz: {
    generalist: { from: "#FFAC03", to: "#E08D00" }, // gold pair (secondary → deeper gold) — was violet
    archetypes: {
      Hustler: { from: "#F59E0B", to: "#EA580C" },
      Hacker: { from: "#3B82F6", to: "#4F46E5" },
      Hipster: { from: "#EC4899", to: "#9333EA" },
      Hound: { from: "#10B981", to: "#0D9488" },
    },
  },
  /* Dark gold for AA-safe headings on light surfaces (used via text-secondary-dark) */
  secondaryDark: "#9A6C00",
} as const;

export const GRADIENTS = {
  primary: "linear-gradient(to right, #203C90, #FFAC03)",
  primaryVertical: "linear-gradient(to bottom, #203C90, #FFAC03)",
  goldShine: "linear-gradient(135deg, #FFAC03 0%, #FFD700 50%, #FFAC03 100%)",
} as const;

export const SHADOWS = {
  card: "0px 3px 17px 0px hsl(0 0% 0% / 0.1)",
  elevated: "0px 8px 24px 0px hsl(0 0% 0% / 0.15)",
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const ANIMATION = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  },
} as const;
