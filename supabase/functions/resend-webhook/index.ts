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
    id: string;
    from?: string;
    to?: string;
    created_at?: string;
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
      return new Response(
        JSON.stringify({ error: "Invalid webhook payload" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const resendId = data.id;

    // Mirror status onto email_send_log (correlated by message_id = Resend id).
    const stampSendLog = async (patch: Record<string, unknown>) => {
      if (!resendId) return;
      const { error } = await supabase
        .from("email_send_log")
        .update(patch)
        .eq("message_id", resendId);
      if (error) console.error("email_send_log update failed:", error);
    };

    // Handle different event types
    switch (type) {
      case "email.sent": {
        // Email was sent successfully
        const { error } = await supabase
          .from("waitlist_emails")
          .update({
            status: "sent",
            resend_id: resendId,
          })
          .eq("resend_id", resendId);

        if (error) {
          console.error("Failed to update email status:", error);
        }
        await stampSendLog({ status: "sent" });
        break;
      }

      case "email.delivered": {
        // Email was delivered to recipient
        const { error } = await supabase
          .from("waitlist_emails")
          .update({
            status: "delivered",
          })
          .eq("resend_id", resendId);

        if (error) {
          console.error("Failed to update email status:", error);
        }
        await stampSendLog({ status: "delivered" });
        break;
      }

      case "email.opened": {
        // Email was opened by recipient
        const { error } = await supabase
          .from("waitlist_emails")
          .update({
            status: "opened",
            opened_at: new Date().toISOString(),
          })
          .eq("resend_id", resendId);

        if (error) {
          console.error("Failed to update email status:", error);
        }

        // Also award engagement points if this is a tracked email
        const { data: emailRecord } = await supabase
          .from("waitlist_emails")
          .select("recipient_email")
          .eq("resend_id", resendId)
          .single();

        if (emailRecord?.recipient_email) {
          // Award 2 points for opening email (if not already awarded for this email)
          const { data: existingEvent } = await supabase
            .from("waitlist_events")
            .select("id")
            .eq("user_email", emailRecord.recipient_email)
            .eq("event_type", "email_opened")
            .eq("metadata", JSON.stringify({ resend_id: resendId }))
            .maybeSingle();

          if (!existingEvent) {
            await supabase.rpc("award_waitlist_points", {
              p_email: emailRecord.recipient_email,
              p_points: 2,
              p_event_type: "email_opened",
              p_metadata: { resend_id: resendId },
            });
          }
        }
        break;
      }

      case "email.clicked": {
        // Email link was clicked
        const { error } = await supabase
          .from("waitlist_emails")
          .update({
            status: "clicked",
            clicked_at: new Date().toISOString(),
          })
          .eq("resend_id", resendId);

        if (error) {
          console.error("Failed to update email status:", error);
        }

        // Also award engagement points
        const { data: emailRecord } = await supabase
          .from("waitlist_emails")
          .select("recipient_email")
          .eq("resend_id", resendId)
          .single();

        if (emailRecord?.recipient_email) {
          // Award 5 points for clicking (if not already awarded)
          const { data: existingEvent } = await supabase
            .from("waitlist_events")
            .select("id")
            .eq("user_email", emailRecord.recipient_email)
            .eq("event_type", "email_clicked")
            .eq("metadata", JSON.stringify({ resend_id: resendId }))
            .maybeSingle();

          if (!existingEvent) {
            await supabase.rpc("award_waitlist_points", {
              p_email: emailRecord.recipient_email,
              p_points: 5,
              p_event_type: "email_clicked",
              p_metadata: { resend_id: resendId },
            });
          }
        }
        break;
      }

      case "email.bounced": {
        // Email bounced (hard bounce)
        const { error } = await supabase
          .from("waitlist_emails")
          .update({
            status: "bounced",
          })
          .eq("resend_id", resendId);

        if (error) {
          console.error("Failed to update email status:", error);
        }

        // Log fraud/bounced email
        const { data: emailRecord } = await supabase
          .from("waitlist_emails")
          .select("recipient_email")
          .eq("resend_id", resendId)
          .single();

        if (emailRecord?.recipient_email) {
          const { error: fraudError } = await supabase
            .from("waitlist_fraud_log")
            .insert({
              email: emailRecord.recipient_email,
              reason: "email_bounced",
              blocked: true,
            });

          if (fraudError) {
            console.error("Failed to log fraud:", fraudError);
          }

          // Mark user as fraud flagged
          await supabase
            .from("storybuilders_waitlist")
            .update({
              fraud_flagged: true,
              fraud_reason: "email_bounced",
            })
            .eq("email", emailRecord.recipient_email);
        }
        break;
      }

      case "email.complained": {
        // User marked as spam (complaint)
        const { data: emailRecord } = await supabase
          .from("waitlist_emails")
          .select("recipient_email")
          .eq("resend_id", resendId)
          .single();

        if (emailRecord?.recipient_email) {
          // Log fraud
          const { error: fraudError } = await supabase
            .from("waitlist_fraud_log")
            .insert({
              email: emailRecord.recipient_email,
              reason: "spam_complaint",
              blocked: true,
            });

          if (fraudError) {
            console.error("Failed to log fraud:", fraudError);
          }

          // Mark user as fraud flagged and update email status
          await supabase
            .from("storybuilders_waitlist")
            .update({
              fraud_flagged: true,
              fraud_reason: "spam_complaint",
            })
            .eq("email", emailRecord.recipient_email);

          await supabase
            .from("waitlist_emails")
            .update({
              status: "complained",
            })
            .eq("resend_id", resendId);
        }
        break;
      }

      default: {
        console.log(`Unhandled event type: ${type}`);
      }
    }

    return new Response(
      JSON.stringify({ success: true, event_type: type }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Webhook processing failed" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
