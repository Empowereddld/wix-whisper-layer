import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// TEMPORARY Batch 5B test helper. Deleted after testing.
Deno.serve(async (req) => {
  if (req.headers.get("x-cron-secret") !== Deno.env.get("CRON_SECRET")) return new Response("no", { status: 401 });
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const b = await req.json();
  if (b.op === "create") {
    const { data, error } = await admin.auth.admin.createUser({ email: b.email, password: b.password, email_confirm: true });
    return Response.json({ id: data?.user?.id, error: error?.message });
  }
  if (b.op === "delete") {
    const { error } = await admin.auth.admin.deleteUser(b.id);
    return Response.json({ error: error?.message });
  }
  if (b.op === "upload") {
    const { error } = await admin.storage.from("resources-private").upload(b.path, new Blob(["test"]), { upsert: true });
    return Response.json({ error: error?.message });
  }
  if (b.op === "remove") {
    const { error } = await admin.storage.from("resources-private").remove([b.path]);
    return Response.json({ error: error?.message });
  }
  return new Response("bad", { status: 400 });
});
