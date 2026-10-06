import { issueUnsubscribeToken } from "../_shared/unsubscribeToken.ts";
Deno.serve(async (req) => {
  if (req.headers.get("x-cron-secret") !== Deno.env.get("CRON_SECRET")) return new Response("no", { status: 403 });
  const { email } = await req.json();
  return Response.json({
    valid: await issueUnsubscribeToken(email),
    expired: await issueUnsubscribeToken(email, -60),
  });
});
