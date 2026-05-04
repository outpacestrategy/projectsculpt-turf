import { Helmet } from "react-helmet-async";

export const SITE_URL = "https://projectsculpt-turf.com";
export const SITE_NAME = "Project Sculpt";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": ["HealthClub", "SportsActivityLocation", "LocalBusiness"],
  "@id": `${SITE_URL}/#business`,
  name: SITE_NAME,
  alternateName: "Project Sculpt Fort Lauderdale",
  description:
    "HYROX-focused group training studio in Fort Lauderdale offering small-group strength, conditioning, running, and personal training. First class free.",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/og-image.jpg`,
  telephone: "",
  email: "info@projectsculpt-turf.com",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "207 SW 5th St",
    addressLocality: "Fort Lauderdale",
    addressRegion: "FL",
    postalCode: "33301",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 26.1185,
    longitude: -80.1448,
  },
  areaServed: [
    { "@type": "City", name: "Fort Lauderdale" },
    { "@type": "City", name: "Las Olas" },
    { "@type": "City", name: "Wilton Manors" },
    { "@type": "City", name: "Victoria Park" },
    { "@type": "City", name: "Oakland Park" },
    { "@type": "City", name: "Pompano Beach" },
    { "@type": "AdministrativeArea", name: "Broward County" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "05:30",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "07:00",
      closes: "12:00",
    },
  ],
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "HYROX training" },
    { "@type": "LocationFeatureSpecification", name: "Small-group coaching" },
    { "@type": "LocationFeatureSpecification", name: "Strength & conditioning" },
    { "@type": "LocationFeatureSpecification", name: "Running programming" },
    { "@type": "LocationFeatureSpecification", name: "Personal training" },
    { "@type": "LocationFeatureSpecification", name: "Free first class" },
  ],
  makesOffer: {
    "@type": "Offer",
    name: "First Class Free",
    description: "Your first group training class is on us. Use code FTL.",
    url: `${SITE_URL}/schedule`,
  },
  sameAs: [
    "https://instagram.com/projectsculpt_turf",
    "https://facebook.com/projectsculpt_turf",
  ],
};

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  jsonLd?: object | object[];
  noindex?: boolean;
}

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  jsonLd,
  noindex = false,
}: SEOProps) => {
  const fullCanonical = canonical
    ? `${SITE_URL}${canonical.startsWith("/") ? canonical : `/${canonical}`}`
    : SITE_URL;

  const robots = noindex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large";

  const structured = jsonLd ?? BUSINESS_JSON_LD;
  const structuredList = Array.isArray(structured) ? structured : [structured];

  return (
    <Helmet>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullCanonical} />

      {/* Robots */}
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@projectsculpt_turf" />
      <meta name="twitter:url" content={fullCanonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Geo / Author */}
      <meta name="author" content={SITE_NAME} />
      <meta name="geo.region" content="US-FL" />
      <meta name="geo.placename" content="Fort Lauderdale" />
      <meta name="geo.position" content="26.1185;-80.1448" />
      <meta name="ICBM" content="26.1185, -80.1448" />

      {/* JSON-LD Structured Data */}
      {structuredList.map((entry, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
