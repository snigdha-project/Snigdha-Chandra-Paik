"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
// Updated to import from local blogService
import { getLocalPosts } from "@/lib/blogService";

// Helper to clean HTML entities for titles
const decodeHTML = (html: string) => {
  if (typeof window === "undefined") return html;
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

function MagneticButton() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    mouseX.set((clientX - centerX) * 0.3);
    mouseY.set((clientY - centerY) * 0.3);
    spotlightX.set(clientX - left);
    spotlightY.set(clientY - top);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const background = useTransform(
    [spotlightX, spotlightY],
    ([x, y]) =>
      `radial-gradient(120px circle at ${x}px ${y}px, rgba(197, 110, 61, 0.25), transparent 80%)`,
  );

  return (
    <Link href="/blogs">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: springX, y: springY }}
        className="group relative flex items-center gap-4 px-8 py-4 rounded-full bg-white/5 border border-white/10 overflow-hidden transition-colors hover:border-[#C56E3D]/40"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background }}
        />
        <span className="relative z-10 text-[9px] font-black uppercase tracking-[0.4em] text-white/70 group-hover:text-white transition-colors">
          Explore All Stories
        </span>
        <div className="relative z-10 w-8 h-8 rounded-full bg-[#C56E3D] flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
          <ArrowUpRight size={16} className="text-[#141B1A]" />
        </div>
      </motion.div>
    </Link>
  );
}

function BentoCard({ post, index }: { post: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  // Layout logic preserved for the 3-item grid
  const gridClasses = [
    "md:col-span-2 md:row-span-2",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-[#1A2421] ${gridClasses[index] || ""}`}
    >
      <Link
        href={`/blogs/${post.slug}`}
        className="block h-full w-full relative"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover opacity-30 transition-all duration-1000 group-hover:scale-105 group-hover:opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141B1A] via-[#141B1A]/40 to-transparent" />
        </div>

        <div className="relative z-10 h-full w-full p-6 md:p-8 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#C56E3D] bg-white/5 px-2.5 py-1 rounded-full border border-white/5 backdrop-blur-sm">
              {post.category}
            </span>
            <motion.div
              animate={{ rotate: isHovered ? 45 : 0 }}
              className="text-white/40 group-hover:text-white"
            >
              <ArrowUpRight size={20} />
            </motion.div>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-fraunces)] text-2xl md:text-4xl font-bold text-white leading-tight tracking-tight">
              {decodeHTML(post.title)}
            </h3>
            <div className="mt-4 h-[1px] w-0 bg-[#C56E3D] transition-all duration-500 group-hover:w-full" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Blogs() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        // Updated to use the local service function
        const latest = await getLocalPosts(3, 0);
        setPosts(latest);
      } catch (err) {
        console.error("Home Blog Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  return (
    <section className="bg-[#141B1A] min-h-screen py-12 md:py-20 px-6 md:px-16 relative overflow-hidden flex flex-col">
      <div className="max-w-[1400px] w-full mx-auto mb-10 md:mb-14 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="max-w-2xl">
          <span className="text-[10px] uppercase tracking-[1em] text-[#C56E3D] font-black block mb-3">
            Editorial
          </span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-5xl md:text-8xl text-white font-black tracking-tighter leading-none">
            Digital{" "}
            <span className="italic font-[family-name:var(--font-playfair)] text-[#C56E3D]">
              Journal.
            </span>
          </h2>
        </div>
        <MagneticButton />
      </div>

      <div className="max-w-[1400px] w-full mx-auto flex-1 grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:gap-6 min-h-[600px]">
        {loading ? (
          <div className="col-span-full flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-[#C56E3D]" size={32} />
          </div>
        ) : (
          posts.map((post, i) => (
            <BentoCard key={post.slug} post={post} index={i} />
          ))
        )}
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C56E3D]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#2D4B44]/10 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
