"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShopify,
  faWordpress,
  faReact,
  faJsSquare,
} from "@fortawesome/free-brands-svg-icons";
import {
  faCode,
  faLayerGroup,
  faBolt,
  faMagnifyingGlass,
  faFingerprint,
} from "@fortawesome/free-solid-svg-icons";

const skillCategories = [
  {
    title: "Next.js & App Dev",
    icon: faCode,
    skills: ["Next.js", "React Native", "TypeScript", "Tailwind CSS"],
    desc: "Building high-performance web and mobile applications with a focus on speed.",
  },
  {
    title: "Webflow & Motion",
    icon: faLayerGroup,
    skills: ["Client-First", "Spline 3D", "Lenis JS", "Framer Motion"],
    desc: "Creating immersive 3D experiences and fluid, smooth-scroll digital narratives.",
  },
  {
    title: "E-Commerce Expert",
    icon: faShopify,
    skills: ["Shopify", "WooCommerce", "WordPress", "Elementor"],
    desc: "Developing conversion-focused stores with custom logic and editorial design.",
  },
  {
    title: "SEO & Automation",
    icon: faBolt,
    skills: ["N8N", "Technical SEO", "Schema Markup", "API Workflows"],
    desc: "Automating complex business processes while ensuring maximum search visibility.",
  },
];

export default function Skills() {
  return (
    <section className="py-32 px-6 md:px-16 bg-[#FFFDF6] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header Block */}
        <div className="mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[1em] text-[#C56E3D] font-black block mb-8"
          >
            Capabilities
          </motion.span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-5xl md:text-7xl text-[#141B1A] font-black tracking-tighter leading-none">
            Digital <br />
            <span className="italic font-[family-name:var(--font-playfair)] text-[#C56E3D]">
              Architecture.
            </span>
          </h2>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#141B1A]/5 border border-[#141B1A]/5">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#FFFDF6] p-10 group relative overflow-hidden transition-all duration-500 hover:bg-[#141B1A]"
            >
              {/* Hover Fluid Glow */}
              <div className="absolute inset-0 bg-[#C56E3D]/0 group-hover:bg-[#C56E3D]/5 transition-colors duration-500 pointer-events-none" />

              <div className="relative z-10 h-full flex flex-col">
                <div className="text-[#C56E3D] mb-8 transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-110 text-2xl">
                  <FontAwesomeIcon icon={category.icon} />
                </div>

                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#141B1A] mb-4 group-hover:text-white transition-colors">
                  {category.title}
                </h3>

                <p className="text-[13px] text-[#141B1A]/50 leading-relaxed mb-8 group-hover:text-white/40 transition-colors font-medium">
                  {category.desc}
                </p>

                <div className="flex flex-row flex-wrap gap-2 mt-auto">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-[#141B1A]/10 text-[#141B1A]/40 group-hover:border-white/10 group-hover:text-white/60 transition-all whitespace-nowrap"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Decorative Corner Accent */}
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <FontAwesomeIcon
                  icon={faFingerprint}
                  className="text-[#C56E3D]/40 text-xs"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Watermark */}
      <div className="absolute top-1/2 -right-20 pointer-events-none select-none hidden lg:block opacity-[0.02]">
        <span className="text-[20rem] font-black text-[#141B1A] tracking-tighter leading-none whitespace-nowrap rotate-90">
          CAPABILITIES
        </span>
      </div>
    </section>
  );
}
