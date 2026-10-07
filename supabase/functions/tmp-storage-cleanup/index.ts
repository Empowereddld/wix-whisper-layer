// One-off cleanup; removed right after use.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const FILES = [
  "storypros/executive-function-skills-guide.pdf",
  "why-representation-matters-dld.pdf",
  "darias-tips-starting-conversations-poster.pdf",
];
Deno.serve(async (req) => {
  const s = Deno.env.get("CRON_SECRET");
  if (!s || req.headers.get("x-cron-secret") !== s) return new Response("Forbidden", { status: 403 });
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data, error } = await sb.storage.from("resources").remove(FILES);
  return new Response(JSON.stringify({ removed: data?.map((d) => d.name), error: error?.message }));
});
