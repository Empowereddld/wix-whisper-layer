Deno.serve((req) => {
  const s = Deno.env.get("CRON_SECRET");
  if (!s || req.headers.get("x-cron-secret") !== s) return new Response("Forbidden", { status: 403 });
  const out: Record<string, string> = {};
  for (const k of ["x-forwarded-for", "cf-connecting-ip", "x-real-ip", "x-envoy-external-address", "true-client-ip"]) {
    const v = req.headers.get(k); if (v) out[k] = v.replace(/\d+(?=[.:][^.:]*$)/, "x");
  }
  return new Response(JSON.stringify(out));
});
