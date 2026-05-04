import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WeeklySchedule from "@/components/WeeklySchedule";
import CTA from "@/components/CTA";
import SEO, { SITE_URL } from "@/components/SEO";

const Schedule = () => {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Schedule", item: `${SITE_URL}/schedule` },
    ],
  };

  return (
    <>
      <SEO
        title="Class Schedule | Project Sculpt Fort Lauderdale"
        description="See this week's class schedule at Project Sculpt — HYROX, strength & conditioning, running, and small-group fitness in downtown Fort Lauderdale. First class free with code FTL."
        keywords="Project Sculpt schedule, gym schedule Fort Lauderdale, HYROX class schedule, group fitness schedule Fort Lauderdale, weekly fitness classes Las Olas"
        canonical="/schedule"
        jsonLd={breadcrumbJsonLd}
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Hero */}
          <section className="section-padding bg-gradient-to-b from-secondary/30 to-background">
            <div className="container mx-auto text-center">
              <h1 className="heading-xl mb-6 animate-fade-up">
                Weekly <span className="text-primary">Schedule</span>
              </h1>
              <p
                className="body-lg max-w-2xl mx-auto animate-fade-up delay-100"
                style={{ animationFillMode: "forwards" }}
              >
                HYROX, strength &amp; conditioning, running, and small-group fitness —
                programmed week to week by our head coaches. First class free, use code{" "}
                <span className="font-bold text-primary">FTL</span>.
              </p>
            </div>
          </section>

          {/* Schedule */}
          <WeeklySchedule />

          {/* CTA */}
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Schedule;
