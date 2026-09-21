"use client";

function formatCountdown(totalSeconds: number): string {
  const clamped = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Kiosk idle-reset countdown pill.
 *
 * The visual timer updates every second (aria-hidden) while the
 * screen-reader announcement only changes at coarse thresholds, so
 * assistive tech isn't spammed once per second.
 */
export function IdleCountdown({ secondsLeft }: { secondsLeft: number }) {
  const visual = formatCountdown(secondsLeft);
  const announcement =
    secondsLeft > 30
      ? "Session resets in about a minute due to inactivity. Interact to continue."
      : secondsLeft > 10
        ? `Session resets in about ${Math.ceil(secondsLeft / 10) * 10} seconds due to inactivity.`
        : `Session resets in ${Math.max(0, Math.ceil(secondsLeft))} seconds due to inactivity.`;

  return (
    <div className="mb-2 flex w-full justify-center">
      <p
        role="status"
        className="border-secondary/50 bg-secondary/10 text-secondary-dark dark:text-secondary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tabular-nums"
      >
        <span aria-hidden="true">Resetting in {visual} — tap to continue</span>
        <span className="sr-only">{announcement}</span>
      </p>
    </div>
  );
}
