"use client";

import {
  motion,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Import your data
import projectData from "@/data/projects.json";

export default function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // UPDATED LOGIC: Filter projects where featured is true
  const displayProjects = projectData.filter((project) => project.featured);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="bg-[#F7F3E9] py-24 md:py-32 px-6 md:px-16 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-20 md:mb-32">
          <span className="text-[10px] uppercase tracking-[1em] text-[#A64D32] font-black block mb-6">
            Archives
          </span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-6xl md:text-[11rem] text-[#141B1A] leading-[0.75] font-black tracking-tighter">
            Selected{" "}
            <span className="font-[family-name:var(--font-playfair)] italic text-[#C56E3D]">
              Works.
            </span>
          </h2>
        </div>

        {/* Project List */}
        <div className="flex flex-col gap-12 md:gap-0">
          {displayProjects.map((project, i) => {
            return (
              <div
                key={project.id}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group py-0 md:py-20 border-b-0 md:border-b border-[#141B1A]/10 flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8 items-start md:items-center relative"
              >
                {/* MOBILE ONLY: Professional Image Card */}
                <div className="block md:hidden w-full aspect-[16/10] relative overflow-hidden rounded-[2rem] shadow-sm mb-2">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Project Info */}
                <div className="relative z-10 md:col-span-9 space-y-4 md:space-y-6">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#A64D32] font-black block md:opacity-0 group-hover:opacity-100 transition-all md:-translate-x-4 group-hover:translate-x-0">
                    {project.category}
                  </span>
                  <h3 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-8xl text-[#141B1A] font-black tracking-tighter group-hover:italic transition-all duration-500">
                    {project.title}
                  </h3>

                  <div className="space-y-4">
                    <p className="text-sm md:text-base text-[#141B1A]/70 font-medium max-w-xl md:opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                      {project.tech.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[8px] md:text-[9px] font-black uppercase px-3 py-1 bg-[#141B1A] text-white rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* INTERACTIVE BUTTON ZONE */}
                <div
                  className="md:col-span-3 flex justify-start md:justify-end items-center relative z-30 h-full w-full py-4 md:py-0"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    if (e.clientX < rect.left + 50) {
                      setHoveredIndex(i);
                    } else {
                      setHoveredIndex(null);
                    }
                  }}
                >
                  <Link
                    href={project.link}
                    target="_blank"
                    className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-[#141B1A]/20 flex items-center justify-center transition-all duration-500 text-2xl md:text-3xl bg-transparent text-[#141B1A] hover:bg-[#A64D32] hover:border-[#A64D32] hover:text-[#F7F3E9] hover:scale-110 shadow-sm cursor-pointer"
                  >
                    <span className="relative bottom-[1px] md:bottom-[2px]">
                      →
                    </span>
                  </Link>
                </div>

                {/* MOBILE ONLY: Divider */}
                <div className="block md:hidden w-full h-[1px] bg-[#141B1A]/10 mt-4" />
              </div>
            );
          })}
        </div>

        {/* SEE ALL PROJECTS BUTTON */}
        <div className="mt-20 md:mt-32 flex justify-center">
          <Link href="/projects" className="cursor-pointer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 md:px-12 py-5 md:py-6 rounded-full bg-[#141B1A] text-[#F7F3E9] text-[10px] uppercase tracking-[0.6em] font-black overflow-hidden transition-all duration-500 cursor-pointer shadow-2xl"
            >
              <span className="relative z-10">See all projects</span>
              <div className="absolute inset-0 bg-[#A64D32] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </motion.button>
          </Link>
        </div>
      </div>

      {/* MAGNETIC IMAGE REVEAL (Desktop Only) */}
      <AnimatePresence mode="wait">
        {hoveredIndex !== null && (
          <motion.div
            style={{ left: smoothX, top: smoothY, x: "-50%", y: "-50%" }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="hidden md:block fixed pointer-events-none z-[20] w-[450px] h-[300px] overflow-hidden rounded-[2.5rem] shadow-2xl bg-white border-4 border-white"
          >
            <Image
              src={displayProjects[hoveredIndex].image}
              alt={displayProjects[hoveredIndex].title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
