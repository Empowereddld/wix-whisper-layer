// TEMPORARY test helper: signs claim tokens for ONE hardcoded test row only. Deleted after testing.
const TEST_ID = "6d6a6a6b-b061-429f-88cf-8d1c38d86515";
Deno.serve(async (req) => {
  const offset = Number(new URL(req.url).searchParams.get("offset") ?? "3600");
  const exp = String(Math.floor(Date.now() / 1000) + offset);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`founder-claim:v2:${TEST_ID}:${exp}`));
  const b64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return new Response(`${TEST_ID}.${exp}.${b64}`);
});
