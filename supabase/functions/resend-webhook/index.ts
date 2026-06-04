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

// Svix-style signature verification (Resend uses Svix under the hood).
// Header `svix-signature` looks like: "v1,<base64sig> v1,<base64sig>"
// Signed content = `${svix_id}.${svix_timestamp}.${rawBody}` HMAC-SHA256
// with the secret bytes (base64 portion after the "whsec_" prefix).
async function verifySvixSignature(
  rawBody: string,
  svixId: string,
  svixTimestamp: string,
  svixSignature: string,
  secret: string,
): Promise<boolean> {
  try {
    const secretBytes = Uint8Array.from(
      atob(secret.replace(/^whsec_/, "")),
      (c) => c.charCodeAt(0),
    );
    const key = await crypto.subtle.importKey(
      "raw",
      secretBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const signed = `${svixId}.${svixTimestamp}.${rawBody}`;
    const mac = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(signed),
    );
    const expected = btoa(String.fromCharCode(...new Uint8Array(mac)));
    // Header may contain multiple space-separated "v1,<sig>" entries.
    return svixSignature
      .split(" ")
      .map((part) => part.split(",")[1])
      .filter(Boolean)
      .some((sig) => sig === expected);
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawBody = await req.text();

    // Verify signature using the webhook secret from Resend.
    const webhookSecret = Deno.env.get("RESEND_WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.error("RESEND_WEBHOOK_SECRET not configured");
      return new Response(JSON.stringify({ error: "Webhook not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response(JSON.stringify({ error: "Missing signature headers" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const valid = await verifySvixSignature(
      rawBody,
      svixId,
      svixTimestamp,
      svixSignature,
      webhookSecret,
    );
    if (!valid) {
      console.error("Invalid webhook signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload: ResendEvent = JSON.parse(rawBody);
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
