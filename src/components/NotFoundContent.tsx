"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function NotFoundContent() {
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse parallax for the giant 404 — disabled feel on touch (no hover = no drift)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });
  const parallaxX = useTransform(sx, [-1, 1], [-32, 32]);
  const parallaxY = useTransform(sy, [-1, 1], [-22, 22]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      mx.set(nx * 2 - 1);
      my.set(ny * 2 - 1);
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-[#F7F3E9] px-6 pt-32 pb-24 md:px-16 md:pt-40 md:pb-32"
    >
      {/* Ambient floating orbs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-[#C56E3D]/15 blur-3xl"
        animate={{ y: [0, 40, 0], x: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -right-32 h-[34rem] w-[34rem] rounded-full bg-[#A64D32]/15 blur-3xl"
        animate={{ y: [0, -32, 0], x: [0, -18, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/3 right-1/4 h-40 w-40 rounded-full bg-[#141B1A]/5 blur-2xl"
        animate={{ y: [0, 24, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Faint horizontal rule echoing the editorial layout */}
      <div className="pointer-events-none absolute top-32 left-0 right-0 h-px bg-[#141B1A]/5 md:top-40" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-10 text-center md:gap-14">
        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[10px] font-black uppercase tracking-[0.5em] text-[#A64D32]"
        >
          Error · 404 · Lost in the garden
        </motion.span>

        {/* The 404 — entrance stagger + mouse parallax + infinite float on the “0” */}
        <motion.h1
          style={{ x: parallaxX, y: parallaxY }}
          className="select-none font-[family-name:var(--font-fraunces)] text-[22vw] font-black leading-[0.85] tracking-tighter text-[#141B1A] md:text-[18rem]"
          aria-label="404"
        >
          <motion.span
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 90, damping: 13 }}
            className="inline-block"
          >
            4
          </motion.span>
          <motion.span
            initial={{ opacity: 0, scale: 0.4, rotate: -45 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { delay: 0.25, duration: 0.6 },
              scale: { delay: 0.25, type: "spring", stiffness: 90, damping: 10 },
              rotate: { delay: 0.25, type: "spring", stiffness: 90, damping: 10 },
              y: {
                delay: 1.2,
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="mx-1 inline-block font-[family-name:var(--font-playfair)] italic text-[#C56E3D] md:mx-4"
          >
            0
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 90, damping: 13 }}
            className="inline-block"
          >
            4
          </motion.span>
        </motion.h1>

        {/* Tagline */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="max-w-3xl font-[family-name:var(--font-fraunces)] text-3xl font-bold tracking-tight text-[#141B1A] md:text-5xl"
        >
          This branch never{" "}
          <span className="font-[family-name:var(--font-playfair)] italic text-[#A64D32]">
            bloomed.
          </span>
        </motion.h2>

        {/* Paragraph */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.8 }}
          className="max-w-xl font-sans text-base font-medium leading-relaxed text-[#141B1A]/70 md:text-lg"
        >
          The page you reached isn&apos;t part of this garden. Maybe it
          wilted, maybe it was never planted — either way, let&apos;s get you
          back to fertile ground.
        </motion.p>

        {/* CTAs — same vocabulary as the home About section */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.6 }}
          className="flex flex-col items-center gap-6 pt-2 sm:flex-row sm:gap-12"
        >
          <Link
            href="/"
            className="group flex items-center gap-6 no-underline transition-all"
          >
            <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-[#141B1A]/20 bg-transparent">
              <div className="absolute inset-0 translate-y-full bg-[#A64D32] transition-transform duration-500 ease-in-out group-hover:translate-y-0" />
              <span className="relative z-10 text-2xl text-[#141B1A] transition-colors duration-500 group-hover:text-[#F7F3E9]">
                ←
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-black uppercase tracking-[0.4em] text-[#141B1A]">
                Back Home
              </span>
              <div className="mt-1 h-[2px] w-0 bg-[#A64D32] transition-all duration-500 group-hover:w-full" />
            </div>
          </Link>

          <Link
            href="/projects"
            className="group flex items-center gap-6 no-underline transition-all"
          >
            <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-[#141B1A]/20 bg-transparent">
              <div className="absolute inset-0 translate-y-full bg-[#141B1A] transition-transform duration-500 ease-in-out group-hover:translate-y-0" />
              <span className="relative z-10 text-2xl text-[#141B1A] transition-colors duration-500 group-hover:text-[#F7F3E9]">
                →
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-black uppercase tracking-[0.4em] text-[#141B1A]">
                See Projects
              </span>
              <div className="mt-1 h-[2px] w-0 bg-[#141B1A] transition-all duration-500 group-hover:w-full" />
            </div>
          </Link>
        </motion.div>

        {/* Signature flourish */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="pt-4 font-[family-name:var(--font-signature)] text-3xl text-[#A64D32]/60 md:text-4xl"
        >
          ~ keep wandering ~
        </motion.div>
      </div>
    </section>
  );
}
