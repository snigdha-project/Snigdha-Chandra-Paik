import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbSchema, PERSON_ID } from "@/lib/seo";
import {
  getProjectBySlug,
  getProjectSlugsWithCaseStudy,
} from "@/lib/projectService";

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

  // Prefer the editor-supplied meta fields; fall back to derived defaults.
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

export default async function ProjectCaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

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
    <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-[#C56E3D] selection:text-white">
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

      {/* Top nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-[#050505]/80 border-b border-white/5 px-6 md:px-12 py-5 flex items-center justify-between">
        <Link
          href="/projects"
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/60 hover:text-[#C56E3D] transition-colors"
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-1"
          />
          All Projects
        </Link>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C56E3D]">
          Case Study
        </span>
      </nav>

      {/* Hero */}
      <header className="px-6 md:px-12 lg:px-24 pt-20 md:pt-28 pb-12 max-w-[1400px] mx-auto">
        <span className="text-[10px] uppercase tracking-[0.6em] text-[#C56E3D] font-black block mb-6">
          {project.category}
        </span>
        <h1 className="font-[family-name:var(--font-fraunces)] text-5xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[0.85]">
          {project.title}
        </h1>
        <p className="mt-10 text-white/55 text-lg md:text-2xl max-w-3xl leading-relaxed font-medium">
          {project.description}
        </p>

        {project.tech && project.tech.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <li
                key={t}
                className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-md border border-white/10 bg-white/[0.03] text-white/70"
              >
                {t}
              </li>
            ))}
          </ul>
        )}

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#C56E3D] hover:bg-[#A64D32] text-white text-[10px] uppercase tracking-[0.5em] font-black transition-colors"
          >
            Visit Live Site
            <ExternalLink size={14} />
          </a>
        )}
      </header>

      {/* Cover image */}
      <section className="px-6 md:px-12 lg:px-24 pb-16 md:pb-20 max-w-[1400px] mx-auto">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/5 bg-[#141414]">
          <Image
            src={project.image}
            alt={`${project.title} — ${project.category} case study cover`}
            fill
            sizes="(max-width: 1400px) 100vw, 1400px"
            priority
            className="object-cover"
          />
        </div>
      </section>

      {/* Case study body */}
      <article className="px-6 md:px-12 lg:px-24 pb-32 max-w-[900px] mx-auto">
        <div
          className="
            [&_p]:text-lg md:[&_p]:text-xl [&_p]:leading-relaxed [&_p]:mb-8 [&_p]:text-white/70
            [&_h2]:text-3xl md:[&_h2]:text-5xl [&_h2]:font-black [&_h2]:tracking-tighter [&_h2]:mt-16 [&_h2]:mb-8 [&_h2]:font-[family-name:var(--font-fraunces)] [&_h2]:scroll-mt-24
            [&_h3]:text-xl md:[&_h3]:text-2xl [&_h3]:font-black [&_h3]:mt-10 [&_h3]:mb-4
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-8 [&_li]:mb-2 [&_li]:text-white/70 [&_li]:font-medium
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-8
            [&_a]:text-[#C56E3D] [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-white
            [&_strong]:text-white
            [&_img]:rounded-2xl [&_img]:my-10
            [&_table]:w-full [&_table]:my-10 [&_table]:border [&_table]:border-white/10
            [&_th]:p-4 [&_th]:text-[10px] [&_th]:uppercase [&_th]:tracking-widest [&_th]:text-left [&_th]:border-b [&_th]:border-white/10
            [&_td]:p-4 [&_td]:border-b [&_td]:border-white/5
          "
          dangerouslySetInnerHTML={{ __html: project.caseStudy }}
        />
      </article>

      <footer className="px-6 md:px-12 lg:px-24 py-24 border-t border-white/5 max-w-[1400px] mx-auto text-center">
        <p className="text-[10px] uppercase tracking-[0.6em] text-[#C56E3D] font-black mb-8">
          Like what you see?
        </p>
        <Link
          href="/contact"
          className="font-[family-name:var(--font-fraunces)] text-4xl md:text-7xl font-black tracking-tighter hover:text-[#C56E3D] transition-colors inline-flex items-center gap-4"
        >
          Start a{" "}
          <span className="italic font-[family-name:var(--font-playfair)]">
            Conversation
          </span>
          <ArrowUpRight size={36} />
        </Link>
      </footer>
    </main>
  );
}
