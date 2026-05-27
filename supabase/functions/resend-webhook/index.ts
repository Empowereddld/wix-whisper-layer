import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResendEvent {
  type: string;
  created_at: string;
  data: {
    id?: string;
    email_id?: string;
    to?: string | string[];
    from?: string;
    subject?: string;
    [key: string]: any;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: ResendEvent = await req.json();
    const { type, data } = payload;

    if (!type || !data) {
      return new Response(JSON.stringify({ error: "Invalid webhook payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Resend uses either `id` or (for some event types) `email_id`.
    const resendId: string | undefined = data.id ?? data.email_id;

    // Normalize recipient (Resend sends array on some events, string on others).
    const recipient: string | undefined = Array.isArray(data.to)
      ? data.to[0]?.toLowerCase()
      : (data.to as string | undefined)?.toLowerCase();

    // Mirror status onto email_send_log (correlated by message_id = Resend id).
    // email_send_log is append-only per the email infra contract, so we INSERT
    // a new status row rather than UPDATE the existing one.
    const logStatus = async (
      status: string,
      extra: Record<string, unknown> = {},
    ) => {
      if (!resendId) return;
      const { error } = await supabase.from("email_send_log").insert({
        message_id: resendId,
        recipient_email: recipient ?? "unknown",
        template_name: "webhook_event",
        status,
        metadata: { event_type: type, ...extra },
      });
      if (error) console.error("email_send_log insert failed:", error);
    };

    const suppress = async (reason: string) => {
      if (!recipient) return;
      const { error } = await supabase
        .from("suppressed_emails")
        .insert({ email: recipient, reason });
      // Unique-violation is fine — already suppressed.
      if (error && !`${error.message}`.toLowerCase().includes("duplicate")) {
        console.error("suppressed_emails insert failed:", error);
      }
    };

    switch (type) {
      case "email.sent":
        await logStatus("sent");
        break;
      case "email.delivered":
        await logStatus("delivered");
        break;
      case "email.opened":
        await logStatus("opened", { opened_at: new Date().toISOString() });
        break;
      case "email.clicked":
        await logStatus("clicked", {
          clicked_at: new Date().toISOString(),
          link: data.link ?? null,
        });
        break;
      case "email.bounced": {
        // Hard bounce → suppress so we don't keep mailing a dead address.
        const bounceType =
          (data.bounce?.type as string | undefined) ??
          (data.bounce_type as string | undefined) ??
          "unknown";
        await logStatus("bounced", { bounce_type: bounceType });
        // Only suppress on hard bounces; soft bounces can recover.
        if (bounceType.toLowerCase().includes("hard") || bounceType === "unknown") {
          await suppress("hard_bounce");
        }
        break;
      }
      case "email.complained": {
        await logStatus("complained");
        await suppress("spam_complaint");
        break;
      }
      case "email.delivery_delayed":
        await logStatus("delayed");
        break;
      default:
        console.log(`Unhandled event type: ${type}`);
    }

    return new Response(
      JSON.stringify({ success: true, event_type: type }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Webhook processing failed",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
