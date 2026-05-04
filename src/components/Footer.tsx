import { Instagram, Facebook, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/project-sculpt-logo.svg";
import { trackSubscribe } from "@/lib/analytics";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("https://formsubmit.co/ajax/info@projectsculpt-turf.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: trimmed,
          _subject: "New newsletter signup - Project Sculpt",
          source: "footer_newsletter",
        }),
      });

      if (response.ok) {
        trackSubscribe("footer_newsletter");
        setIsSubscribed(true);
        setEmail("");
      } else {
        setError("Something went wrong. Email us at info@projectsculpt-turf.com.");
      }
    } catch {
      setError("Something went wrong. Email us at info@projectsculpt-turf.com.");
    }
    setIsSubmitting(false);
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 sm:px-8 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 text-center sm:text-left">
            <Link to="/" className="inline-block mb-4">
              <img 
                src={logo} 
                alt="Project Sculpt Fitness Fort Lauderdale" 
                className="h-12 w-auto mx-auto sm:mx-0"
              />
            </Link>
            <p className="text-muted-foreground max-w-md mb-6 mx-auto sm:mx-0">
              Personal training attention in a high-energy group setting. Fort Lauderdale's premier training studio.
            </p>
            <div className="flex gap-4 justify-center sm:justify-start">
              <a
                href="https://instagram.com/projectsculpt_turf"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-border hover:border-primary hover:text-primary transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="https://facebook.com/projectsculpt_turf"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-border hover:border-primary hover:text-primary transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="mailto:info@projectsculpt-turf.com"
                className="p-2 border border-border hover:border-primary hover:text-primary transition-colors"
                aria-label="Send us an email"
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Links */}
          <nav className="text-center sm:text-left" aria-label="Footer navigation">
            <h4 className="font-display text-lg tracking-wider mb-4">Training</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/hyrox" className="text-muted-foreground hover:text-foreground transition-colors">
                  HYROX Training
                </Link>
              </li>
              <li>
                <Link to="/group-fitness" className="text-muted-foreground hover:text-foreground transition-colors">
                  Group Fitness
                </Link>
              </li>
              <li>
                <Link to="/personal-training" className="text-muted-foreground hover:text-foreground transition-colors">
                  Personal Training
                </Link>
              </li>
              <li>
                <Link to="/running" className="text-muted-foreground hover:text-foreground transition-colors">
                  Running Club
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="text-muted-foreground hover:text-foreground transition-colors">
                  Schedule
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-muted-foreground hover:text-foreground transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Newsletter */}
          <div className="text-center sm:text-left">
            <h4 className="font-display text-lg tracking-wider mb-4">Stay Updated</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Get workouts, events, and exclusive offers.
            </p>
            {isSubscribed ? (
              <p className="text-primary font-medium">Thanks for subscribing! 💪</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-xs mx-auto sm:mx-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-center sm:text-left"
                  required
                  aria-label="Email address"
                />
                <button type="submit" disabled={isSubmitting} className="btn-primary text-sm py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </button>
                {error && <p className="text-destructive text-xs mt-1">{error}</p>}
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Project Sculpt Fort Lauderdale. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            <a 
              href="https://outpacestrategygroup.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Powered by Outpace
            </a>
          </p>
          <p className="text-muted-foreground text-sm">
            📍 Fort Lauderdale, FL
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
