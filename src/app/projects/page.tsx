"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";

// Data Imports
import projectsData from "@/data/projects.json";

function ProjectCard({ project, index }: { project: any; index: number }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const { left, top, width, height } =
      cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-[#0F0F0F] p-8 md:p-10 aspect-[4/5] border border-white/5 transition-all duration-500 hover:border-white/20 hover:scale-[1.01]"
    >
      {/* 1. DYNAMIC COLOR GLOW - Based on project's custom color */}
      <div
        className="absolute inset-0 z-0 opacity-0 transition-opacity duration-700 group-hover:opacity-40"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, ${project.color || "#C56E3D"}30, transparent 40%)`,
        }}
      />

      {/* 2. BACKGROUND IMAGE - Made much clearer and visible on hover */}
      <div className="absolute inset-0 z-0 opacity-[0.15] group-hover:opacity-60 transition-all duration-1000">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
        />
        {/* Subtle dark tint to keep text readable */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* 3. CARD CONTENT */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-center">
          <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-3xl group-hover:bg-[#C56E3D]/10 group-hover:border-[#C56E3D]/40 transition-all">
            <Sparkles size={20} className="text-[#C56E3D]" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/50">
            {project.category}
          </span>
        </div>

        <div className="mt-auto">
          <h2 className="font-[family-name:var(--font-fraunces)] text-4xl text-white font-black tracking-tighter leading-tight mb-4 group-hover:text-[#C56E3D] transition-colors">
            {project.title}
          </h2>
          <p className="text-white/60 text-[15px] leading-relaxed max-w-[280px] font-medium">
            {project.description || project.desc}
          </p>
        </div>

        <div className="mt-8">
          <Link
            href={project.link || "#"}
            target="_blank"
            className="group/link inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/80 hover:text-white transition-all"
          >
            View Live Project
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover/link:bg-[#C56E3D] group-hover/link:border-[#C56E3D] transition-all">
              <ArrowUpRight
                size={16}
                className="group-hover/link:rotate-45 transition-transform"
              />
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[#050505] overflow-x-hidden selection:bg-[#C56E3D] selection:text-white">
      {/* IMPROVED HEADER - Clearer for clients */}
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

      {/* PROJECT GRID */}
      <section className="px-8 md:px-16 lg:px-24 pb-40 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {projectsData.map((project: any, index: number) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </section>

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
