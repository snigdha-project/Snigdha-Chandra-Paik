import type { Metadata } from "next";
import Hero from "@/components/about/Hero";
import Skills from "@/components/about/Skills";
import Parents from "@/components/about/Parents";
import Gurudev from "@/components/about/Gurudev";
import Favorites from "@/components/about/Favorites";
import JsonLd from "@/components/JsonLd";
import {
  SITE_URL,
  aboutPageSchema,
  breadcrumbSchema,
  faqSchema,
} from "@/lib/seo";

const TITLE = "About Snigdha Chandra Paik | Frontend Dev & SEO";
const DESCRIPTION =
  "Meet Snigdha Chandra Paik — a frontend developer and SEO specialist from West Bengal building animated, fast and search-ready web experiences.";
const CANONICAL = `${SITE_URL}/about`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/about",
    languages: { "en-IN": "/about" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/about",
    siteName: "Snigdha Chandra Paik",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/OG/aboutOG.png",
        width: 1200,
        height: 630,
        alt: TITLE,
      },
      {
        url: "/images/MyAboutImage.jpg",
        width: 1200,
        height: 1500,
        alt: "Snigdha Chandra Paik working on Next.js & Three.js frontend projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/OG/aboutOG.png"],
  },
};

const aboutFaq = [
  {
    q: "Who is Snigdha Chandra Paik?",
    a: "Snigdha Chandra Paik is a frontend developer and SEO specialist from West Bengal, India, building animated Next.js, Three.js, Framer Motion and React Native experiences with a focus on speed, structure and search visibility.",
  },
  {
    q: "What does Snigdha Chandra Paik specialise in?",
    a: "He specialises in frontend development and technical SEO — Next.js, Three.js, Framer Motion animations, React Native web apps, Python and N8N automation, plus Webflow and Shopify when needed.",
  },
  {
    q: "Where is Snigdha Chandra Paik based?",
    a: "His studio is in South 24 Parganas, West Bengal, India (PIN 743395). He works with clients globally — including the US, UK and India.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "About", url: CANONICAL },
          ]),
          aboutPageSchema,
          faqSchema(aboutFaq),
        ]}
      />
      <Hero />
      <Skills />
      <Parents />
      <Gurudev />
      <Favorites />
    </>
  );
}
