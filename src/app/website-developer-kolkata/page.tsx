import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, PERSON_ID, breadcrumbSchema, faqSchema } from "@/lib/seo";
import KolkataContent from "./KolkataContent";

const TITLE = "Website Developer & SEO Expert in Kolkata | Snigdha Chandra Paik";
const DESCRIPTION =
  "Hire a website developer and SEO expert in Kolkata for fast, animated Next.js, ecommerce and WordPress websites. Free consultation, reply within 24 hours.";
const CANONICAL = `${SITE_URL}/website-developer-kolkata`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "website developer in kolkata",
    "web developer kolkata",
    "website designer kolkata",
    "web design company kolkata",
    "website development company kolkata",
    "ecommerce website developer kolkata",
    "freelance web developer kolkata",
    "seo expert kolkata",
  ],
  alternates: {
    canonical: "/website-developer-kolkata",
    languages: { "en-IN": "/website-developer-kolkata" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/website-developer-kolkata",
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
    q: "How much does a website developer in Kolkata charge?",
    a: "Pricing depends on scope: a brochure site, an ecommerce store and a custom web app all cost differently. You'll get one fixed, transparent quote after a free consultation, with no hourly surprises.",
  },
  {
    q: "Do you only build websites for Kolkata businesses?",
    a: "Kolkata and West Bengal are the local base, but most projects are for clients across India, the US and the UK. The same process and communication apply either way.",
  },
  {
    q: "What's the difference between hiring you and a Kolkata web design company?",
    a: "You deal directly with the developer building your site, no account managers, no junior handoffs, and get technical SEO built in from day one instead of sold as an add-on.",
  },
  {
    q: "Can you redesign my existing WordPress or Webflow site?",
    a: "Yes. Many projects start as an audit of an existing site, flagging what's broken or holding back rankings, followed by a redesign or targeted fixes rather than a full rebuild.",
  },
  {
    q: "How long does a typical website project take?",
    a: "A brochure or portfolio site usually launches in 2–3 weeks; ecommerce stores and custom web apps take longer depending on scope. You'll get a realistic timeline in the proposal.",
  },
  {
    q: "I just need an SEO expert in Kolkata, not a new website. Do you help with that?",
    a: "Yes. The free technical and local SEO audit is a standalone starting point for businesses that already have a site and just need schema markup, Core Web Vitals and Kolkata-specific keyword work done properly.",
  },
  {
    q: "How is this different from a website designer in Kolkata who only does design?",
    a: "A website designer without a development or SEO background can make a site look good but not necessarily rank or convert. Here, design, development and technical SEO come from the same person, so nothing gets lost between a designer, a developer and an SEO freelancer.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Website Development in Kolkata",
  serviceType: "Website Development & SEO",
  description: DESCRIPTION,
  url: CANONICAL,
  provider: { "@id": PERSON_ID },
  areaServed: ["Kolkata", "West Bengal", "IN"],
};

export default function WebsiteDeveloperKolkataPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Website Developer in Kolkata", url: CANONICAL },
          ]),
          serviceSchema,
          faqSchema(faqs),
        ]}
      />
      <KolkataContent />
    </>
  );
}
