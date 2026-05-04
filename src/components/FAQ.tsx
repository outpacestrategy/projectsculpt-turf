import { ReactNode } from "react";

export type FAQItem = { question: string; answer: string };

/**
 * Build a schema.org FAQPage object from the same data that renders in the DOM.
 * Keeping visible content and JSON-LD derived from a single source prevents
 * mismatch — Google and AI search (ChatGPT, Perplexity, Gemini) demote pages
 * where the rendered answer doesn't match the schema.
 */
export const faqPageJsonLd = (faqs: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
});

interface FAQProps {
  faqs: FAQItem[];
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: string;
  /** Keep the first N open by default — helps AI crawlers grab the most important answers. */
  defaultOpenCount?: number;
  className?: string;
  id?: string;
}

const FAQ = ({
  faqs,
  eyebrow = "FAQ",
  title = (
    <>
      Frequently Asked <span className="text-primary">Questions</span>
    </>
  ),
  subtitle,
  defaultOpenCount = 0,
  className = "section-padding",
  id = "faq",
}: FAQProps) => {
  if (!faqs?.length) return null;

  return (
    <section id={id} className={className} aria-labelledby={`${id}-heading`}>
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-10 md:mb-14">
          {eyebrow && (
            <p className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-primary uppercase mb-4">
              {eyebrow}
            </p>
          )}
          <h2 id={`${id}-heading`} className="heading-lg mb-4">
            {title}
          </h2>
          {subtitle && <p className="body-lg text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <details
              key={f.question}
              open={i < defaultOpenCount}
              className="group bg-card border border-border rounded-lg p-5 md:p-6 open:border-primary/50 transition-colors"
            >
              <summary className="cursor-pointer list-none flex justify-between items-start gap-4">
                <h3 className="font-display text-lg md:text-xl tracking-wide">{f.question}</h3>
                <span
                  className="text-primary text-2xl leading-none transition-transform group-open:rotate-45 shrink-0"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-muted-foreground leading-relaxed">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
