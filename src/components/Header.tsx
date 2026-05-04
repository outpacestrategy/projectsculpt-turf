import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/project-sculpt-logo.svg";
import { APP_LOGIN_URL } from "@/lib/links";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/schedule", label: "Schedule" },
    { href: "/team", label: "Team" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className="bg-background border-b border-border"
      role="banner"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="Project Sculpt Fitness Fort Lauderdale" 
              className="h-14 md:h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={handleNavClick}
                className="nav-link"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={APP_LOGIN_URL}
              className="nav-link"
              aria-label="Member log in (opens booking app)"
            >
              Log In
            </a>
            <Link
              to="/schedule"
              onClick={handleNavClick}
              className="btn-primary text-sm"
            >
              First Class Free
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden fixed top-0 right-0 bottom-0 w-[280px] bg-black z-50 transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-foreground"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-6 px-6 pt-8" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={handleNavClick}
              className="text-xl font-display uppercase tracking-wider text-foreground/80 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/schedule"
            onClick={handleNavClick}
            className="btn-hero mt-6 text-center"
          >
            First Class Free
          </Link>
          <a
            href={APP_LOGIN_URL}
            className="text-base font-display uppercase tracking-wider text-foreground/60 hover:text-primary transition-colors text-center mt-4"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Member log in (opens booking app)"
          >
            Member Log In
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
