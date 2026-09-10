import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, PERSON_ID, breadcrumbSchema, faqSchema } from "@/lib/seo";
import UKContent from "./UKContent";

const TITLE = "Custom Web Development Company for UK & London Businesses | Snigdha Chandra Paik";
const DESCRIPTION =
  "Bespoke custom web development for UK and London businesses: fast, animated Next.js & Shopify websites built remotely with same-day replies in UK hours.";
const CANONICAL = `${SITE_URL}/website-developer-uk`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "web development company uk",
    "website development company uk",
    "custom web development uk",
    "bespoke web design agency",
    "web development london",
    "web development company london",
    "website developer uk",
    "web developer uk",
    "shopify developer uk",
    "shopify agency uk",
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
  {
    q: "Are you a web development company or a freelance developer?",
    a: "Both, in the sense that matters. It's a one-person web development studio, not a large agency: you get the same fixed-quote, professionally managed process, but every line of code and every SEO decision comes from the person you're actually talking to.",
  },
  {
    q: "Do you build Shopify stores specifically for UK fashion and interiors brands?",
    a: "Yes, that's a specific focus. The House of Abigail and The British Stripe Co. are both live, custom-coded Shopify builds for UK fashion and interiors brands, not templated themes.",
  },
  {
    q: "Which is the best web development company in the UK?",
    a: "That depends on the brief. For a bespoke, custom-coded Next.js or Shopify site with direct developer access and no agency markup, that's the specialism here. For a large in-house team handling dozens of projects at once, a bigger London agency may be the better fit.",
  },
  {
    q: "Do you build websites for London businesses specifically?",
    a: "Yes. London fashion and interiors brands are the strongest track record so far (The House of Abigail, The British Stripe Co.), but the same custom web development process applies to any UK city.",
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
