"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const CYCLE_WORDS = ["FRONTEND", "ANIMATION", "SEO", "CREATIVE"];

const COLD_LOAD_MS = 2200;
const ROUTE_CHANGE_MS = 900;

export default function UniversalLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const isFirstMount = useRef(true);

  useEffect(() => {
    const duration = isFirstMount.current ? COLD_LOAD_MS : ROUTE_CHANGE_MS;
    setIsLoading(true);
    setProgress(0);

    const start = performance.now();
    let raf = 0;

    const tick = () => {
      const elapsed = performance.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setIsLoading(false);
          isFirstMount.current = false;
        }, 200);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (isLoading) {
      root.style.overflow = "hidden";
    } else {
      root.style.overflow = "";
    }
    return () => {
      root.style.overflow = "";
    };
  }, [isLoading]);

  const progressInt = Math.floor(progress);
  const wordIndex = Math.min(
    CYCLE_WORDS.length - 1,
    Math.floor((progress / 100) * CYCLE_WORDS.length),
  );

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="universal-loader"
          aria-hidden="true"
          className="fixed inset-0 z-[9999] pointer-events-auto"
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0 }}
        >
          {/* Split curtains — exit upward / downward */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
            className="absolute inset-x-0 top-0 h-1/2 bg-[#141B1A]"
          />
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[#141B1A]"
          />

          {/* Subtle paper-grain texture */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06] mix-blend-screen pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"
          />

          {/* Content layer — fades out before curtains split */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full flex flex-col items-center justify-center text-[#F7F3E9] z-10 px-8"
          >
            {/* Top edge: presenting + counter */}
            <div className="absolute top-6 md:top-8 left-6 right-6 md:left-10 md:right-10 flex justify-between items-baseline text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] text-[#F7F3E9]/50">
              <motion.span
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Presenting
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="tabular-nums font-mono tracking-[0.25em]"
              >
                {progressInt.toString().padStart(3, "0")} / 100
              </motion.span>
            </div>

            {/* Center title */}
            <div className="text-center select-none overflow-hidden">
              <motion.div
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.1,
                }}
                className="font-[family-name:var(--font-fraunces)] text-[14vw] md:text-[9rem] lg:text-[10rem] font-black tracking-tighter leading-[0.85] uppercase"
              >
                Snigdha
              </motion.div>
              <motion.div
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.25,
                }}
                className="font-[family-name:var(--font-playfair)] italic text-[#C56E3D] text-[10vw] md:text-[6.5rem] lg:text-[7.5rem] leading-[0.85] -mt-2 md:-mt-4"
              >
                Chandra Paik.
              </motion.div>
            </div>

            {/* Cycling skill word */}
            <div className="mt-10 md:mt-14 h-5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="block text-[10px] md:text-[11px] font-black uppercase tracking-[0.6em] text-[#C56E3D]"
                >
                  {CYCLE_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "left" }}
              className="mt-8 md:mt-10 w-[180px] md:w-[300px] h-[2px] bg-[#F7F3E9]/10 relative overflow-hidden"
            >
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.08, ease: "linear" }}
                className="absolute top-0 left-0 h-full bg-[#C56E3D]"
              />
            </motion.div>

            {/* Bottom edge: status + version */}
            <div className="absolute bottom-6 md:bottom-8 left-6 right-6 md:left-10 md:right-10 flex justify-between items-baseline text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-[#F7F3E9]/35">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Compiling experience
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="font-mono tracking-[0.25em]"
              >
                v · 2026
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
