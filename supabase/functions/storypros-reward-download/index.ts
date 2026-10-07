// Email link target for the Story Pros Tier 2 reward guide.
// GET ?t=<signed reward token> -> 302 to a short-lived private file link
// when the member is verified with 35+ points; otherwise to the dashboard.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyRewardLinkToken, eligibleRewardUrl } from "../_shared/rewardFile.ts";

const SITE = "https://www.empowereddld.com";

Deno.serve(async (req) => {
  const fallback = (reason: string) =>
    new Response(null, { status: 302, headers: { Location: `${SITE}/storypros/dashboard?reward=${reason}` } });
  try {
    if (req.method !== "GET") return new Response("Method not allowed", { status: 405 });
    const v = await verifyRewardLinkToken(new URL(req.url).searchParams.get("t"));
    if ("error" in v) return fallback(v.error === "expired" ? "expired" : "invalid");
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const url = await eligibleRewardUrl(supabase, v.id);
    if (!url) return fallback("unavailable");
    return new Response(null, { status: 302, headers: { Location: url, "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("storypros-reward-download error:", e instanceof Error ? e.message : "unknown");
    return fallback("error");
  }
});
