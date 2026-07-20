// Security regression tests for private resource file delivery.
//
// These tests guard against the two findings we fixed:
//   1. resource_private_files_no_purchaser_access
//   2. resources_bucket_public_read_bypasses_is_private
//
// They assert that:
//   - The `resource_private_files` table is not readable by anon/unauthenticated
//     clients (private storage paths must never leak to the browser).
//   - The `generate-download-url` edge function refuses requests without a
//     valid user JWT (this is the only sanctioned way to obtain a signed URL).
//   - The `resources-private` storage bucket does not serve objects over the
//     public /object/public/ path (bucket must stay private).
//
// Run with:  supabase--test_edge_functions { "functions": ["generate-download-url"] }

import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;

assert(SUPABASE_URL, "VITE_SUPABASE_URL must be set");
assert(SUPABASE_ANON_KEY, "VITE_SUPABASE_PUBLISHABLE_KEY must be set");

Deno.test("resource_private_files is not readable by anon clients", async () => {
  // Query PostgREST directly with the anon key. RLS must return either an
  // error or an empty array — any leaked storage_path would defeat the
  // entire private-file design.
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/resource_private_files?select=resource_id,storage_path&limit=5`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    },
  );
  const body = await res.text();

  if (res.status === 200) {
    const rows = JSON.parse(body);
    assertEquals(
      Array.isArray(rows) ? rows.length : -1,
      0,
      `resource_private_files must not return rows to anon. Got: ${body}`,
    );
  } else {
    assert(
      res.status === 401 || res.status === 403 || res.status === 404,
      `Unexpected status ${res.status} for anon read: ${body}`,
    );
  }
});

Deno.test("generate-download-url rejects requests without a user JWT", async () => {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-download-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resource_id: "00000000-0000-0000-0000-000000000000" }),
  });
  const body = await res.text();
  assertEquals(res.status, 401, `Expected 401 for no auth, got ${res.status}: ${body}`);
});

Deno.test("generate-download-url rejects the bare anon key (no signed-in user)", async () => {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-download-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ resource_id: "00000000-0000-0000-0000-000000000000" }),
  });
  const body = await res.text();
  assertEquals(
    res.status,
    401,
    `Anon key alone must not grant a signed URL. Got ${res.status}: ${body}`,
  );
});

Deno.test("resources-private bucket does not serve objects on the public path", async () => {
  // If someone flips the bucket to public, this endpoint would return the file
  // bytes instead of a 400/404. The exact path does not need to exist — we
  // only care that public delivery is refused for the bucket as a whole.
  const url = `${SUPABASE_URL}/storage/v1/object/public/resources-private/probe-does-not-exist.pdf`;
  const res = await fetch(url);
  await res.text();
  assert(
    res.status === 400 || res.status === 404,
    `resources-private must not be publicly readable. Got status ${res.status}`,
  );
});
