// Public unsubscribe endpoint. Adds an email to suppressed_emails (idempotent).
// Called from the /unsubscribe page, no auth required.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { email, reason = "unsubscribe" } = await req.json();

    if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Valid email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const normalized = email.trim().toLowerCase();

    // Idempotent: ignore conflict on the unique email constraint.
    const { error } = await supabase
      .from("suppressed_emails")
      .upsert({ email: normalized, reason }, { onConflict: "email", ignoreDuplicates: true });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, email: normalized }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("email-unsubscribe error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unsubscribe failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
