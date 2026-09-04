import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, PERSON_ID, breadcrumbSchema, faqSchema } from "@/lib/seo";
import UKContent from "./UKContent";

const TITLE = "Website Developer for UK Businesses | Snigdha Chandra Paik";
const DESCRIPTION =
  "Fast, animated Next.js & Shopify websites for UK businesses, built remotely with same-day replies in UK hours. Technical SEO included. Free consultation.";
const CANONICAL = `${SITE_URL}/website-developer-uk`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "website developer uk",
    "web developer uk",
    "website development company uk",
    "website designer uk",
    "freelance web developer uk",
    "web design agency uk",
    "hire a web developer uk",
  ],
  alternates: {
    canonical: "/website-developer-uk",
    languages: { "en-GB": "/website-developer-uk" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/website-developer-uk",
    siteName: "Snigdha Chandra Paik",
    locale: "en_GB",
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
    q: "Do you work UK hours if you're based in India?",
    a: "Yes, development runs on a night-owl IST schedule specifically to overlap with UK working hours, so most enquiries get a same-day reply.",
  },
  {
    q: "How much does a website developer cost for a UK business?",
    a: "It depends on scope, but working directly with an independent developer is typically more cost-effective than a UK agency's day rate. You'll get one fixed quote after a free consultation.",
  },
  {
    q: "Can you quote in GBP?",
    a: "Yes, quotes can be given in GBP or USD, whichever is easier for your accounts team.",
  },
  {
    q: "Have you built for UK brands before?",
    a: "Yes, including The House of Abigail and The British Stripe Co., both live Shopify stores for UK fashion and interiors brands.",
  },
  {
    q: "What if I already have a UK web design agency and I'm not happy with them?",
    a: "A free audit is the easiest starting point. It flags exactly what's underperforming, whether that's speed, SEO or conversion, before you decide on a rebuild.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Website Development for UK Businesses",
  serviceType: "Website Development & SEO",
  description: DESCRIPTION,
  url: CANONICAL,
  provider: { "@id": PERSON_ID },
  areaServed: ["GB"],
};

export default function WebsiteDeveloperUKPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Website Developer for UK Businesses", url: CANONICAL },
          ]),
          serviceSchema,
          faqSchema(faqs),
        ]}
      />
      <UKContent />
    </>
  );
}
