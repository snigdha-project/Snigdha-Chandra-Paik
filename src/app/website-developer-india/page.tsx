import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, PERSON_ID, breadcrumbSchema, faqSchema } from "@/lib/seo";
import IndiaContent from "./IndiaContent";

const TITLE = "Website Developer in India | Snigdha Chandra Paik: Next.js & SEO";
const DESCRIPTION =
  "Hire an independent website developer in India for animated, SEO-ready Next.js and ecommerce websites. Direct communication, fixed pricing, free consultation.";
const CANONICAL = `${SITE_URL}/website-developer-india`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "website developer in india",
    "web developer india",
    "website development company india",
    "website design company india",
    "best web development company in india",
    "hire web developer india",
    "freelance website developer india",
  ],
  alternates: {
    canonical: "/website-developer-india",
    languages: { "en-IN": "/website-developer-india" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/website-developer-india",
    siteName: "Snigdha Chandra Paik",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/OG/homeOG.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/OG/homeOG.png"],
  },
};

const faqs = [
  {
    q: "How much does a website developer in India charge?",
    a: "Pricing depends on scope: a brochure site, an ecommerce store and a custom web app all cost differently. You'll get one fixed, transparent quote after a free consultation, with no hourly surprises.",
  },
  {
    q: "Do you work with startups as well as established businesses?",
    a: "Yes, from early-stage Indian startups needing an MVP or landing page, to established manufacturers and retailers needing a full ecommerce rebuild.",
  },
  {
    q: "What makes you different from a typical web development company in India?",
    a: "Direct access to the developer, a modern Next.js/React stack instead of page-builder templates, and technical SEO built in from day one rather than sold as an add-on.",
  },
  {
    q: "Can you help an existing website rank better in India?",
    a: "Yes, start with a free website & SEO audit, which flags exactly what's holding your current site back before any redesign work begins.",
  },
  {
    q: "Which industries have you built websites for?",
    a: "Ecommerce and marketplaces, agritech, SaaS platforms, HVAC and home services, and fashion/retail brands, among others.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Website Development in India",
  serviceType: "Website Development & SEO",
  description: DESCRIPTION,
  url: CANONICAL,
  provider: { "@id": PERSON_ID },
  areaServed: ["IN"],
};

export default function WebsiteDeveloperIndiaPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Website Developer in India", url: CANONICAL },
          ]),
          serviceSchema,
          faqSchema(faqs),
        ]}
      />
      <IndiaContent />
    </>
  );
}
