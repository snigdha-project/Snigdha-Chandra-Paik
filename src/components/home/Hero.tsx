"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if user is on mobile to disable interactions
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Resting position for desktop
    if (window.innerWidth >= 1024) {
      mouseX.set(-350);
      mouseY.set(350);
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 60 };
  const smoothedX = useSpring(mouseX, springConfig);
  const smoothedY = useSpring(mouseY, springConfig);

  // Desktop-only Transforms
  const lightX = useTransform(smoothedX, [-800, 800], ["-20%", "120%"]);
  const lightY = useTransform(smoothedY, [-500, 500], ["-20%", "120%"]);
  const rotateX = useTransform(smoothedY, [-500, 500], [12, -12]);
  const rotateY = useTransform(smoothedX, [-500, 500], [-12, 12]);
  const shadowX = useTransform(smoothedX, [-500, 500], [50, -50]);
  const shadowY = useTransform(smoothedY, [-500, 500], [50, -50]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isMobile && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      mouseX.set(event.clientX - rect.left - centerX);
      mouseY.set(event.clientY - rect.top - centerY);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      mouseX.set(-350);
      mouseY.set(350);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#F7F3E9]" />;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen lg:min-h-[90vh] flex flex-col justify-center px-6 md:px-16 py-20 lg:py-0 overflow-hidden bg-[#F7F3E9]"
    >
      {/* THE GAS GLOW - Hidden on Mobile */}
      {!isMobile && (
        <motion.div
          style={{
            left: lightX,
            top: lightY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          className="absolute w-[1000px] h-[1000px] pointer-events-none z-0 hidden lg:block"
        >
          <div className="absolute inset-0 bg-[#C56E3D] opacity-[0.15] blur-[140px] rounded-full" />
          <div className="absolute inset-[25%] bg-[#A64D32] opacity-[0.25] blur-[90px] rounded-full" />
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* TEXT CONTENT */}
        <div className="lg:col-span-7 flex flex-col items-start order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6 lg:mb-10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A64D32] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A64D32]"></span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#141B1A]/60 font-sans">
              AVAILABLE FOR PROJECTS
            </span>
          </motion.div>

          <h1 className="flex flex-col gap-1 lg:gap-3">
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-[family-name:var(--font-fraunces)] text-5xl md:text-7xl lg:text-[9.5rem] font-black leading-none tracking-tighter text-[#141B1A]"
            >
              CREATIVE
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-[8.5rem] italic text-[#C56E3D] ml-0 lg:ml-32 leading-none"
            >
              Ecosystems
            </motion.span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-[#141B1A]/80 max-w-xl leading-relaxed mt-10 lg:mt-16 font-sans font-medium">
            Snigdha Chandra Paik: A specialized Developer & SEO Expert crafting
            digital systems that grow organically.
          </p>
        </div>

        {/* INTERACTIVE CARD - Interactions disabled on Mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="lg:col-span-5 flex items-center justify-center relative order-1 lg:order-2"
          style={{ perspective: isMobile ? "none" : 2000 }}
        >
          <motion.div
            style={{
              rotateX: isMobile ? 0 : rotateX,
              rotateY: isMobile ? 0 : rotateY,
            }}
            className="w-[280px] md:w-[360px] aspect-[10/13] relative group"
          >
            {/* SHADOW - Static on Mobile, Dynamic on Desktop */}
            <motion.div
              style={{
                x: isMobile ? 0 : shadowX,
                y: isMobile ? 0 : shadowY,
              }}
              className={`absolute inset-6 rounded-2xl bg-[#141B1A]/30 blur-[60px] -z-10 ${isMobile ? "" : "group-hover:bg-[#141B1A]/40"}`}
            />

            <div className="absolute inset-0 rounded-2xl overflow-hidden border border-[#141B1A]/10 bg-[#F7F3E9] shadow-2xl">
              <Image
                src="/images/myImage.jpg"
                alt="Snigdha"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[#A64D32]/10 mix-blend-overlay opacity-40" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] z-20" />
    </section>
  );
}
