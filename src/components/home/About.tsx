"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";

const AboutModel = dynamic(() => import("./AboutModel"), { ssr: false });

export default function AboutSection() {
  const dnaPoints = [
    { label: "Origin", value: "West Bengal, India" },
    { label: "Philosophy", value: "Nature over Humans" },
    { label: "Specialty", value: "Frontend Developer" },
    { label: "Core", value: "SEO & Web Performance" }, // Added this as a grounded second point
  ];

  return (
    <section className="bg-[#F7F3E9] py-24 md:py-48 px-6 md:px-16 border-t border-[#141B1A]/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* LEFT SIDE: Narrative */}
        <div className="lg:col-span-7 flex flex-col items-start gap-12">
          <div className="space-y-8">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] uppercase tracking-[0.5em] text-[#A64D32] font-black"
            >
              Identity
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="font-[family-name:var(--font-fraunces)] text-5xl md:text-7xl lg:text-[8rem] text-[#141B1A] leading-[0.9] tracking-tighter font-black"
            >
              Digital gardens <br />
              that{" "}
              <span className="font-[family-name:var(--font-playfair)] italic text-[#C56E3D]">
                breathe.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-[#141B1A]/70 max-w-xl leading-relaxed font-sans font-medium"
            >
              Much like an aquarium, a website requires a balanced ecosystem to
              thrive. I architect environments that grow organically through
              technical precision and SEO logic.
            </motion.p>
          </div>

          <Link
            href="/about"
            className="group flex items-center gap-8 no-underline transition-all"
          >
            <div className="w-14 h-14 rounded-full border border-[#141B1A]/20 flex items-center justify-center relative overflow-hidden bg-transparent">
              <div className="absolute inset-0 bg-[#A64D32] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              <span className="relative z-10 text-2xl text-[#141B1A] group-hover:text-[#F7F3E9] transition-colors duration-500">
                →
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-[0.4em] text-[#141B1A]">
                Know More
              </span>
              <div className="h-[2px] w-0 bg-[#A64D32] group-hover:w-full transition-all duration-500 mt-1" />
            </div>
          </Link>
        </div>

        {/* RIGHT SIDE: Vertical Stack */}
        <div className="lg:col-span-5 flex flex-col gap-10 items-center">
          <div className="w-full relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1, type: "spring" }}
              className="absolute top-0 bg-[#141B1A] text-[#F7F3E9] px-4 py-2 rounded-2xl shadow-xl z-20"
            >
              <p className="text-[10px] font-black tracking-widest uppercase">
                Don't squeeze me! 😡
              </p>
            </motion.div>

            <AboutModel />
          </div>

          <div className="w-full grid grid-cols-2 gap-y-10 gap-x-6 border-t border-[#141B1A]/10 pt-10">
            {dnaPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-1"
              >
                <span className="text-[9px] uppercase tracking-[0.4em] text-[#A64D32] font-black">
                  {point.label}
                </span>
                <span className="text-sm md:text-base font-bold text-[#141B1A]">
                  {point.value}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
