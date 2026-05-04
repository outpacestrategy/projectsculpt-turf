import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ComponentProps } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO, { SITE_URL, DEFAULT_OG_IMAGE, SITE_NAME } from "@/components/SEO";
import NotFound from "./NotFound";
import {
  useBlogPost,
  useBlogPosts,
  readingMinutes,
} from "@/content/blog/queries";

const formatDate = (iso: string): string =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// Internal markdown links like [text](/schedule) should use React Router's
// client-side Link so navigation doesn't full-reload the page. External
// links get target=_blank + rel=noopener,noreferrer for safety.
const MarkdownLink = ({ href, children, ...rest }: ComponentProps<"a">) => {
  const isInternal = href && href.startsWith("/") && !href.startsWith("//");
  if (isInternal) {
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug);
  const { data: allPosts } = useBlogPosts();

  // While loading, render a minimal skeleton — SEO tags deliberately held
  // back until we know whether this slug is real, so we don't ship an empty
  // canonical on a 404 path.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <div className="container mx-auto max-w-3xl section-padding">
            <div className="h-10 w-3/4 bg-secondary/50 animate-pulse mb-6" />
            <div className="h-6 w-full bg-secondary/30 animate-pulse mb-3" />
            <div className="h-6 w-5/6 bg-secondary/30 animate-pulse" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) return <NotFound />;

  const canonical = `/blog/${post.slug}`;
  const absoluteUrl = `${SITE_URL}${canonical}`;
  const ogImage = post.ogImage
    ? post.ogImage.startsWith("http")
      ? post.ogImage
      : `${SITE_URL}${post.ogImage}`
    : DEFAULT_OG_IMAGE;

  const relatedPosts =
    (allPosts ?? []).filter((p) => p.slug !== post.slug).slice(0, 2);

  const readTime = readingMinutes(post.contentMd);

  // BlogPosting JSON-LD — the canonical structured-data type Google
  // requires for articles to be eligible for rich results and AI Overview
  // extraction.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: [ogImage],
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      "@type": "Organization",
      name: post.author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl,
    },
    keywords: post.keywords ?? post.tags.join(", "),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: absoluteUrl },
    ],
  };

  return (
    <>
      <SEO
        title={`${post.title} | ${SITE_NAME}`}
        description={post.description}
        keywords={post.keywords ?? undefined}
        canonical={canonical}
        ogImage={ogImage}
        ogType="article"
        jsonLd={[articleJsonLd, breadcrumbJsonLd]}
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <article>
            {/* Article header */}
            <header className="section-padding bg-gradient-to-b from-secondary/30 to-background">
              <div className="container mx-auto max-w-3xl">
                <nav
                  aria-label="Breadcrumb"
                  className="text-xs uppercase tracking-wider text-muted-foreground mb-6"
                >
                  <ol className="flex items-center gap-2">
                    <li>
                      <Link to="/" className="hover:text-primary transition-colors">
                        Home
                      </Link>
                    </li>
                    <li aria-hidden="true">/</li>
                    <li>
                      <Link to="/blog" className="hover:text-primary transition-colors">
                        Blog
                      </Link>
                    </li>
                    <li aria-hidden="true">/</li>
                    <li className="text-foreground">{post.tags[0] ?? "Post"}</li>
                  </ol>
                </nav>

                <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground mb-6">
                  {post.tags[0] && (
                    <>
                      <span className="text-primary font-semibold">
                        {post.tags[0]}
                      </span>
                      <span aria-hidden="true">·</span>
                    </>
                  )}
                  <time dateTime={post.datePublished}>
                    {formatDate(post.datePublished)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>{readTime} min read</span>
                </div>

                <h1 className="heading-xl mb-6">{post.title}</h1>
                <p className="body-lg text-muted-foreground">{post.description}</p>

                <p className="mt-8 text-sm text-muted-foreground">
                  By <span className="text-foreground">{post.author}</span>
                </p>
              </div>
            </header>

            {/* Article body */}
            <section className="section-padding">
              <div className="container mx-auto max-w-3xl prose-blog">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{ a: MarkdownLink }}
                >
                  {post.contentMd}
                </ReactMarkdown>
              </div>
            </section>
          </article>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <section className="section-padding bg-secondary/20 border-t border-border">
              <div className="container mx-auto max-w-5xl">
                <h2 className="heading-md mb-8">More from the journal</h2>
                <ul className="grid gap-6 md:grid-cols-2">
                  {relatedPosts.map((related) => (
                    <li key={related.id}>
                      <Link
                        to={`/blog/${related.slug}`}
                        className="group block border border-border bg-background p-6 hover:border-primary transition-colors h-full"
                      >
                        <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground mb-3">
                          {related.tags[0] && (
                            <span className="text-primary font-semibold">
                              {related.tags[0]}
                            </span>
                          )}
                        </div>
                        <h3 className="heading-sm mb-2 group-hover:text-primary transition-colors">
                          {related.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {related.excerpt}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* CTA */}
          <section
            className="section-padding bg-gradient-to-b from-background to-secondary/30"
            aria-label="Call to action"
          >
            <div className="container mx-auto text-center">
              <h2 className="heading-lg mb-6">
                Train with <span className="text-primary">us</span>
              </h2>
              <p className="body-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Your first class is on us. See what actual coaching feels like.
              </p>
              <Link to="/schedule" className="btn-hero inline-block">
                First Class Free — Use Code <span className="font-bold">FTL</span>
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
