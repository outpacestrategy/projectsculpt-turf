import { Users, Target, Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: Users,
    title: "Small Group Training",
    description: "Train with a tight-knit group—never lost in the room.",
  },
  {
    icon: Target,
    title: "Personal Coaching",
    description: "Coaches cue form, progress loads, and modify per athlete.",
  },
  {
    icon: Calendar,
    title: "Structured Programming",
    description: "Purpose-built weekly splits so nothing is random.",
  },
];

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="section-padding bg-gradient-to-b from-background to-secondary/30"
    >
      <div className="container mx-auto px-6 sm:px-8">
        <div className="text-center mb-12 sm:mb-16 flex flex-col items-center">
          <h2 className={`heading-lg mb-4 text-center ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
            The <span className="text-primary">Sculpt</span> Difference
          </h2>
          <p className={`body-lg max-w-2xl mx-auto ${isVisible ? "animate-fade-up delay-100" : "opacity-0"}`} style={{ animationFillMode: 'forwards' }}>
            Personal training precision meets high-energy group dynamics
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`card-training text-center ${
                isVisible ? `animate-fade-up delay-${(index + 2) * 100}` : "opacity-0"
              }`}
              style={{ animationFillMode: 'forwards' }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-6">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="heading-md mb-4">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className={`text-center ${isVisible ? "animate-fade-up delay-500" : "opacity-0"}`} style={{ animationFillMode: 'forwards' }}>
          <a href="#cta" className="btn-secondary inline-block">
            Start Your Free Trial
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
