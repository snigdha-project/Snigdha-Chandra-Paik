"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ToolIcon from "@/components/tools/ToolIcon";
import type { Tool } from "@/lib/toolService";

export default function ToolsContent({ tools }: { tools: Tool[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(tools.map((t) => t.category)))],
    [tools],
  );
  const [active, setActive] = useState("All");
  const shown = active === "All" ? tools : tools.filter((t) => t.category === active);

  return (
    <main className="min-h-screen bg-[#050505] overflow-x-hidden selection:bg-[#C56E3D] selection:text-white">
      <section className="pt-40 pb-14 px-8 md:px-16 lg:px-24 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[10px] uppercase tracking-[1em] text-[#C56E3D] font-black block mb-6">
            Free Tools
          </span>
          <h1 className="font-[family-name:var(--font-fraunces)] text-6xl md:text-8xl lg:text-[8rem] text-white font-black tracking-tighter leading-[0.85]">
            Tools that <br />
            <span className="italic font-[family-name:var(--font-playfair)] text-[#C56E3D]">
              do the work.
            </span>
          </h1>
          <p className="mt-10 text-white/40 text-lg md:text-2xl max-w-2xl leading-relaxed font-medium">
            Free calculators, image tools and more for marketing, SEO and web
            work. No sign-up, and your data stays in your browser.
          </p>
        </motion.div>
      </section>

      <section className="px-8 md:px-16 lg:px-24 pb-28 max-w-[1400px] mx-auto">
        {categories.length > 2 && (
          <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Tool categories">
            {categories.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={active === c}
                onClick={() => setActive(c)}
                className={`text-[10px] font-black uppercase tracking-[0.25em] px-4 py-2.5 rounded-full border transition-colors ${
                  active === c
                    ? "bg-[#C56E3D] border-[#C56E3D] text-white"
                    : "border-white/15 text-white/60 hover:border-white/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {shown.length === 0 ? (
          <p className="text-white/50 text-lg">New tools are on the way. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {shown.map((tool, idx) => (
              <motion.article
                key={tool.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: (idx % 3) * 0.08 }}
                className="group relative rounded-[2rem] bg-[#0F0F0F] border border-white/5 hover:border-[#C56E3D]/30 hover:-translate-y-1 transition-all duration-500"
              >
                <Link
                  href={`/tools/${tool.slug}`}
                  className="flex h-full flex-col gap-6 p-7 md:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid place-items-center size-12 rounded-2xl bg-[#C56E3D]/15 text-[#C56E3D]">
                      <ToolIcon name={tool.icon} />
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full border border-white/10 text-white/60">
                      {tool.category}
                    </span>
                  </div>
                  <h2 className="font-[family-name:var(--font-fraunces)] text-2xl md:text-3xl text-white font-black tracking-tighter leading-[1.05] group-hover:text-[#C56E3D] transition-colors">
                    {tool.title}
                  </h2>
                  <p className="text-white/55 leading-relaxed font-medium flex-1">
                    {tool.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] font-black text-[#C56E3D]">
                    Open tool
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
