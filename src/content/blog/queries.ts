import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Shape returned from the `public.blog_posts` table.
 *
 * Camelcase at the boundary — the DB columns use snake_case, we map once
 * here so the rest of the app never sees DB-y names.
 */
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  contentMd: string;
  author: string;
  datePublished: string;
  dateModified: string;
  tags: string[];
  keywords: string | null;
  ogImage: string | null;
  published: boolean;
}

// Fields we ALWAYS need for a post card on the index — keeps list queries
// small by leaving `content_md` behind until the detail view actually needs it.
const LIST_COLUMNS =
  "id, slug, title, description, excerpt, author, date_published, date_modified, tags, keywords, og_image, published";
const FULL_COLUMNS = `${LIST_COLUMNS}, content_md`;

// Words-per-minute assumption for the "5 min read" label. Avg adult silent
// reading is ~230 wpm for expository prose; we round to 200 for a slightly
// conservative estimate that matches how Medium/Substack show it.
const WORDS_PER_MINUTE = 200;
export const readingMinutes = (markdown: string): number =>
  Math.max(1, Math.round(markdown.trim().split(/\s+/).length / WORDS_PER_MINUTE));

type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  author: string;
  date_published: string;
  date_modified: string;
  tags: string[];
  keywords: string | null;
  og_image: string | null;
  published: boolean;
  content_md?: string;
};

const mapRow = (row: BlogPostRow): BlogPost => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  description: row.description,
  excerpt: row.excerpt,
  contentMd: row.content_md ?? "",
  author: row.author,
  datePublished: row.date_published,
  dateModified: row.date_modified,
  tags: row.tags,
  keywords: row.keywords,
  ogImage: row.og_image,
  published: row.published,
});

/** Fetch all published posts, newest first. Used by /blog. */
export const fetchPublishedPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    // `as any` — the generated Database types haven't been regenerated since
    // the blog_posts migration, but the shape is known. Drop the cast after
    // running `supabase gen types typescript` against the live project.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .from("blog_posts" as any)
    .select(LIST_COLUMNS)
    .eq("published", true)
    .order("date_published", { ascending: false });

  if (error) throw error;
  return (data as unknown as BlogPostRow[]).map(mapRow);
};

/** Fetch a single post by slug, including full markdown body. */
export const fetchPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .from("blog_posts" as any)
    .select(FULL_COLUMNS)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapRow(data as unknown as BlogPostRow);
};

/* ─── React Query hooks ─── */

export const useBlogPosts = () =>
  useQuery({
    queryKey: ["blog_posts", "published"],
    queryFn: fetchPublishedPosts,
    // Posts rarely change — cache aggressively. 5 min staleTime gives us
    // instant repeat-nav without blocking a refresh when it matters.
    staleTime: 5 * 60 * 1000,
  });

export const useBlogPost = (slug: string | undefined) =>
  useQuery({
    queryKey: ["blog_posts", slug],
    queryFn: () => fetchPostBySlug(slug as string),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });
