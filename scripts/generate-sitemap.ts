// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
// Pulls published blog posts from Supabase so new posts auto-appear in the sitemap.

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://empowereddld.com";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const today = new Date().toISOString().split("T")[0];

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/who-we-serve", changefreq: "monthly", priority: "0.9" },
  { path: "/for-parents", changefreq: "monthly", priority: "0.9" },
  { path: "/for-therapists", changefreq: "monthly", priority: "0.9" },
  { path: "/for-educators", changefreq: "monthly", priority: "0.9" },
  { path: "/for-organizations", changefreq: "monthly", priority: "0.9" },
  { path: "/about-dld", changefreq: "monthly", priority: "0.9" },
  { path: "/resources", changefreq: "weekly", priority: "0.8" },
  { path: "/resources/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/resources/podcasts", changefreq: "monthly", priority: "0.7" },
  { path: "/resources/free-course", changefreq: "monthly", priority: "0.8" },
  { path: "/resources/downloadables", changefreq: "monthly", priority: "0.8" },
  { path: "/resources/language-impact-checklist", changefreq: "monthly", priority: "0.7" },
  { path: "/shop", changefreq: "weekly", priority: "0.8" },
  { path: "/shop/books", changefreq: "monthly", priority: "0.8" },
  { path: "/shop/bulk-orders", changefreq: "monthly", priority: "0.7" },
  { path: "/shop/educational-app", changefreq: "monthly", priority: "0.7" },
  { path: "/work-with-us", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/storypros", changefreq: "weekly", priority: "0.7" },
  { path: "/storypros/supporters", changefreq: "weekly", priority: "0.5" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms-and-conditions", changefreq: "yearly", priority: "0.3" },
  { path: "/disclaimer", changefreq: "yearly", priority: "0.3" },
];

async function fetchBlogEntries(): Promise<SitemapEntry[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("[sitemap] Supabase env vars missing; skipping blog posts.");
    return [];
  }
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,updated_at,published_at&status=eq.published`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (!res.ok) {
      console.warn(`[sitemap] Blog fetch failed: ${res.status}`);
      return [];
    }
    const rows = (await res.json()) as Array<{
      slug: string;
      updated_at: string | null;
      published_at: string | null;
    }>;
    return rows.map((row) => ({
      path: `/resources/blog/${row.slug}`,
      lastmod: (row.updated_at || row.published_at || "").split("T")[0] || today,
      changefreq: "monthly" as const,
      priority: "0.7",
    }));
  } catch (err) {
    console.warn(`[sitemap] Blog fetch error: ${(err as Error).message}`);
    return [];
  }
}

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      `    <lastmod>${e.lastmod || today}</lastmod>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n")
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

(async () => {
  const blogEntries = await fetchBlogEntries();
  const entries = [...staticEntries, ...blogEntries];
  writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
  console.log(`[sitemap] Wrote ${entries.length} entries (${blogEntries.length} blog posts).`);
})();
