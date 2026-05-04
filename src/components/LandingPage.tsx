import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO, { BUSINESS_JSON_LD, SITE_URL } from "@/components/SEO";
import FAQ, { faqPageJsonLd, type FAQItem } from "@/components/FAQ";
import { CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export interface LandingPageProps {
  path: string; // canonical path, e.g. "/hyrox"
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  eyebrow: string; // small tag above the H1
  h1: ReactNode; // may contain <span className="text-primary"> highlights
  lead: string;
  benefits: { title: string; body: string }[];
  breakdownTitle: string;
  breakdownBody: ReactNode;
  faqs: FAQItem[];
  internalLinks?: { label: string; to: string }[];
}

const LandingPage = ({
  path,
  metaTitle,
  metaDescription,
  metaKeywords,
  eyebrow,
  h1,
  lead,
  benefits,
  breakdownTitle,
  breakdownBody,
  faqs,
  internalLinks = [],
}: LandingPageProps) => {
  const canonical = `${SITE_URL}${path}`;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: metaTitle,
    description: metaDescription,
    url: canonical,
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: [
      { "@type": "City", name: "Fort Lauderdale" },
      { "@type": "City", name: "Las Olas" },
      { "@type": "AdministrativeArea", name: "Broward County" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Class offerings",
      itemListElement: benefits.map((b, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: { "@type": "Service", name: b.title },
      })),
    },
  };

  const faqJsonLd = faqPageJsonLd(faqs);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: eyebrow, item: canonical },
    ],
  };

  return (
    <>
      <SEO
        title={metaTitle}
        description={metaDescription}
        keywords={metaKeywords}
        canonical={path}
        jsonLd={[BUSINESS_JSON_LD, serviceJsonLd, faqJsonLd, breadcrumbJsonLd]}
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Hero */}
          <section className="section-padding bg-gradient-to-b from-secondary/40 to-background">
            <div className="container mx-auto max-w-4xl text-center">
              <p className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-primary uppercase mb-4 animate-fade-up">
                {eyebrow}
              </p>
              <h1 className="heading-xl mb-6 animate-fade-up delay-100" style={{ animationFillMode: "forwards" }}>
                {h1}
              </h1>
              <p
                className="body-lg max-w-2xl mx-auto mb-8 animate-fade-up delay-200"
                style={{ animationFillMode: "forwards" }}
              >
                {lead}
              </p>
              <div
                className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-up delay-300"
                style={{ animationFillMode: "forwards" }}
              >
                <a
                  href="/schedule"
                  onClick={() => trackEvent("landing_cta_schedule", { page: path })}
                  className="btn-hero inline-flex flex-col items-center"
                >
                  <span>First Class Free</span>
                  <span className="text-sm font-normal tracking-wider">
                    Use Code <span className="font-bold">FTL</span>
                  </span>
                </a>
                <Link
                  to="/contact"
                  onClick={() => trackEvent("landing_cta_contact", { page: path })}
                  className="btn-secondary text-center"
                >
                  Talk to a Coach
                </Link>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="section-padding">
            <div className="container mx-auto max-w-5xl">
              <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                {benefits.map((b) => (
                  <div key={b.title} className="card-training">
                    <CheckCircle2 className="w-7 h-7 text-primary mb-4" aria-hidden="true" />
                    <h2 className="heading-md mb-3">{b.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{b.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Long-form content */}
          <section className="section-padding bg-gradient-to-b from-background to-secondary/30">
            <div className="container mx-auto max-w-3xl">
              <h2 className="heading-lg mb-6">{breakdownTitle}</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                {breakdownBody}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <FAQ faqs={faqs} eyebrow="FAQ" defaultOpenCount={1} />


          {/* Internal links */}
          {internalLinks.length > 0 && (
            <section className="section-padding bg-gradient-to-b from-secondary/30 to-background">
              <div className="container mx-auto max-w-3xl text-center">
                <h2 className="heading-md mb-6">Explore More</h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {internalLinks.map((l) => (
                    <Link key={l.to} to={l.to} className="btn-secondary text-sm">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Bottom CTA */}
          <section className="section-padding">
            <div className="container mx-auto max-w-3xl text-center">
              <h2 className="heading-lg mb-6">
                Ready to <span className="text-primary">train?</span>
              </h2>
              <p className="body-lg mb-8">
                Your first class is on us. No contracts, no gimmicks — just real coaching.
              </p>
              <a
                href="/schedule"
                onClick={() => trackEvent("landing_bottom_cta", { page: path })}
                className="btn-hero inline-flex flex-col items-center"
              >
                <span>First Class Free</span>
                <span className="text-sm font-normal tracking-wider">
                  Use Code <span className="font-bold">FTL</span>
                </span>
              </a>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
