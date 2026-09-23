import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Project-aware class merger.
 *
 * tailwind-merge only knows Tailwind's default theme, so our CSS-first
 * custom tokens are misclassified: an unknown `text-*` class (e.g. the
 * `text-caption` / `text-body` size helpers from globals.css) lands in the
 * COLOR group and silently strips a real theme color merged alongside it
 * (e.g. `text-primary-foreground` on `Button className="text-caption"` —
 * dark text on a blue button). Registering the theme colors and custom
 * sizes below keeps the two groups distinct so both classes survive.
 */
const twMerge = extendTailwindMerge({
  extend: {
    // tailwind-merge v3 follows the Tailwind v4 `--color-*` / `--text-*`
    // namespaces, so the scale keys are `color` / `text` (singular).
    theme: {
      color: [
        "background",
        "foreground",
        "card",
        "card-foreground",
        "popover",
        "popover-foreground",
        "primary",
        "primary-foreground",
        "secondary",
        "secondary-foreground",
        "secondary-dark",
        "muted",
        "muted-foreground",
        "accent",
        "accent-foreground",
        "destructive",
        "destructive-foreground",
        "border",
        "input",
        "ring",
        "chart-1",
        "chart-2",
        "chart-3",
        "chart-4",
        "chart-5",
        "sidebar",
        "sidebar-foreground",
        "sidebar-primary",
        "sidebar-primary-foreground",
        "sidebar-accent",
        "sidebar-accent-foreground",
        "sidebar-border",
        "sidebar-ring",
      ],
      text: ["body", "body-bold", "caption", "micro", "label"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
