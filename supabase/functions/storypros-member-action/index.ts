// Story Pros member actions that need proof of ownership. Every action
// requires the server-signed dashboard pass; a referral code is never accepted.
// Point values are fixed here on the server; any value sent by the client is ignored.
//
// POST { dashboard_token, action, ... }
//   action = "claim_reward"      { reward_id }
//   action = "submit_suggestion" { text, category }
//   action = "vote_suggestion"   { suggestion_id }
//   action = "voted_suggestions"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyDashboardToken } from "../_shared/dashboardToken.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUGGESTION_POINTS = 5;
const REWARD_IDS = new Set([
  "tier_1_founding", "tier_2_ef_guide", "tier_3_coins",
  "tier_4_beta", "tier_5_founder_price", "tier_6_elite",
]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const body = await req.json().catch(() => ({}));
    const v = await verifyDashboardToken(body?.dashboard_token);
    if ("error" in v) return json({ success: false, error: v.error }, 401);

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: member } = await supabase
      .from("storybuilders_waitlist").select("id, referral_code")
      .eq("id", v.id).is("deleted_at", null).maybeSingle();
    if (!member?.referral_code) return json({ success: false, error: "not_found" }, 404);
    const code = member.referral_code;
    const one = (d: unknown) => (Array.isArray(d) ? d[0] : d);

    switch (body?.action) {
      case "claim_reward": {
        if (!REWARD_IDS.has(body?.reward_id)) return json({ success: false, message: "Unknown reward" }, 400);
        const { data, error } = await supabase.rpc("claim_waitlist_reward", {
          p_referral_code: code, p_reward_id: body.reward_id,
        });
        if (error) throw error;
        return json(one(data) ?? { success: false });
      }
      case "submit_suggestion": {
        const text = typeof body?.text === "string" ? body.text.slice(0, 1000) : "";
        const category = typeof body?.category === "string" ? body.category.slice(0, 40) : "";
        const { data, error } = await supabase.rpc("submit_waitlist_suggestion", {
          p_referral_code: code, p_text: text, p_category: category, p_points: SUGGESTION_POINTS,
        });
        if (error) throw error;
        return json(one(data) ?? { success: false });
      }
      case "vote_suggestion": {
        if (!UUID_RE.test(String(body?.suggestion_id))) return json({ success: false, message: "Invalid suggestion" }, 400);
        const { data, error } = await supabase.rpc("vote_waitlist_suggestion", {
          p_referral_code: code, p_suggestion_id: body.suggestion_id,
        });
        if (error) throw error;
        return json(one(data) ?? { success: false });
      }
      case "voted_suggestions": {
        const { data, error } = await supabase.rpc("get_user_voted_suggestions", { p_referral_code: code });
        if (error) throw error;
        return json({ success: true, ids: ((data as { suggestion_id: string }[]) || []).map((r) => r.suggestion_id) });
      }
      default:
        return json({ success: false, error: "unknown_action" }, 400);
    }
  } catch (err) {
    console.error("storypros-member-action error:", err);
    return json({ success: false, error: "internal" }, 500);
  }
});
