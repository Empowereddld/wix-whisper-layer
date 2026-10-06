// TEMPORARY: issues an already-expired dashboard token for ONE hardcoded test row. Deleted after testing.
const TEST_ID = "252c847d-86f3-4136-805f-67198dd864d4";
Deno.serve(async () => {
  const now = Math.floor(Date.now() / 1000);
  const iat = now - 3 * 86400, exp = now - 60;
  const payload = `v1.${TEST_ID}.${iat}.${exp}`;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(Deno.env.get("STORYPROS_DASHBOARD_SECRET")!),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`sp-dashboard:${payload}`));
  const b64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return new Response(`${payload}.${b64}`);
});
