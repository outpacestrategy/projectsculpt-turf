import { ChevronDown } from "lucide-react";
import heroPoster from "@/assets/hero-poster.jpg";

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-[70vh] sm:min-h-screen flex items-center justify-center overflow-hidden" aria-label="Welcome to Project Sculpt">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroPoster}
          aria-label="Project Sculpt training footage"
          className="w-full h-full object-cover"
        >
          {/* WebM first for Chrome/Firefox/Edge (smaller); MP4 fallback for Safari/iOS */}
          <source src="/videos/hero-video.webm" type="video/webm" />
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 sm:px-8 md:px-12 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="heading-xl mb-4 sm:mb-6 animate-fade-up text-center">
            Lifting with friends<br />
            <span className="text-primary">is just better.</span>
          </h1>
          
          <p className="hidden sm:block body-lg max-w-xl sm:max-w-2xl mx-auto mb-8 sm:mb-10 animate-fade-up delay-200 opacity-0 text-center px-2" style={{ animationFillMode: 'forwards' }}>
            Personal training attention. Group energy. Real results.
          </p>
          
          <div className="hidden sm:block animate-fade-up delay-300 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <a href="#schedule" className="btn-hero inline-flex flex-col items-center">
              <span>First Class Free</span>
              <span className="text-sm font-normal tracking-wider">Use Code <span className="font-bold">FTL</span></span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-float" aria-hidden="true">
        <ChevronDown className="w-8 h-8 text-foreground/50" />
      </div>
    </section>
  );
};

export default Hero;
