// TEMPORARY test helper: only issues tokens for one fixed test inbox.
import { issueUnsubscribeToken } from "../_shared/unsubscribeToken.ts";
const TEST = "delivered@resend.dev";
Deno.serve(async () => Response.json({
  valid: await issueUnsubscribeToken(TEST),
  expired: await issueUnsubscribeToken(TEST, -60),
}));
