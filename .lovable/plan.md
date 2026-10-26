# Finish Stage 3: Stripe notifications set up through Claude

## Part 1: What you do in Claude

1. In Claude, open **Settings, then Connectors**, find **Stripe**, and connect it. Sign in to the Stripe account that sells the Parent Guidebook.
2. Start a new chat and paste the message below exactly as written:

```text
Using my connected Stripe account, in LIVE mode (not test mode), create one webhook endpoint (event destination) with these settings:

- Scope: my account (not connected accounts)
- Endpoint URL: https://haafpznzuazanylcelse.supabase.co/functions/v1/stripe-webhook
- Description: Empowered DLD guidebook fulfillment
- Enabled events (exactly these 8, nothing else):
  checkout.session.completed
  checkout.session.async_payment_succeeded
  checkout.session.async_payment_failed
  charge.refunded
  charge.dispute.created
  charge.dispute.updated
  charge.dispute.closed
  charge.dispute.funds_reinstated

Before creating it, list my existing webhook endpoints. If one already uses this exact URL, do not create a duplicate. Tell me instead.

After creating it, do NOT show me the signing secret (whsec_...) in this chat. Only confirm the endpoint ID, the URL, that it is live mode, and the list of enabled events.
```

3. When Claude confirms, go to the Stripe Dashboard: **Developers, then Webhooks**. Open the new destination, click **Reveal** under "Signing secret", and keep that page open.
4. Come back here and tell me it's done. Don't paste the secret into either chat.

Note: Stripe returns the signing secret to Claude once, when the destination is created. Claude can see it even if it doesn't show it to you. If that matters to you, create the destination by hand in Stripe instead, using the steps from my last message.

## Part 2: What I do after you tell me it's done

1. Open the secure form so you can paste the signing secret straight from Stripe. It never appears in chat.
2. Check that the site accepts real Stripe notices and refuses fake ones. I'll send a Stripe test notice, or you can use "Send test event" in Stripe, and confirm it arrives.
3. Report the Stage 3 results, then wait for your "continue" before Stage 4 (the confirmation email).

Nothing gets published. The checkout and Resource Library stay as they are.
