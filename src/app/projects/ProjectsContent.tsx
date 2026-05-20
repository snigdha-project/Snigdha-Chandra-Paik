"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowUpRight, BookOpen, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/projectService";

function CaseStudyCard({ project }: { project: Project }) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const { left, top, width, height } =
      cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100,
    });
  };

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-[#0F0F0F] border border-white/5 transition-all duration-500 hover:border-[#C56E3D]/30 hover:-translate-y-1"
    >
      {/* Mouse-following radial glow */}
      <div
        className="absolute inset-0 z-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none"
        style={{
          background: `radial-gradient(700px circle at ${mousePos.x}% ${mousePos.y}%, rgba(197,110,61,0.14), transparent 55%)`,
        }}
      />

      {/* Larger 16:9 image to make case-study cards feel showcase-y */}
      <Link
        href={`/projects/${project.slug}`}
        className="relative aspect-[16/9] w-full overflow-hidden bg-[#141414] block"
      >
        <Image
          src={project.image}
          alt={`${project.title} — ${project.category} case study by Snigdha Chandra Paik`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 700px"
          className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent" />

        <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full bg-[#C56E3D]/20 backdrop-blur-md text-[#C56E3D] border border-[#C56E3D]/30">
          <BookOpen size={10} />
          Case Study
        </span>
        <span className="absolute top-5 right-5 text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/80 border border-white/10">
          {project.category}
        </span>
      </Link>

      <div className="relative z-10 flex flex-col flex-1 p-7 md:p-10 gap-6">
        <Link href={`/projects/${project.slug}`} className="block">
          <h3 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-5xl text-white font-black tracking-tighter leading-[1] group-hover:text-[#C56E3D] transition-colors">
            {project.title}
          </h3>
        </Link>

        <p className="text-white/60 text-base md:text-lg leading-relaxed font-medium">
          {project.description}
        </p>

        {project.tech && project.tech.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <li
                key={t}
                className="text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.03] text-white/65"
              >
                {t}
              </li>
            ))}
          </ul>
        )}

        <div className="flex-1" />

        {/* Two CTAs side-by-side */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href={`/projects/${project.slug}`}
            className="group/btn flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-[#C56E3D] hover:bg-[#A64D32] text-white text-[10px] uppercase tracking-[0.4em] font-black transition-colors"
          >
            <BookOpen size={13} />
            Read Case Study
          </Link>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full border border-white/15 hover:border-white/40 hover:bg-white/[0.04] text-white/85 text-[10px] uppercase tracking-[0.4em] font-black transition-colors"
            >
              Visit Live Site
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const { left, top, width, height } =
      cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100,
    });
  };

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-[#0F0F0F] border border-white/5 transition-all duration-500 hover:border-white/15 hover:-translate-y-1"
    >
      <div
        className="absolute inset-0 z-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none"
        style={{
          background: `radial-gradient(500px circle at ${mousePos.x}% ${mousePos.y}%, rgba(197,110,61,0.12), transparent 50%)`,
        }}
      />

      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#141414]">
        <Image
          src={project.image}
          alt={`${project.title} — ${project.category} built by Snigdha Chandra Paik`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent" />

        <span className="absolute top-4 left-4 text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/80 border border-white/10">
          {project.category}
        </span>
      </div>

      <div className="relative z-10 flex flex-col flex-1 p-7 md:p-8 gap-5">
        <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-[2rem] text-white font-black tracking-tight leading-[1.05] group-hover:text-[#C56E3D] transition-colors">
          {project.title}
        </h2>

        <p className="text-white/55 text-sm leading-relaxed font-medium">
          {project.description}
        </p>

        {project.tech && project.tech.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 mt-1">
            {project.tech.map((t: string) => (
              <li
                key={t}
                className="text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.03] text-white/65 transition-colors group-hover:border-[#C56E3D]/30 group-hover:text-white/85"
              >
                {t}
              </li>
            ))}
          </ul>
        )}

        <div className="flex-1" />

        <Link
          href={project.link ?? "#"}
          target="_blank"
          rel="noopener"
          className="group/link flex items-center justify-between gap-4 pt-5 mt-1 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/70 hover:text-white transition-colors"
        >
          <span>View Live Project</span>
          <span className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center transition-all group-hover/link:bg-[#C56E3D] group-hover/link:border-[#C56E3D]">
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover/link:rotate-45"
            />
          </span>
        </Link>
      </div>
    </motion.article>
  );
}

export default function ProjectsPage({
  caseStudyProjects,
  otherProjects,
}: {
  caseStudyProjects: Project[];
  otherProjects: Project[];
}) {
  return (
    <main className="min-h-screen bg-[#050505] overflow-x-hidden selection:bg-[#C56E3D] selection:text-white">
      {/* PAGE HEADER */}
      <section className="pt-40 pb-20 px-8 md:px-16 lg:px-24 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[10px] uppercase tracking-[1em] text-[#C56E3D] font-black block mb-6">
            My Portfolio
          </span>
          <h1 className="font-[family-name:var(--font-fraunces)] text-6xl md:text-8xl lg:text-[9rem] text-white font-black tracking-tighter leading-[0.85]">
            Engineered <br />
            <span className="italic font-[family-name:var(--font-playfair)] text-[#C56E3D]">
              Experiences.
            </span>
          </h1>
          <p className="mt-10 text-white/40 text-lg md:text-2xl max-w-2xl leading-relaxed font-medium">
            Bridging the gap between complex code and intuitive design through
            custom web development and SEO.
          </p>
        </motion.div>
      </section>

      {/* SELECTED PROJECTS GRID */}
      {otherProjects.length > 0 && (
        <section className="px-8 md:px-16 lg:px-24 pb-24 md:pb-32 max-w-[1400px] mx-auto">
          <div className="mb-12 md:mb-16">
            <span className="text-[10px] uppercase tracking-[0.6em] text-[#C56E3D] font-black block mb-4">
              The Work
            </span>
            <h2 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-6xl text-white font-black tracking-tighter leading-[0.9]">
              Selected{" "}
              <span className="italic font-[family-name:var(--font-playfair)] text-[#C56E3D]">
                Projects.
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {otherProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* CASE STUDIES SECTION (renders only when at least one exists) */}
      {caseStudyProjects.length > 0 && (
        <section className="px-8 md:px-16 lg:px-24 pb-40 max-w-[1400px] mx-auto">
          <div
            className={`mb-12 md:mb-16 flex items-end justify-between flex-wrap gap-6 ${
              otherProjects.length > 0 ? "pt-12 md:pt-16 border-t border-white/5" : ""
            }`}
          >
            <div>
              <span className="text-[10px] uppercase tracking-[0.6em] text-[#C56E3D] font-black block mb-4">
                Deep Dives
              </span>
              <h2 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-6xl text-white font-black tracking-tighter leading-[0.9]">
                Case{" "}
                <span className="italic font-[family-name:var(--font-playfair)] text-[#C56E3D]">
                  Studies.
                </span>
              </h2>
            </div>
            <p className="text-white/45 text-sm md:text-base max-w-md leading-relaxed font-medium">
              Long-form breakdowns of selected projects — the brief, the
              constraints, and how the build came together.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
            {caseStudyProjects.map((project) => (
              <CaseStudyCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="py-40 px-8 text-center border-t border-white/5 bg-[#050505]">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-[10px] uppercase tracking-[1em] text-[#C56E3D] font-black mb-10">
            Have a project in mind?
          </p>
          <Link
            href="/contact"
            className="font-[family-name:var(--font-fraunces)] text-5xl md:text-8xl text-white font-black tracking-tighter hover:text-[#C56E3D] transition-all"
          >
            Start a{" "}
            <span className="italic font-[family-name:var(--font-playfair)]">
              Conversation.
            </span>
          </Link>
        </div>
      </footer>
    </main>
  );
}
