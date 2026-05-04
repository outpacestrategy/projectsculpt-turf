import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useState } from "react";
import { MapPin, Mail, Clock, Instagram } from "lucide-react";
import { z } from "zod";
import { trackLead } from "@/lib/analytics";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone number too long").optional(),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = contactSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof ContactFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("https://formsubmit.co/ajax/info@projectsculpt-turf.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: result.data.name,
          email: result.data.email,
          phone: result.data.phone || "Not provided",
          message: result.data.message,
          _subject: "New Contact Form Submission - Project Sculpt",
        }),
      });

      if (response.ok) {
        trackLead("contact_form", { form: "contact" });
        setIsSubmitted(true);
      } else {
        alert("Something went wrong. Please try again or email us directly at info@projectsculpt-turf.com");
      }
    } catch {
      alert("Something went wrong. Please try again or email us directly at info@projectsculpt-turf.com");
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <SEO
        title="Contact Us | Project Sculpt Fort Lauderdale"
        description="Get in touch with Project Sculpt. Questions about group fitness classes, HYROX training, or membership? We're here to help you start your fitness journey."
        keywords="contact Project Sculpt, Fort Lauderdale gym, fitness studio contact, HYROX training inquiry"
        canonical="/contact"
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Hero Section */}
          <section className="section-padding bg-gradient-to-b from-secondary/30 to-background">
            <div className="container mx-auto text-center">
              <h1 className="heading-xl mb-6 animate-fade-up">
                Get In <span className="text-primary">Touch</span>
              </h1>
              <p className="body-lg max-w-2xl mx-auto animate-fade-up delay-100" style={{ animationFillMode: 'forwards' }}>
                Questions? Ready to start? We're here to help.
              </p>
            </div>
          </section>

          {/* Contact Content */}
          <section className="section-padding">
            <div className="container mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Contact Form */}
                <ContactForm
                  formData={formData}
                  errors={errors}
                  isSubmitted={isSubmitted}
                  isSubmitting={isSubmitting}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                />

                {/* Contact Info */}
                <ContactInfo />
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="section-padding bg-gradient-to-b from-background to-secondary/30" aria-label="Call to action">
            <div className="container mx-auto text-center">
              <h2 className="heading-lg mb-6">
                Ready to <span className="text-primary">Start?</span>
              </h2>
              <a href="/schedule" className="btn-hero inline-block">
                First Class Free — Use Code <span className="font-bold">FTL</span>
              </a>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

/* ── Sub-components ── */

type ContactFormProps = {
  formData: ContactFormData;
  errors: Partial<Record<keyof ContactFormData, string>>;
  isSubmitted: boolean;
  isSubmitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

const ContactForm = ({ formData, errors, isSubmitted, isSubmitting, onChange, onSubmit }: ContactFormProps) => (
  <div className="animate-fade-up delay-200" style={{ animationFillMode: 'forwards' }}>
    <h2 className="heading-md mb-6">Send Us a Message</h2>

    {isSubmitted ? (
      <div className="bg-primary/10 border border-primary p-8 text-center">
        <div className="text-4xl mb-4">💪</div>
        <h3 className="heading-md mb-2">Message Sent!</h3>
        <p className="text-muted-foreground">
          We'll get back to you within 24 hours. Ready to train!
        </p>
      </div>
    ) : (
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">Name *</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={onChange}
            className={`w-full bg-secondary border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${errors.name ? "border-destructive" : "border-border focus:border-primary"}`}
            placeholder="Your name" />
          {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">Email *</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={onChange}
            className={`w-full bg-secondary border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${errors.email ? "border-destructive" : "border-border focus:border-primary"}`}
            placeholder="your@email.com" />
          {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone (optional)</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={onChange}
            className="w-full bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            placeholder="(555) 123-4567" />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">Message *</label>
          <textarea id="message" name="message" value={formData.message} onChange={onChange} rows={5}
            className={`w-full bg-secondary border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors resize-none ${errors.message ? "border-destructive" : "border-border focus:border-primary"}`}
            placeholder="Tell us about your fitness goals..." />
          {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    )}
  </div>
);

const ContactInfo = () => (
  <div className="animate-fade-up delay-300" style={{ animationFillMode: 'forwards' }}>
    <h2 className="heading-md mb-6">Visit Us</h2>

    <address className="space-y-6 mb-8 not-italic">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/10 border border-primary/30">
          <MapPin className="w-5 h-5 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-semibold mb-1">Location</h3>
          <p className="text-muted-foreground">
            207 SW Fifth St<br />
            Fort Lauderdale, FL 33301<br />
            United States
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/10 border border-primary/30">
          <Clock className="w-5 h-5 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-semibold mb-1">Hours</h3>
          <p className="text-muted-foreground">
            <time>Monday - Friday: 5:30 AM - 8:00 PM</time><br />
            <time>Saturday - Sunday: 7:00 AM - 12:00 PM</time>
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/10 border border-primary/30">
          <Mail className="w-5 h-5 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-semibold mb-1">Email</h3>
          <a href="mailto:info@projectsculpt-turf.com" className="text-muted-foreground hover:text-primary transition-colors">
            info@projectsculpt-turf.com
          </a>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/10 border border-primary/30">
          <Instagram className="w-5 h-5 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-semibold mb-1">Social</h3>
          <a href="https://instagram.com/projectsculpt_turf" target="_blank" rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors">
            @projectsculpt_turf
          </a>
        </div>
      </div>
    </address>

    {/* Google Map Embed */}
    <div className="aspect-video border border-border overflow-hidden">
      <iframe
        title="Project Sculpt Location - 207 SW Fifth St, Fort Lauderdale"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3583.0!2d-80.1448!3d26.1185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z207+SW+5th+St%2C+Fort+Lauderdale%2C+FL+33301!5e0!3m2!1sen!2sus!4v1700000000000"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full"
      />
    </div>
  </div>
);

export default Contact;
