"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import type { Project, ProjectWithCaseStudy } from "@/lib/projectService";
import LivePreview from "./LivePreview";

function tryHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function CaseStudyView({
  project,
  processedContent,
  headings,
  nextProject,
}: {
  project: ProjectWithCaseStudy;
  processedContent: string;
  headings: { id: string; text: string }[];
  nextProject: Project | null;
}) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      {/* Reading progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#C56E3D] z-[60] origin-left"
        style={{ scaleX }}
      />

      <main className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden selection:bg-[#C56E3D] selection:text-white">
        {/* Sticky nav */}
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#050505]/80 border-b border-white/5 px-6 md:px-12 py-5 flex items-center justify-between">
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
          <div className="hidden sm:flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em]">
            <span className="text-[#C56E3D]">Case Study</span>
            <span className="h-[1px] w-8 bg-white/15" />
            <span className="text-white/50">{project.category}</span>
          </div>
        </nav>

        {/* HERO — single column, tighter, no facts sidebar */}
        <header className="px-6 md:px-12 lg:px-24 pt-20 md:pt-28 pb-14 md:pb-20 max-w-[1500px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-4 mb-8 flex-wrap">
              <span className="text-[10px] uppercase tracking-[0.6em] text-[#C56E3D] font-black">
                Case Study
              </span>
              <span className="h-[1px] w-12 bg-[#C56E3D]/40" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-black">
                {project.category}
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-fraunces)] text-5xl md:text-8xl lg:text-[9.5rem] font-black tracking-tighter leading-[0.85] mb-10 md:mb-14 max-w-[14ch]">
              {project.title}
            </h1>

            <p className="text-lg md:text-2xl text-white/65 leading-[1.55] font-medium max-w-3xl mb-10">
              {project.description}
            </p>

            {/* Inline meta row + CTA */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#C56E3D] hover:bg-[#A64D32] text-white text-[10px] uppercase tracking-[0.5em] font-black transition-colors"
                >
                  Visit Live Site
                  <ExternalLink size={13} />
                </a>
              )}

              {project.link && (
                <span className="text-[11px] tracking-wider text-white/40 font-mono">
                  {tryHostname(project.link)}
                </span>
              )}
            </div>

            {/* Tech stack as discreet chips */}
            {project.tech.length > 0 && (
              <ul className="mt-10 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <li
                    key={t}
                    className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-md border border-white/10 bg-white/[0.02] text-white/65"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </header>

        {/* LIVE PREVIEWS — replaces the cover image */}
        <LivePreview
          url={project.link}
          title={project.title}
          fallbackImage={project.image}
          fallbackAlt={`${project.title} — ${project.category} case study cover`}
        />

        {/* Body — two-column */}
        <section className="px-6 md:px-12 lg:px-24 max-w-[1500px] mx-auto pb-32 md:pb-40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Sticky TOC */}
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                {headings.length > 0 && (
                  <nav>
                    <span className="text-[9px] uppercase tracking-[0.5em] text-[#C56E3D] font-black block mb-6">
                      Contents
                    </span>
                    <ul className="flex flex-col gap-4 border-l border-white/10 pl-5">
                      {headings.map((h, i) => (
                        <li key={h.id}>
                          <a
                            href={`#${h.id}`}
                            className="group/toc flex items-start gap-3 text-xs font-bold text-white/45 hover:text-white transition-colors leading-snug"
                          >
                            <span className="text-[10px] font-mono text-white/20 group-hover/toc:text-[#C56E3D] mt-[1px] shrink-0">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span>{h.text}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </div>
            </aside>

            {/* Article body */}
            <article className="lg:col-span-9">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="
                  [&_p]:text-lg md:[&_p]:text-xl [&_p]:leading-[1.75] [&_p]:mb-8 [&_p]:text-white/75
                  [&_h2]:text-3xl md:[&_h2]:text-5xl [&_h2]:font-black [&_h2]:tracking-tighter [&_h2]:mt-20 [&_h2]:mb-8 [&_h2]:font-[family-name:var(--font-fraunces)] [&_h2]:scroll-mt-32 [&_h2]:leading-[1.05]
                  [&_h3]:text-xl md:[&_h3]:text-3xl [&_h3]:font-black [&_h3]:tracking-tight [&_h3]:mt-14 [&_h3]:mb-4 [&_h3]:text-white [&_h3]:font-[family-name:var(--font-fraunces)]
                  [&_h4]:text-xs md:[&_h4]:text-sm [&_h4]:font-black [&_h4]:uppercase [&_h4]:tracking-[0.3em] [&_h4]:mt-10 [&_h4]:mb-3 [&_h4]:text-[#C56E3D]
                  [&_strong]:text-white [&_strong]:font-bold
                  [&_em]:font-[family-name:var(--font-playfair)] [&_em]:italic [&_em]:text-white/95
                  [&_a]:text-[#C56E3D] [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-[#C56E3D]/40 [&_a:hover]:text-white [&_a:hover]:decoration-white/70 [&_a]:transition-colors
                  [&_ul]:list-none [&_ul]:pl-0 [&_ul]:mb-8 [&_ul]:space-y-3
                  [&_ul_li]:relative [&_ul_li]:pl-6 [&_ul_li]:text-white/75 [&_ul_li]:font-medium [&_ul_li]:leading-relaxed [&_ul_li]:before:content-[''] [&_ul_li]:before:absolute [&_ul_li]:before:left-0 [&_ul_li]:before:top-[0.7em] [&_ul_li]:before:w-2 [&_ul_li]:before:h-[2px] [&_ul_li]:before:bg-[#C56E3D]/70
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-8 [&_ol]:marker:text-[#C56E3D]/70 [&_ol]:marker:font-black
                  [&_ol_li]:text-white/75 [&_ol_li]:font-medium [&_ol_li]:leading-relaxed [&_ol_li]:mb-2 [&_ol_li]:pl-2
                  [&_blockquote]:my-12 [&_blockquote]:pl-8 [&_blockquote]:py-2 [&_blockquote]:border-l-2 [&_blockquote]:border-[#C56E3D] [&_blockquote]:italic [&_blockquote]:font-[family-name:var(--font-playfair)] [&_blockquote]:text-xl md:[&_blockquote]:text-2xl [&_blockquote]:text-white/85 [&_blockquote]:leading-snug
                  [&_img]:rounded-2xl [&_img]:my-12 [&_img]:w-full [&_img]:border [&_img]:border-white/5
                  [&_hr]:my-14 [&_hr]:border-0 [&_hr]:h-[1px] [&_hr]:bg-white/10
                  [&_table]:w-full [&_table]:my-12 [&_table]:border [&_table]:border-white/10 [&_table]:rounded-2xl [&_table]:overflow-hidden [&_table]:border-separate [&_table]:border-spacing-0
                  [&_th]:p-5 [&_th]:text-[10px] [&_th]:uppercase [&_th]:tracking-[0.3em] [&_th]:text-left [&_th]:bg-white/[0.04] [&_th]:font-black [&_th]:text-white
                  [&_td]:p-5 [&_td]:border-t [&_td]:border-white/5 [&_td]:text-white/75 [&_td]:font-medium
                  [&_code]:bg-white/[0.06] [&_code]:text-[#E89B73] [&_code]:px-2 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[0.92em] [&_code]:font-mono [&_code]:border [&_code]:border-white/5
                  [&_pre]:bg-white/[0.03] [&_pre]:border [&_pre]:border-white/10 [&_pre]:p-6 [&_pre]:rounded-2xl [&_pre]:my-10 [&_pre]:overflow-x-auto
                  [&_pre_code]:bg-transparent [&_pre_code]:border-0 [&_pre_code]:p-0 [&_pre_code]:text-white/85
                "
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </article>
          </div>
        </section>

        {/* Next case study */}
        {nextProject && (
          <section className="px-6 md:px-12 lg:px-24 pb-32 max-w-[1500px] mx-auto">
            <span className="text-[10px] uppercase tracking-[0.6em] text-[#C56E3D] font-black block mb-6">
              Up Next
            </span>
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group block relative overflow-hidden rounded-3xl border border-white/5 hover:border-[#C56E3D]/40 transition-all"
            >
              <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden bg-[#141414]">
                <Image
                  src={nextProject.image}
                  alt={nextProject.title}
                  fill
                  sizes="100vw"
                  className="object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-[1200ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14">
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/45 font-black mb-4">
                  Next Case Study
                </span>
                <h3 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-5 group-hover:text-[#C56E3D] transition-colors">
                  {nextProject.title}
                </h3>
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-white/55 font-black">
                  <span>{nextProject.category}</span>
                  <span className="h-[1px] w-8 bg-white/20" />
                  <span className="inline-flex items-center gap-2 group-hover:text-[#C56E3D] transition-colors">
                    Continue
                    <ArrowRight
                      size={12}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Footer CTA */}
        <footer className="px-6 md:px-12 lg:px-24 py-28 border-t border-white/5 max-w-[1500px] mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.6em] text-[#C56E3D] font-black mb-8">
            Like what you see?
          </p>
          <Link
            href="/contact"
            className="font-[family-name:var(--font-fraunces)] text-4xl md:text-7xl font-black tracking-tighter hover:text-[#C56E3D] transition-colors inline-flex items-center gap-4 group/cta"
          >
            Start a{" "}
            <span className="italic font-[family-name:var(--font-playfair)]">
              Conversation
            </span>
            <ArrowUpRight
              size={36}
              className="transition-transform group-hover/cta:rotate-45"
            />
          </Link>
        </footer>
      </main>
    </>
  );
}
