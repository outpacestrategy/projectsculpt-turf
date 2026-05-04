import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HeroMobileCTA from "@/components/HeroMobileCTA";
import WeeklySchedule from "@/components/WeeklySchedule";
import Community from "@/components/Community";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import SEO, { BUSINESS_JSON_LD, SITE_URL } from "@/components/SEO";
import FAQ, { faqPageJsonLd, type FAQItem } from "@/components/FAQ";

// FAQs targeted at the queries we want to rank + surface inside AI search
// (ChatGPT, Perplexity, Gemini, Google AI Overviews). Answers are short,
// self-contained, and include named entities + location context on purpose —
// this is what generative engines extract cleanly.
const HOMEPAGE_FAQS: FAQItem[] = [
  {
    question: "What is Project Sculpt?",
    answer:
      "Project Sculpt is personal training — but in a group. Every class stays small so our coaches cue your form, scale your loads, and adjust every rep the way a personal trainer would, while you get the energy of training alongside other athletes. We're based at 207 SW 5th St in downtown Fort Lauderdale and program HYROX, strength and conditioning, and running.",
  },
  {
    question: "Is there a HYROX gym in Fort Lauderdale?",
    answer:
      "Yes — Project Sculpt is a HYROX-focused gym in Fort Lauderdale. We train all eight HYROX stations (SkiErg, sled push, sled pull, burpee broad jumps, rowing, farmer's carry, sandbag lunges, wall balls) and the 1K run intervals between them, to competition standard.",
  },
  {
    question: "What makes Project Sculpt different from other gyms in Fort Lauderdale?",
    answer:
      "Most Fort Lauderdale gyms are either big-box rooms with no coaching or boutique cardio classes with no programming. We're small-group training with a structured weekly split — strength days, conditioning days, HYROX days — and coaches who actually correct your form on the floor.",
  },
  {
    question: "Do you offer group fitness training or just personal training?",
    answer:
      "Both. Our small-group fitness classes cap size so the coach can see every athlete. For members who need a dedicated plan — HYROX race prep, rehab, sport-specific goals — our head coaches also take a limited number of 1-on-1 personal training clients.",
  },
  {
    question: "Is this a running gym too?",
    answer:
      "Yes. We pair coached running workouts (tempo, threshold, long runs) with strength training built for runners — posterior chain, single-leg stability, and trunk work. It's ideal prep for the A1A Half, local 5Ks, and the run blocks inside HYROX.",
  },
  {
    question: "I'm a beginner — will I fit in?",
    answer:
      "Yes. Every movement scales, and our coaches adjust loads and variations in real time. Day-one beginners train alongside veteran athletes and both leave with the right stimulus. The first class is free — use code FTL.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Your first class is free with code FTL. After that we offer drop-in rates and unlimited monthly memberships. Email info@projectsculpt-turf.com or use the contact form for current pricing.",
  },
  {
    question: "What are your hours?",
    answer:
      "Monday through Friday: 5:30 AM to 8:00 PM. Saturday and Sunday: 7:00 AM to 12:00 PM. Check the weekly schedule above for today's classes.",
  },
  {
    question: "Where are you located and what neighborhoods do you serve?",
    answer:
      "We're at 207 SW 5th St, Fort Lauderdale, FL 33301 — minutes from Las Olas Boulevard, Victoria Park, Flagler Village, Rio Vista, Wilton Manors, Oakland Park, and the rest of Broward County.",
  },
];

const Index = () => {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }],
  };

  return (
    <>
      <SEO
        title="Project Sculpt | HYROX Gym & Group Fitness in Fort Lauderdale"
        description="Fort Lauderdale's HYROX-focused training gym. Small-group strength, conditioning, running, and personal training with real coaching. First class free — use code FTL."
        keywords="gyms in Fort Lauderdale, HYROX, HYROX gyms in Fort Lauderdale, HYROX training Florida, running gyms, running club Fort Lauderdale, group fitness training, group fitness Fort Lauderdale, personal training Fort Lauderdale, strength and conditioning gym, workout studio Las Olas"
        canonical="/"
        jsonLd={[BUSINESS_JSON_LD, faqPageJsonLd(HOMEPAGE_FAQS), breadcrumbJsonLd]}
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <HeroMobileCTA />
          <WeeklySchedule />
          <Community />
          <FAQ
            faqs={HOMEPAGE_FAQS}
            eyebrow="FAQ"
            subtitle="Straight answers about HYROX, group fitness, personal training, and what it's like to train at Project Sculpt."
            defaultOpenCount={2}
            className="section-padding bg-gradient-to-b from-background to-secondary/30"
          />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
