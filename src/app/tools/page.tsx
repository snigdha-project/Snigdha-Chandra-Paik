import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbSchema, toolsCollectionSchema } from "@/lib/seo";
import { getTools } from "@/lib/toolService";
import ToolsContent from "./ToolsContent";

const TITLE = "Free Online Tools: Calculators, Image Compressor & More | Snigdha Chandra Paik";
const DESCRIPTION =
  "Free online tools for marketing, SEO and web work: Google Ads and Meta Ads calculators, an image compressor and more. No sign-up required.";
const CANONICAL = `${SITE_URL}/tools`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools", languages: { "en-IN": "/tools" } },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/tools",
    siteName: "Snigdha Chandra Paik",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/OG/projectsOG.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/OG/projectsOG.png"],
  },
};

export default async function ToolsPage() {
  const tools = await getTools();
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Tools", url: CANONICAL },
          ]),
          toolsCollectionSchema(tools),
        ]}
      />
      <ToolsContent tools={tools} />
    </>
  );
}
