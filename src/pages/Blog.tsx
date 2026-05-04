import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO, { SITE_URL } from "@/components/SEO";
import { useBlogPosts, readingMinutes, type BlogPost } from "@/content/blog/queries";

const formatDate = (iso: string): string =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const Blog = () => {
  const { data: posts, isLoading, error } = useBlogPosts();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
    ],
  };

  // Build a Blog + blogPost list from the live post set so AI engines
  // and Google crawlers see a consistent collection schema.
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog`,
    name: "Project Sculpt Blog",
    description:
      "Training guides, HYROX prep, running programming, and coaching insight from Project Sculpt in Fort Lauderdale.",
    url: `${SITE_URL}/blog`,
    blogPost: (posts ?? []).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      author: { "@type": "Organization", name: post.author },
    })),
  };

  return (
    <>
      <SEO
        title="Blog | Project Sculpt Fort Lauderdale Training Guides"
        description="HYROX prep, group fitness coaching, running programming, and training advice from Project Sculpt's coaches in Fort Lauderdale."
        keywords="Fort Lauderdale fitness blog, HYROX training blog, group fitness guides, running training Fort Lauderdale, Project Sculpt blog"
        canonical="/blog"
        jsonLd={[breadcrumbJsonLd, collectionJsonLd]}
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Hero */}
          <section className="section-padding bg-gradient-to-b from-secondary/30 to-background">
            <div className="container mx-auto text-center">
              <h1 className="heading-xl mb-6 animate-fade-up">
                Training <span className="text-primary">Journal</span>
              </h1>
              <p
                className="body-lg max-w-2xl mx-auto animate-fade-up delay-100"
                style={{ animationFillMode: "forwards" }}
              >
                Coaching guides, HYROX prep, running programming, and the
                actual playbook behind what we do at Project Sculpt Fort
                Lauderdale.
              </p>
            </div>
          </section>

          {/* Post grid */}
          <section className="section-padding">
            <div className="container mx-auto">
              <BlogGrid posts={posts} isLoading={isLoading} error={error} />
            </div>
          </section>

          {/* CTA */}
          <section
            className="section-padding bg-gradient-to-b from-background to-secondary/30"
            aria-label="Call to action"
          >
            <div className="container mx-auto text-center">
              <h2 className="heading-lg mb-6">
                Ready to <span className="text-primary">train?</span>
              </h2>
              <Link to="/schedule" className="btn-hero inline-block">
                First Class Free — Use Code{" "}
                <span className="font-bold">FTL</span>
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

type BlogGridProps = {
  posts: BlogPost[] | undefined;
  isLoading: boolean;
  error: unknown;
};

const BlogGrid = ({ posts, isLoading, error }: BlogGridProps) => {
  if (isLoading) {
    return (
      <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <li
            key={i}
            className="h-64 border border-border bg-secondary/20 animate-pulse"
          />
        ))}
      </ul>
    );
  }

  if (error) {
    return (
      <p className="text-center text-muted-foreground">
        Couldn't load posts right now. Please try again in a moment.
      </p>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        New posts coming soon.
      </p>
    );
  }

  return (
    <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.id} className="h-full">
          <Link
            to={`/blog/${post.slug}`}
            className="group flex flex-col h-full border border-border bg-secondary/20 p-6 hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground mb-4">
              <span className="text-primary font-semibold">
                {post.tags[0] ?? "Training"}
              </span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.datePublished}>
                {formatDate(post.datePublished)}
              </time>
            </div>
            <h2 className="heading-md mb-3 group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            <p className="text-muted-foreground mb-6 flex-1">{post.excerpt}</p>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Read more →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Blog;
