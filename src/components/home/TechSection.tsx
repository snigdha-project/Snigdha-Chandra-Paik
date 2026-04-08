"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef, ReactNode } from "react";

const skills = [
  // ROW 1
  { name: "Next.js", cat: "Core", initialRotate: "-1deg", color: "dark" },
  { name: "SEO", cat: "Growth", initialRotate: "2deg", color: "dark" },
  { name: "Webflow", cat: "Design", initialRotate: "-2deg", color: "light" },
  { name: "Three.js", cat: "3D", initialRotate: "1deg", color: "light" },
  // ROW 2
  { name: "N8N", cat: "Flow", initialRotate: "3deg", color: "light" },
  { name: "Python", cat: "Logic", initialRotate: "-1deg", color: "light" },
  { name: "Figma", cat: "Creative", initialRotate: "4deg", color: "dark" },
  { name: "Spline", cat: "Spatial", initialRotate: "-3deg", color: "dark" },
  // ROW 3
  {
    name: "React Native",
    cat: "Mobile",
    initialRotate: "2deg",
    color: "light",
  },
  { name: "WordPress", cat: "CMS", initialRotate: "-2deg", color: "light" },
  { name: "Shopify", cat: "Store", initialRotate: "1deg", color: "dark" }, // Swapped here
  { name: "Javascript", cat: "Logic", initialRotate: "-4deg", color: "dark" },
];

const allSkills = [
  "Webflow",
  "WordPress",
  "WooCommerce",
  "Shopify",
  "Elementor",
  "Git",
  "Next.js",
  "Three.js",
  "Figma",
  "SEO",
  "N8N",
  "Spline",
  "React Native",
  "Prompt Engineering",
  "Python",
  "Javascript",
];

function WeavingLeaf({
  children,
  initialRotate,
  index,
}: {
  children: ReactNode;
  initialRotate: string;
  index: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  const springConfig = { damping: 20, stiffness: 150 };
  const smoothX = useSpring(rotateX, springConfig);
  const smoothY = useSpring(rotateY, springConfig);

  return (
    <motion.div
      initial={{ opacity: 0, y: -100, rotate: 0 }}
      whileInView={{
        opacity: 1,
        y: 0,
        rotate: initialRotate,
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 100,
          delay: index * 0.1,
        },
      }}
      viewport={{ once: true }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{
        rotateX: smoothX,
        rotateY: smoothY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.05, rotate: "0deg", zIndex: 50 }}
      className="group"
    >
      {children}
    </motion.div>
  );
}

export default function TechSection() {
  return (
    <section className="bg-[#F7F3E9] py-24 px-6 md:px-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[1em] text-[#A64D32] font-black block mb-4">
              Instruments
            </span>
            <h2 className="font-[family-name:var(--font-fraunces)] text-7xl md:text-[9.5rem] text-[#141B1A] leading-[0.8] font-black tracking-tighter">
              The{" "}
              <span className="font-[family-name:var(--font-playfair)] italic text-[#C56E3D]">
                Stack.
              </span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {skills.map((skill, i) => (
            <WeavingLeaf key={i} index={i} initialRotate={skill.initialRotate}>
              <div
                className={`w-full h-40 md:h-48 p-8 rounded-[2rem] flex flex-col justify-between transition-all duration-500 shadow-sm border border-[#141B1A]/5 ${
                  skill.color === "dark"
                    ? "bg-[#141B1A] text-white hover:bg-[#A64D32]"
                    : "bg-white text-[#141B1A] hover:bg-[#141B1A] hover:text-white"
                }`}
              >
                <span className="text-[8px] uppercase tracking-widest font-black opacity-40">
                  {skill.cat}
                </span>
                <h3 className="text-2xl md:text-4xl font-black tracking-tighter leading-none">
                  {skill.name}
                </h3>
              </div>
            </WeavingLeaf>
          ))}
        </div>

        <div className="mt-32 border-y border-[#141B1A]/10 py-8 relative overflow-hidden">
          <motion.div
            animate={{ x: [0, -2500] }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            className="flex gap-16 whitespace-nowrap"
          >
            {[...allSkills, ...allSkills, ...allSkills].map((skill, index) => (
              <span
                key={index}
                className="text-[11px] font-black uppercase tracking-[0.6em] text-[#141B1A] opacity-60 hover:opacity-100 hover:text-[#A64D32] transition-all"
              >
                {skill}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
