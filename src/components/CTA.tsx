import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const CTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="section-padding relative overflow-hidden"
      aria-label="Start your fitness journey"
    >
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 sm:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <h2 className={`heading-xl mb-4 sm:mb-6 text-center ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
            Train harder.<br />
            Train smarter.<br />
            <span className="text-primary">Train together.</span>
          </h2>

          <p className={`body-lg mb-8 sm:mb-10 text-center px-2 ${isVisible ? "animate-fade-up delay-100" : "opacity-0"}`} style={{ animationFillMode: 'forwards' }}>
            Join Fort Lauderdale's most committed training community.
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto ${isVisible ? "animate-fade-up delay-200" : "opacity-0"}`} style={{ animationFillMode: 'forwards' }}>
            <a href="#schedule" className="btn-hero animate-pulse-glow text-center inline-flex flex-col items-center">
              <span>First Class Free</span>
              <span className="text-sm font-normal tracking-wider">Use Code <span className="font-bold">FTL</span></span>
            </a>
            <Link to="/contact" className="btn-secondary text-center">
              Contact Us
            </Link>
          </div>

          {/* Location Badge */}
          <div className={`mt-8 sm:mt-12 ${isVisible ? "animate-fade-up delay-300" : "opacity-0"}`} style={{ animationFillMode: 'forwards' }}>
            <p className="text-muted-foreground text-sm text-center px-4">
              📍 Fort Lauderdale, FL • Backed by 3 successful NJ locations
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
