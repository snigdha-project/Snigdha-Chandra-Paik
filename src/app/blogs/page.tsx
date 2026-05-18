import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import postsData from "@/content/posts.json";
import {
  SITE_URL,
  blogCollectionSchema,
  breadcrumbSchema,
} from "@/lib/seo";
import BlogsContent from "./BlogsContent";

const TITLE = "Frontend & SEO Blog | Snigdha Chandra Paik";
const DESCRIPTION =
  "Insights on Next.js, Three.js, Framer Motion, React Native and technical SEO. Frontend & automation journal by Snigdha Chandra Paik, India.";
const CANONICAL = `${SITE_URL}/blogs`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/blogs",
    languages: { "en-IN": "/blogs" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/blogs",
    siteName: "Snigdha Chandra Paik",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/OG/blogsOG.png",
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
    images: ["/OG/blogsOG.png"],
  },
};

export default function BlogsRoute() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Blogs", url: CANONICAL },
          ]),
          blogCollectionSchema(postsData),
        ]}
      />
      <BlogsContent />
    </>
  );
}
