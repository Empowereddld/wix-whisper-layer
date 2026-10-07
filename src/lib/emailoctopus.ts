import { supabase } from "@/integrations/supabase/client";

/**
 * Which form the signup came from. The server decides which mailing-list tags
 * each source applies, and only syncs an email that form just saved.
 * "hub" syncs the signed-in user's own email.
 */
export type EmailOctopusSource = "footer" | "workshop" | "educational-app" | "contact" | "lead" | "hub";

/**
 * Fire-and-forget sync of a signup into EmailOctopus.
 * Never throws: a newsletter-platform hiccup must not affect the signup flow.
 */
export function syncToEmailOctopus(params: { source: EmailOctopusSource; email?: string }): void {
  const email = params.email?.trim();
  if (params.source !== "hub" && !email) return;

  supabase.functions
    .invoke("emailoctopus-subscribe", {
      body: params.source === "hub" ? { source: "hub" } : { source: params.source, email },
    })
    .catch((e) => console.warn("EmailOctopus sync failed:", e));
}
