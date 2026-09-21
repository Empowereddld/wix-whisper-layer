import { supabase } from "@/integrations/supabase/client";

export type EmailOctopusTag =
  | "story-pros"
  | "resource-hub"
  | "newsletter"
  | "workshop"
  | "educational-app"
  | "contact"
  | "lead";

/**
 * Fire-and-forget sync of a signup into EmailOctopus.
 * Never throws: a newsletter-platform hiccup must not affect the signup flow.
 */
export function syncToEmailOctopus(params: {
  email: string;
  tag: EmailOctopusTag;
  firstName?: string;
  lastName?: string;
}): void {
  const email = params.email?.trim();
  if (!email) return;

  supabase.functions
    .invoke("emailoctopus-subscribe", {
      body: {
        email,
        tag: params.tag,
        first_name: params.firstName ?? "",
        last_name: params.lastName ?? "",
      },
    })
    .catch((e) => console.warn("EmailOctopus sync failed:", e));
}
