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
  /* Quiz + brand surfaces — single JS-consumed source for result-screen, OG route, confetti,
     intro-screen and the quiz gradients/text classes. Tailwind class strings must stay
     literal here (Tailwind's scanner picks them up verbatim). */
  quiz: {
    generalist: { from: "#FFAC03", to: "#E08D00" }, // gold pair (secondary → deeper gold) — was violet
    archetypes: {
      Hustler: {
        from: "#F59E0B",
        to: "#EA580C",
        gradient: "from-amber-500 to-orange-600",
        text: "text-amber-500",
      },
      Hacker: {
        from: "#3B82F6",
        to: "#4F46E5",
        gradient: "from-blue-500 to-indigo-600",
        text: "text-blue-500",
      },
      Hipster: {
        from: "#EC4899",
        to: "#9333EA",
        gradient: "from-pink-500 to-purple-600",
        text: "text-pink-500",
      },
      Hound: {
        from: "#10B981",
        to: "#0D9488",
        gradient: "from-emerald-500 to-teal-600",
        text: "text-emerald-500",
      },
    },
  },
  /* Dark gold for AA-safe headings on light surfaces (used via text-secondary-dark) */
  secondaryDark: "#9A6C00",
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
