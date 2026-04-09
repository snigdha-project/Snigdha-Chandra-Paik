"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { Film, Music, PenTool, Flower2, Pin, Heart } from "lucide-react";

const favoriteItems = [
  {
    id: 1,
    category: "Cinema",
    title: "Atrangi Re",
    image: "/images/Movie.jpg",
    icon: <Film size={14} />,
    rotation: -5,
    pinPos: { top: "-12px", left: "42%" },
    desc: "A narrative of complex love and raw emotion.",
  },
  {
    id: 2,
    category: "Melody",
    title: "Dil To Bachcha Hai Ji",
    image: "/images/Song.jpg",
    icon: <Music size={14} />,
    rotation: 4,
    pinPos: { top: "-10px", left: "58%" },
    desc: "The timeless rhythm of a heart that never grows old.",
  },
  {
    id: 3,
    category: "Literature",
    title: "Rabindranath Tagore",
    image: "/images/Writer.webp",
    icon: <PenTool size={14} />,
    rotation: -3,
    pinPos: { top: "-8px", left: "38%" },
    desc: "The poetic foundation of my creative perspective.",
  },
  {
    id: 4,
    category: "Nature",
    title: "Cosmos",
    image: "/images/Flower.jpg",
    icon: <Flower2 size={14} />,
    rotation: 6,
    pinPos: { top: "-15px", left: "65%" },
    desc: "Beauty found in the simple, orderly chaos of a bloom.",
  },
];

export default function Favorites() {
  const containerRef = useRef<HTMLElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Subtle parallax for the wall texture depth
  const wallMove = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen py-32 bg-[#E6E3D8] overflow-hidden px-8 md:px-20 lg:px-32 flex flex-col justify-center"
    >
      {/* 1. BROKEN WALL TEXTURE LAYERS */}
      <motion.div
        style={{ y: wallMove }}
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asphalt-dark.png')] mix-blend-overlay" />
      </motion.div>

      {/* 2. PROCEDURAL SVG CRACKS */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none overflow-visible">
        <filter id="fractal-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="5"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" />
        </filter>

        <motion.path
          d="M-50,200 L300,450 L600,400 L900,750 L1400,600"
          stroke="#141B1A"
          strokeWidth="3"
          fill="none"
          filter="url(#fractal-noise)"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />

        <motion.path
          d="M1200,-50 L1000,300 L800,400 L400,900"
          stroke="#141B1A"
          strokeWidth="1.5"
          fill="none"
          filter="url(#fractal-noise)"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 4, delay: 0.5 }}
        />
      </svg>

      {/* 3. CONTENT CONTAINER */}
      <div className="max-w-[1400px] mx-auto w-full relative z-20">
        {/* Poetic Heading */}
        <div className="mb-24">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-[10px] uppercase tracking-[1em] text-[#C56E3D] font-black block mb-4"
          >
            The Anthology
          </motion.span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-5xl md:text-7xl text-[#141B1A] font-black tracking-tighter leading-tight">
            The Soul&apos;s <br />
            <span className="italic font-[family-name:var(--font-playfair)] text-[#C56E3D]">
              Anthology.
            </span>
          </h2>
          <p className="mt-6 text-[#141B1A]/40 text-[11px] uppercase tracking-[0.3em] font-bold">
            A collection of things that speak when I am silent.
          </p>
        </div>

        {/* The Pinned Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {favoriteItems.map((item) => (
            <motion.div
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              initial={{ opacity: 0, rotate: item.rotation * 2, y: 30 }}
              whileInView={{ opacity: 1, rotate: item.rotation, y: 0 }}
              whileHover={{ rotate: 0, scale: 1.08, y: -15, zIndex: 50 }}
              viewport={{ once: true }}
              className="relative p-4 bg-[#F9F9F7] shadow-2xl transition-all duration-500 group cursor-none"
              style={{
                boxShadow:
                  hoveredId === item.id
                    ? "0 40px 70px -15px rgba(0,0,0,0.3)"
                    : "0 15px 30px -10px rgba(0,0,0,0.15)",
              }}
            >
              {/* THE PIN */}
              <div
                className="absolute z-30 transition-all duration-500 group-hover:scale-150 group-hover:-rotate-12"
                style={{ top: item.pinPos.top, left: item.pinPos.left }}
              >
                <Pin
                  className="text-[#C56E3D] fill-[#C56E3D] drop-shadow-lg"
                  size={28}
                />
              </div>

              {/* Card Image */}
              <div className="relative aspect-[1/1.25] w-full overflow-hidden bg-[#141B1A] rounded-sm">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover opacity-85 transition-all duration-1000 group-hover:opacity-100 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141B1A]/90 via-transparent to-transparent opacity-60" />

                <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#C56E3D]">{item.icon}</span>
                    <span className="text-[8px] uppercase tracking-widest text-white/50 font-black">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-xl text-white font-[family-name:var(--font-fraunces)] font-black leading-none">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Polaroid Footer */}
              <div className="mt-5 px-1 border-t border-[#141B1A]/5 pt-4">
                <p className="text-[11px] text-[#141B1A]/60 leading-tight font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {item.desc}
                </p>
                <div className="mt-3 flex justify-between items-center opacity-30">
                  <span className="text-[7px] font-black uppercase tracking-tighter text-[#141B1A]">
                    Personal Collection // 2026
                  </span>
                  <Heart size={8} className="text-[#FFB6C1] fill-[#FFB6C1]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* VIGNETTE EFFECT */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.1)]" />
    </section>
  );
}
