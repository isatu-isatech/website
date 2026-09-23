/**
 * Session-scoped membership draft persistence (quiz FR-008 parity).
 *
 * An in-progress application survives an accidental page refresh or
 * back/forward navigation within the same browser session: the record lives
 * in `sessionStorage` (per-tab, discarded when the tab closes). A stored
 * record whose version no longer matches, or whose campaign no longer matches
 * the active campaign, is discarded — so a restored draft is never
 * inconsistent with the current form or campaign.
 *
 * The single-use Turnstile token is never persisted (it is consumed by the
 * server on every submit attempt); restores always force it back to `""`.
 */

export const APPLY_DRAFT_KEY = "isatech-apply-draft-v1";

export const APPLY_TOTAL_STEPS = 7;

/**
 * Allowlist of persistable field names — keep in sync with
 * `membershipFormSchema` keys in `src/app/membership/apply/schema.ts`,
 * minus the submit-only `turnstileToken` (never persisted).
 */
const APPLY_FIELD_NAMES = [
  "fullName",
  "nickname",
  "studentId",
  "email",
  "mobileNumber",
  "birthdate",
  "sex",
  "facebookUrl",
  "college",
  "program",
  "yearLevel",
  "primaryRole",
  "secondaryRole",
  "relatedSkills",
  "relatedExperiences",
  "availability",
  "eventAttendanceWillingness",
  "otherOrgs",
  "privacyConsent",
  "declarationConsent",
] as const;

export interface SavedApplyDraft {
  version: string;
  campaignId: string;
  step: number;
  /** Sanitized values — strings/booleans only, no Turnstile token. */
  values: Record<string, string | boolean>;
}

/**
 * Version token derived from the persistable field list plus the step count.
 * Any field add/remove/rename invalidates stale records so restored values
 * are never replayed against a changed form.
 */
export function makeApplyVersion(): string {
  let hash = 0;
  const sig = JSON.stringify({
    fields: APPLY_FIELD_NAMES,
    steps: APPLY_TOTAL_STEPS,
  });
  for (let i = 0; i < sig.length; i++) {
    hash = (hash * 31 + sig.charCodeAt(i)) | 0;
  }
  return `v1:${APPLY_TOTAL_STEPS}:${(hash >>> 0).toString(36)}`;
}

function isValidStep(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= APPLY_TOTAL_STEPS
  );
}

/** Keep only allowlisted string/boolean entries (drops tokens + unknowns). */
function sanitizeValues(input: unknown): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  if (typeof input !== "object" || input === null) return out;
  const src = input as Record<string, unknown>;
  for (const key of APPLY_FIELD_NAMES) {
    const value = src[key];
    if (typeof value === "string" || typeof value === "boolean") {
      out[key] = value;
    }
  }
  return out;
}

/**
 * Restore the saved draft for the given campaign, or `null` when
 * absent/stale/malformed/for another campaign. A stale cross-campaign record
 * is removed so it can never leak into the next campaign's form.
 */
export function loadDraft(
  expectedCampaignId: string | null,
): SavedApplyDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(APPLY_DRAFT_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const record = parsed as Record<string, unknown>;

    if (record.version !== makeApplyVersion()) {
      window.sessionStorage.removeItem(APPLY_DRAFT_KEY);
      return null;
    }
    if (
      typeof record.campaignId !== "string" ||
      record.campaignId.length === 0
    ) {
      return null;
    }
    if (!expectedCampaignId || record.campaignId !== expectedCampaignId) {
      // Another campaign (or none active) — drop the stale record.
      if (record.campaignId !== expectedCampaignId) {
        window.sessionStorage.removeItem(APPLY_DRAFT_KEY);
      }
      return null;
    }
    if (!isValidStep(record.step)) return null;

    return {
      version: record.version as string,
      campaignId: record.campaignId,
      step: record.step,
      values: sanitizeValues(record.values),
    };
  } catch {
    return null;
  }
}

/** Persist the current in-progress draft (Turnstile token never stored). */
export function saveDraft(draft: {
  version: string;
  campaignId: string;
  step: number;
  values: Record<string, unknown>;
}): void {
  if (typeof window === "undefined") return;
  try {
    const record: SavedApplyDraft = {
      version: draft.version,
      campaignId: draft.campaignId,
      step: draft.step,
      values: sanitizeValues(draft.values),
    };
    window.sessionStorage.setItem(APPLY_DRAFT_KEY, JSON.stringify(record));
  } catch {
    // Storage unavailable (private mode / quota) — the form still works,
    // it just won't survive a refresh.
  }
}

/** Discard the saved draft (submitted, reset to intro, or stale record). */
export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(APPLY_DRAFT_KEY);
  } catch {
    // Ignore — nothing to recover from here.
  }
}
