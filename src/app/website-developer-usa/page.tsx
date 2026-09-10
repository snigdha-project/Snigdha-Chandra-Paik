import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, PERSON_ID, breadcrumbSchema, faqSchema } from "@/lib/seo";
import USAContent from "./USAContent";

const TITLE = "HVAC Website Design & Web Development Company for US Businesses | Snigdha Chandra Paik";
const DESCRIPTION =
  "HVAC website design and a web development company for US businesses: fast, animated Next.js, Shopify & Webflow websites built remotely with US time-zone overlap.";
const CANONICAL = `${SITE_URL}/website-developer-usa`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "hvac website design",
    "hvac web design",
    "hvac website design company",
    "hvac web design agency",
    "web development company usa",
    "web development company in usa",
    "web development agency usa",
    "website developer usa",
    "web developer usa",
    "website development company usa",
    "website designer usa",
    "web developer united states",
    "hire a web developer usa",
  ],
  alternates: {
    canonical: "/website-developer-usa",
    languages: { "en-US": "/website-developer-usa" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/website-developer-usa",
    siteName: "Snigdha Chandra Paik",
    locale: "en_US",
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
    q: "Do you work US hours if you're based in India?",
    a: "Yes, the schedule is built around US time zones specifically so calls and revisions overlap with your working day.",
  },
  {
    q: "How much does a website developer cost for a US business?",
    a: "It depends on scope, but working directly with an independent developer is typically more cost-effective than a US agency's overhead. You'll get one fixed quote in USD after a free consultation.",
  },
  {
    q: "Do you have experience with US home-service businesses?",
    a: "Yes, HVAC, mechanical and sewer/septic service companies including Daikin TMI, AMJ Mechanical, Unlimited Heating & Refrigeration and Countryside Sewer & Septic are all live client sites.",
  },
  {
    q: "Can you handle a full ecommerce or SaaS build, not just a brochure site?",
    a: "Yes, recent projects range from Shopify DTC storefronts to a Next.js AI-driven marketplace platform.",
  },
  {
    q: "What if I already have a US web design agency and I'm not happy with them?",
    a: "A free audit is the easiest starting point. It flags exactly what's underperforming, whether that's speed, SEO or conversion, before you decide on a rebuild.",
  },
  {
    q: "Do you specialise in HVAC website design, or just build any kind of site?",
    a: "HVAC and home-service websites are a specific focus, not a one-off. Four live client sites (Daikin TMI, AMJ Mechanical, Unlimited Heating & Refrigeration, Countryside Sewer & Septic) are built around the searches homeowners actually use: emergency service, financing and service-area coverage.",
  },
  {
    q: "How much does HVAC website design cost?",
    a: "It depends on scope, but expect a meaningfully lower cost than an HVAC-specialist marketing agency for a comparable, custom-built (not templated) site. You'll get one fixed quote in USD after a free consultation.",
  },
  {
    q: "What makes a good HVAC website?",
    a: "Speed, a visible phone number and emergency-call CTA above the fold, service-area pages that actually match where the business operates, and LocalBusiness schema so Google understands the service area. All four live HVAC and home-service sites here are built on that checklist.",
  },
  {
    q: "Who designs the best HVAC websites?",
    a: "Dedicated HVAC marketing agencies are a solid option if you want a full ad and lead-gen package. If you just need a fast, custom-built site handled by the developer directly, that's the fit here, backed by four live HVAC and home-service client sites.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Website Development for US Businesses",
  serviceType: "Website Development & SEO",
  description: DESCRIPTION,
  url: CANONICAL,
  provider: { "@id": PERSON_ID },
  areaServed: ["US"],
};

export default function WebsiteDeveloperUSAPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Website Developer for US Businesses", url: CANONICAL },
          ]),
          serviceSchema,
          faqSchema(faqs),
        ]}
      />
      <USAContent />
    </>
  );
}
