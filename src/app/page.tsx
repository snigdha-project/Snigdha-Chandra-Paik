import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Tech from "@/components/home/TechSection";
import Projects from "@/components/home/Projects";
import Hobbies from "@/components/home/Hobbies";
import Blogs from "@/components/home/Blogs";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbSchema } from "@/lib/seo";

const TITLE = "Snigdha Chandra Paik | Frontend & SEO Developer";
const DESCRIPTION =
  "Snigdha Chandra Paik — Frontend Developer & SEO specialist crafting animated Next.js, Three.js & React Native web apps from India.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/",
    languages: { "en-IN": "/" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "Snigdha Chandra Paik",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/OG/homeOG.png",
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
    images: ["/OG/homeOG.png"],
  },
};

export default function Home() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([{ name: "Home", url: SITE_URL }])}
      />
      <Hero />
      <About />
      <Tech />
      <Projects />
      <Hobbies />
      <Blogs />
    </>
  );
}
