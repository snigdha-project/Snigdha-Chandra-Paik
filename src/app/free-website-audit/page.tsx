import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, PERSON_ID, breadcrumbSchema, faqSchema } from "@/lib/seo";
import FreeAuditContent from "./FreeAuditContent";

const TITLE = "Free Website & SEO Audit | Snigdha Chandra Paik";
const DESCRIPTION =
  "Get a free, no-obligation website & SEO audit. Find out why your site isn't ranking or converting — and get a prioritised action plan to fix it, delivered within 48 hours.";
const CANONICAL = `${SITE_URL}/free-website-audit`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "free website audit",
    "free SEO audit",
    "website audit India",
    "SEO audit Kolkata",
    "free website review",
    "website performance audit",
    "technical SEO audit",
  ],
  alternates: {
    canonical: "/free-website-audit",
    languages: { "en-IN": "/free-website-audit" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/free-website-audit",
    siteName: "Snigdha Chandra Paik",
    locale: "en_IN",
    type: "website",
    images: [
      { url: "/OG/homeOG.png", width: 1200, height: 630, alt: TITLE },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/OG/homeOG.png"],
  },
};

const auditFaq = [
  {
    q: "Is the website audit really free?",
    a: "Yes — it's 100% free with no obligation. It's how I demonstrate the value I can add before you commit to anything.",
  },
  {
    q: "How long does the free audit take?",
    a: "You'll receive your personalised website and SEO audit within 48 hours of submitting your site.",
  },
  {
    q: "What does the free audit include?",
    a: "A prioritised, easy-to-read report covering SEO and keyword visibility, Core Web Vitals and speed, mobile experience, conversion and UX gaps, technical health, and a competitor comparison — plus the specific fixes to tackle first.",
  },
  {
    q: "Is there a catch or a sales pitch?",
    a: "No catch and no pressure. If you'd like help implementing the recommendations I'm available to hire, but the audit itself is genuinely free and yours to keep.",
  },
];

const auditServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Free Website & SEO Audit",
  serviceType: "Website and SEO Audit",
  description: DESCRIPTION,
  url: CANONICAL,
  provider: { "@id": PERSON_ID },
  areaServed: ["IN", "US", "GB", "AE", "Worldwide"],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: CANONICAL,
  },
};

export default function FreeAuditRoute() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Free Website Audit", url: CANONICAL },
          ]),
          auditServiceSchema,
          faqSchema(auditFaq),
        ]}
      />
      <FreeAuditContent faqs={auditFaq} />
    </>
  );
}
