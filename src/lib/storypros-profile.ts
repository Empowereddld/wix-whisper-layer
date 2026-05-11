// Shared option sets and formatters for the Story Pros profile fields
// (child_age, hopes, hopes_other, hear_about). Used by the user dashboard
// and the admin Story Pros user detail modal so the labels stay in sync.

export const HOPE_OPTIONS = [
  { value: "understanding_stories", label: "Understanding stories" },
  { value: "retelling", label: "Retelling" },
  { value: "putting_events_in_order", label: "Putting events in order" },
  { value: "vocabulary", label: "Vocabulary" },
  { value: "confidence", label: "Confidence" },
  { value: "other", label: "Other" },
] as const;

export const HEAR_ABOUT_OPTIONS = [
  { value: "facebook_group", label: "Facebook group" },
  { value: "friend_or_family", label: "Friend or family referral" },
  { value: "slp_recommendation", label: "SLP recommendation" },
  { value: "social_media", label: "Social media" },
  { value: "other", label: "Other" },
] as const;

export const AGE_OPTIONS = Array.from({ length: 16 }, (_, i) => i + 3); // 3..18

export const AGE_RANGES: { value: string; label: string; test: (age: number) => boolean }[] = [
  { value: "any", label: "Any age", test: () => true },
  { value: "3-5", label: "3 to 5", test: (a) => a >= 3 && a <= 5 },
  { value: "6-8", label: "6 to 8", test: (a) => a >= 6 && a <= 8 },
  { value: "9-12", label: "9 to 12", test: (a) => a >= 9 && a <= 12 },
  { value: "13+", label: "13 and up", test: (a) => a >= 13 },
];

export const formatHope = (value: string): string =>
  HOPE_OPTIONS.find((o) => o.value === value)?.label ?? value;

export const formatHopes = (values: string[] | null | undefined): string => {
  if (!values || values.length === 0) return "—";
  return values.map(formatHope).join(", ");
};

export const formatHearAbout = (value: string | null | undefined): string => {
  if (!value) return "—";
  return HEAR_ABOUT_OPTIONS.find((o) => o.value === value)?.label ?? value;
};
