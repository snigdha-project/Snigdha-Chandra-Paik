import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import {
  SITE_URL,
  breadcrumbSchema,
  contactPageSchema,
  faqSchema,
} from "@/lib/seo";
import ContactContent from "./ContactContent";

const TITLE = "Contact Snigdha Paik | Frontend & SEO Expert";
const DESCRIPTION =
  "Hire Snigdha Chandra Paik for Next.js, Three.js, React Native, animation and SEO projects. Based in West Bengal, India. Replies within 24 hours.";
const CANONICAL = `${SITE_URL}/contact`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/contact",
    languages: { "en-IN": "/contact" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/contact",
    siteName: "Snigdha Chandra Paik",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/OG/contactOG.png",
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/OG/contactOG.png"],
  },
};

const contactFaq = [
  {
    q: "How can I hire Snigdha Chandra Paik for a Webflow project?",
    a: "Email snigdhachandrapaik@gmail.com or call +91 8391879168. Most enquiries receive a reply within 24 hours. He takes frontend, Next.js, Three.js, React Native, animation, automation and SEO projects.",
  },
  {
    q: "Does Snigdha Chandra Paik work with international clients?",
    a: "Yes. He has shipped enterprise sites for clients across the US, UK and India — including Daikin TMI, The House of Abigail and AMJ Mechanical.",
  },
  {
    q: "What is the typical response time?",
    a: "Within 24 hours. He works on a night-owl schedule (IST), so US and UK clients usually receive same-day replies.",
  },
];

export default function ContactRoute() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Contact", url: CANONICAL },
          ]),
          contactPageSchema,
          faqSchema(contactFaq),
        ]}
      />
      <ContactContent />
    </>
  );
}
