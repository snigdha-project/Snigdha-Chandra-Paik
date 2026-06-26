import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import {
  SITE_URL,
  breadcrumbSchema,
  projectsCollectionSchema,
} from "@/lib/seo";
import { getProjects } from "@/lib/projectService";
import { SideCtaRail } from "@/components/blog/BlogCta";
import ProjectsContent from "./ProjectsContent";

const TITLE = "Frontend Projects | Snigdha Chandra Paik";
const DESCRIPTION =
  "Explore Next.js, Three.js, React Native and SEO projects by Snigdha Chandra Paik — animated web apps, e-commerce stores and HVAC platforms.";
const CANONICAL = `${SITE_URL}/projects`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/projects",
    languages: { "en-IN": "/projects" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/projects",
    siteName: "Snigdha Chandra Paik",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/OG/projectsOG.png",
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
    images: ["/OG/projectsOG.png"],
  },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  const caseStudyProjects = projects.filter((p) => p.hasCaseStudy);
  const otherProjects = projects.filter((p) => !p.hasCaseStudy);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Projects", url: CANONICAL },
          ]),
          projectsCollectionSchema(projects),
        ]}
      />
      {/* DESKTOP-ONLY FLOATING CTAs (xl+) — both redirect to /contact */}
      <SideCtaRail side="left" label="Start a Project" tone="accent" />
      <SideCtaRail side="right" label="Let's Collaborate" tone="accent" />

      <ProjectsContent
        caseStudyProjects={caseStudyProjects}
        otherProjects={otherProjects}
      />
    </>
  );
}
