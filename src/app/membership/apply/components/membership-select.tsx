"use client";

import { cn } from "@/lib/utils";

/** Shared native-select styling for the apply wizard (all steps). */
export const MEMBERSHIP_SELECT_CLASS = cn(
  "border-input bg-card dark:bg-input/30 flex h-9 w-full rounded-md border px-3 py-1 text-sm",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
);
