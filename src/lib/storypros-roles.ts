// Story Pros member role definitions.
// Kept simple at signup so people don't drop off; "Other" lets folks tell us
// in their own words and gives us free segmentation data to mine later.

export type StoryProsRole = "parent" | "speech_pro" | "other";

export const ROLE_OPTIONS: { value: StoryProsRole; label: string }[] = [
  { value: "parent", label: "Parent / Caregiver" },
  { value: "speech_pro", label: "Speech Professional" },
  { value: "other", label: "Other" },
];

export const ROLE_OTHER_MAX_LENGTH = 60;

const LABELS: Record<StoryProsRole, string> = {
  parent: "Parent / Caregiver",
  speech_pro: "Speech Professional",
  other: "Other",
};

/**
 * Friendly display label for a member role.
 * For "Other", appends the user's free-text detail (e.g. "Other: Grandparent").
 */
export function formatRole(
  role: string | null | undefined,
  roleOther?: string | null
): string {
  if (!role) return "";
  const known = (role as StoryProsRole) in LABELS ? (role as StoryProsRole) : null;
  if (!known) return "";
  if (known === "other") {
    const detail = (roleOther || "").trim();
    return detail ? `Other: ${detail}` : "Other";
  }
  return LABELS[known];
}

/**
 * Returns true when this role+detail pair is acceptable for save.
 * - role must be one of the known codes
 * - if role === "other", roleOther must be non-empty and within max length
 */
export function isValidRoleSelection(
  role: string | null | undefined,
  roleOther?: string | null
): boolean {
  if (!role) return false;
  if (!(role in LABELS)) return false;
  if (role === "other") {
    const detail = (roleOther || "").trim();
    if (!detail) return false;
    if (detail.length > ROLE_OTHER_MAX_LENGTH) return false;
  }
  return true;
}
