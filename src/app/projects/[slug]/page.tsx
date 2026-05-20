import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbSchema, PERSON_ID } from "@/lib/seo";
import {
  getProjectBySlug,
  getProjectSlugsWithCaseStudy,
  getProjects,
  type Project,
} from "@/lib/projectService";
import CaseStudyView from "@/components/projects/CaseStudyView";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getProjectSlugsWithCaseStudy();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  const title =
    project.metaTitle?.trim() ||
    `${project.title} — Case Study | Snigdha Chandra Paik`;
  const description =
    project.metaDescription?.trim() || project.description;
  const canonical = `/projects/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { "en-IN": canonical },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Snigdha Chandra Paik",
      locale: "en_IN",
      type: "article",
      images: [
        {
          url: project.image,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [project.image],
    },
  };
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function injectHeadingIds(html: string): {
  processed: string;
  headings: { id: string; text: string }[];
} {
  const headings: { id: string; text: string }[] = [];
  const processed = html.replace(/<h2.*?>(.*?)<\/h2>/g, (_match, inner) => {
    const cleanText = String(inner).replace(/<[^>]*>?/gm, "").trim();
    const id = slugifyHeading(cleanText);
    headings.push({ id, text: cleanText });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { processed, headings };
}

function pickNextCaseStudy(
  all: Project[],
  currentSlug: string,
): Project | null {
  const caseStudies = all.filter((p) => p.hasCaseStudy);
  if (caseStudies.length <= 1) return null;
  const currentIndex = caseStudies.findIndex((p) => p.slug === currentSlug);
  const nextIndex = (currentIndex + 1) % caseStudies.length;
  return caseStudies[nextIndex] ?? null;
}

export default async function ProjectCaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [allProjects] = await Promise.all([getProjects()]);
  const { processed, headings } = injectHeadingIds(project.caseStudy);
  const nextProject = pickNextCaseStudy(allProjects, slug);

  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image: project.image,
    url: `${SITE_URL}/projects/${slug}`,
    keywords: project.tech.join(", "),
    creator: { "@id": PERSON_ID },
    ...(project.link ? { sameAs: project.link } : {}),
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Projects", url: `${SITE_URL}/projects` },
            { name: project.title, url: `${SITE_URL}/projects/${slug}` },
          ]),
          creativeWorkSchema,
        ]}
      />
      <CaseStudyView
        project={project}
        processedContent={processed}
        headings={headings}
        nextProject={nextProject}
      />
    </>
  );
}
