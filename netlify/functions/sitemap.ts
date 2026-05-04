/**
 * Dynamic sitemap.xml.
 *
 * Why this exists: blog posts live in Supabase and can be added without a
 * redeploy. A static `public/sitemap.xml` would go stale the moment an
 * editor publishes a new post from the Supabase Table Editor. This
 * function queries the live DB on every request, so `/sitemap.xml` always
 * reflects the true set of published posts within a short cache window.
 *
 * Netlify Functions don't see Vite's `VITE_`-prefixed env vars. The
 * Supabase URL and anon key are safe to embed — the anon key is designed
 * to be public and is already shipped in the client bundle — so we inline
 * them here and skip the env-var dance.
 */

// The publishable key is safe to commit (it's also shipped in the client
// bundle), so we keep these inline rather than fighting Netlify Functions'
// env-var rules.
const SUPABASE_URL = "https://wosnatgumgpawrfodwnp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_nFuxCjMOR0T16FZKkYM52A_ZWd69puh";

const SITE_URL = "https://projectsculpt-turf.com";

// Static routes (hand-maintained — change here when a new page ships).
// `lastmod` for static routes uses today's build date; posts use their
// DB-tracked dateModified value.
type StaticRoute = {
  path: string;
  changefreq: "weekly" | "monthly" | "yearly";
  priority: string;
};
const STATIC_ROUTES: StaticRoute[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/schedule", changefreq: "weekly", priority: "0.9" },
  { path: "/hyrox", changefreq: "monthly", priority: "0.9" },
  { path: "/group-fitness", changefreq: "monthly", priority: "0.9" },
  { path: "/personal-training", changefreq: "monthly", priority: "0.9" },
  { path: "/running", changefreq: "monthly", priority: "0.9" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/team", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "yearly", priority: "0.6" },
];

type BlogRow = { slug: string; date_modified: string };

const escapeXml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const urlEntry = (
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: string,
): string =>
  `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

export default async (): Promise<Response> => {
  const today = new Date().toISOString().slice(0, 10);

  // Pull every published post directly from the REST endpoint — skipping
  // the Supabase JS SDK keeps this function small and fast to cold-start.
  let posts: BlogRow[] = [];
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,date_modified&published=eq.true&order=date_published.desc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      },
    );
    if (res.ok) posts = (await res.json()) as BlogRow[];
  } catch {
    // Swallow — if Supabase is briefly unavailable we still want the static
    // routes in the sitemap rather than a 5xx for Googlebot.
  }

  const staticXml = STATIC_ROUTES.map((r) =>
    urlEntry(`${SITE_URL}${r.path}`, today, r.changefreq, r.priority),
  ).join("\n");

  const postsXml = posts
    .map((p) =>
      urlEntry(
        `${SITE_URL}/blog/${p.slug}`,
        p.date_modified,
        "monthly",
        "0.7",
      ),
    )
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticXml}${postsXml ? "\n" + postsXml : ""}\n</urlset>\n`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Cache at the edge for an hour — keeps Googlebot fast without
      // making new posts wait too long to show up in the sitemap.
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
};
