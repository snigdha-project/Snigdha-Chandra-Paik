import Hero from "@/components/about/Hero";
import Skills from "@/components/about/Skills";
import Parents from "@/components/about/Parents";
import Gurudev from "@/components/about/Gurudev";
import Favorites from "@/components/about/Favorites";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Snigdha Chandra Paik",
  description:
    "Learn about Snigdha, a Web Developer and SEO expert specializing in Webflow and Next.js.",
  openGraph: {
    title: "About Snigdha Chandra Paik",
    description: "Web Developer & SEO Specialist",
    images: ["/about-og-image.jpg"],
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Skills />
      <Parents />
      <Gurudev />
      <Favorites />
      {/* Other sections like Projects, About, etc. will go here */}
    </main>
  );
}
