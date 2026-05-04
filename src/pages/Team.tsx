import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO, { SITE_URL, BUSINESS_JSON_LD } from "@/components/SEO";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Award, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Coach = {
  id: string;
  name: string;
  role: string;
  certifications: string;
  bio: string;
  image_url: string;
  sort_order: number;
};

/** Split "NASM Cert, HYROX Trainer" style strings into clean badges. */
const splitCerts = (s: string | null | undefined): string[] =>
  (s ?? "")
    .split(/[,|]/)
    .map((c) => c.trim())
    .filter(Boolean);

const CoachCard = ({ coach, index }: { coach: Coach; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(false);

  // Only show "Read more" if the bio actually overflows its clamp box.
  useEffect(() => {
    const el = bioRef.current;
    if (!el) return;
    // When collapsed, scrollHeight > clientHeight iff text overflows the line-clamp.
    setIsClamped(el.scrollHeight - 2 > el.clientHeight);
  }, [coach.bio]);

  const certs = splitCerts(coach.certifications);

  return (
    <article
      className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/60 hover:shadow-[0_12px_32px_-12px_hsla(195,100%,50%,0.25)] hover:-translate-y-1 animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms`, animationFillMode: "forwards" }}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        {coach.image_url ? (
          <img
            src={coach.image_url}
            alt={`${coach.name}, ${coach.role} at Project Sculpt Fort Lauderdale`}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            Photo coming soon
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card via-card/80 to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-5 md:p-6">
        <h2 className="font-display text-xl md:text-2xl tracking-wide leading-tight">{coach.name}</h2>
        <p className="text-primary font-semibold uppercase tracking-[0.15em] text-[11px] md:text-xs mt-1.5">
          {coach.role}
        </p>

        {certs.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 mt-3" aria-label="Certifications">
            {certs.map((c) => (
              <li
                key={c}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-[10px] md:text-[11px] font-mono uppercase tracking-wider"
              >
                <Award className="w-3 h-3" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        )}

        {coach.bio && (
          <div className="mt-4">
            <p
              ref={bioRef}
              className={`text-sm text-muted-foreground leading-relaxed whitespace-pre-line ${
                expanded ? "" : "line-clamp-6"
              }`}
            >
              {coach.bio}
            </p>
            {isClamped && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="mt-2 inline-flex items-center gap-1 text-xs text-primary font-semibold uppercase tracking-wider hover:underline focus:outline-none focus:ring-2 focus:ring-primary/40 rounded"
              >
                {expanded ? "Show less" : "Read more"}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

const CoachSkeleton = () => (
  <div className="flex flex-col bg-card border border-border rounded-xl overflow-hidden animate-pulse">
    <div className="aspect-[4/5] bg-secondary" />
    <div className="p-5 md:p-6 space-y-3">
      <div className="h-5 bg-secondary rounded w-2/3" />
      <div className="h-3 bg-secondary rounded w-1/3" />
      <div className="h-12 bg-secondary rounded mt-4" />
    </div>
  </div>
);

const Team = () => {
  const [coaches, setCoaches] = useState<Coach[] | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchCoaches = async () => {
      const { data } = await supabase.from("coaches").select("*").order("sort_order");
      if (mounted) setCoaches(data ?? []);
    };

    fetchCoaches();

    const channel = supabase
      .channel("coaches-team-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "coaches" }, fetchCoaches)
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const teamJsonLd =
    coaches && coaches.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Project Sculpt Coaching Team",
          itemListElement: coaches.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Person",
              name: c.name,
              jobTitle: c.role,
              image: c.image_url,
              worksFor: { "@id": `${SITE_URL}/#business` },
            },
          })),
        }
      : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Team", item: `${SITE_URL}/team` },
    ],
  };

  return (
    <>
      <SEO
        title="Our Coaches | Project Sculpt Fort Lauderdale"
        description="Meet the certified coaches at Project Sculpt — HYROX pros, strength specialists, and conditioning experts running small-group training in Fort Lauderdale."
        keywords="fitness coaches Fort Lauderdale, HYROX coach, personal trainer Fort Lauderdale, strength coach, certified trainers, small group coach"
        canonical="/team"
        jsonLd={[BUSINESS_JSON_LD, breadcrumbJsonLd, ...(teamJsonLd ? [teamJsonLd] : [])]}
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Hero */}
          <section className="pt-8 pb-10 md:pt-14 md:pb-16 bg-gradient-to-b from-secondary/30 to-background">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
              <p className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-primary uppercase mb-4 animate-fade-up">
                The Team
              </p>
              <h1
                className="heading-xl mb-4 animate-fade-up delay-100"
                style={{ animationFillMode: "forwards" }}
              >
                Meet Your <span className="text-primary">Coaches</span>
              </h1>
              <p
                className="body-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up delay-200"
                style={{ animationFillMode: "forwards" }}
              >
                Certified. Experienced. Actually watching your form. Our coaches are why small-group
                training at Project Sculpt feels like personal training.
              </p>
            </div>
          </section>

          {/* Team Grid */}
          <section className="pb-16 md:pb-24" aria-label="Coaching team">
            <div className="container mx-auto px-4 md:px-6 max-w-6xl">
              {coaches === null ? (
                // Loading skeleton
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <CoachSkeleton key={i} />
                  ))}
                </div>
              ) : coaches.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  Our coaching team will be announced shortly.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                  {coaches.map((coach, i) => (
                    <CoachCard key={coach.id} coach={coach} index={i} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* CTA */}
          <section className="section-padding bg-gradient-to-b from-background to-secondary/30">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
              <h2 className="heading-lg mb-4">
                Train with our <span className="text-primary">team</span>
              </h2>
              <p className="body-lg text-muted-foreground mb-8">
                Your first class is on us. See what being actually coached feels like.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <a href="/schedule" className="btn-hero inline-flex flex-col items-center">
                  <span>First Class Free</span>
                  <span className="text-sm font-normal tracking-wider">
                    Use Code <span className="font-bold">FTL</span>
                  </span>
                </a>
                <Link to="/contact" className="btn-secondary text-center">
                  Ask a Coach
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Team;
