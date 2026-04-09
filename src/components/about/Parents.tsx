"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Heart, ShieldCheck, Utensils, Sprout } from "lucide-react";

function HeartVineTrail({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const trails = [
      { points: [] as any[], maxAge: 50, color: "255, 182, 193", offset: 0 },
      { points: [] as any[], maxAge: 60, color: "197, 110, 61", offset: 15 },
      { points: [] as any[], maxAge: 55, color: "255, 182, 193", offset: -15 },
      { points: [] as any[], maxAge: 45, color: "210, 180, 140", offset: 5 },
    ];

    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      trails.forEach((trail) => {
        trail.points.push({
          x: relativeX + trail.offset,
          y: relativeY + trail.offset,
          age: 0,
          sizeBoost: Math.random() * 1.5,
        });
      });
    };

    const drawHeart = (
      x: number,
      y: number,
      size: number,
      opacity: number,
      color: string,
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size, size);
      ctx.beginPath();
      ctx.fillStyle = `rgba(${color}, ${opacity * 0.4})`;
      ctx.shadowBlur = 15;
      ctx.shadowColor = `rgba(${color}, ${opacity * 0.5})`;
      ctx.moveTo(0, 5);
      ctx.bezierCurveTo(0, 0, -10, -5, -10, 5);
      ctx.bezierCurveTo(-10, 15, 0, 20, 0, 25);
      ctx.bezierCurveTo(0, 20, 10, 15, 10, 5);
      ctx.bezierCurveTo(10, -5, 0, 0, 0, 5);
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "multiply";
      trails.forEach((trail) => {
        trail.points = trail.points.filter((p) => p.age < trail.maxAge);
        for (let i = 0; i < trail.points.length; i++) {
          const p = trail.points[i];
          p.age++;
          const opacity = 1 - p.age / trail.maxAge;
          const scale = p.age * 0.04 * p.sizeBoost;
          if (i % 5 === 0) drawHeart(p.x, p.y, scale, opacity, trail.color);
        }
      });
      requestAnimationFrame(animate);
    };

    container.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
    />
  );
}

export default function Parents() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen md:h-screen w-full bg-[#FFFDF6] overflow-hidden flex flex-col justify-center py-24 px-8 md:px-20 lg:px-32"
    >
      <HeartVineTrail containerRef={sectionRef} />

      {/* Main Content Container - Ensures left alignment for everything */}
      <div className="max-w-[1400px] w-full mx-auto relative z-20">
        {/* Header - No longer absolute so it follows the container's padding */}
        <div className="mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[1em] text-[#C56E3D] font-black block mb-4"
          >
            The Roots
          </motion.span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-5xl md:text-7xl text-[#141B1A] font-black tracking-tighter leading-tight">
            The Architecture <br />
            <span className="italic font-[family-name:var(--font-playfair)] text-[#C56E3D]">
              of Home.
            </span>
          </h2>
        </div>

        {/* Grid aligned with the header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-center">
          {/* MOTHER SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group flex flex-col md:flex-row gap-8 md:gap-12 items-center"
          >
            <div className="relative aspect-[3/4] w-full md:w-[320px] flex-shrink-0 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <Image
                src="/images/Mother.jpg"
                alt="Mother"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141B1A]/80 via-transparent to-transparent" />
              <Heart
                className="absolute bottom-6 left-6 text-[#FFB6C1] fill-[#FFB6C1]"
                size={20}
              />
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <h3 className="font-[family-name:var(--font-fraunces)] text-3xl text-[#141B1A] font-black tracking-tighter">
                My Mother.
              </h3>
              <p className="text-[15px] md:text-[16px] text-[#141B1A]/80 leading-relaxed font-medium">
                She is far more than a mother; she is the first friend I ever
                knew. Her unwavering support is the silent current beneath
                everything I build.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-3 text-[#C56E3D]/70 italic text-sm pt-4 border-t border-[#141B1A]/10">
                <Utensils size={16} />
                <span>The flavor of my childhood.</span>
              </div>
            </div>
          </motion.div>

          {/* FATHER SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group flex flex-col md:flex-row gap-8 md:gap-12 items-center"
          >
            <div className="relative aspect-[3/4] w-full md:w-[320px] flex-shrink-0 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <Image
                src="/images/Father.jpg"
                alt="Father"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141B1A]/80 via-transparent to-transparent" />
              <ShieldCheck
                className="absolute bottom-6 left-6 text-[#FFB6C1]"
                size={20}
              />
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <h3 className="font-[family-name:var(--font-fraunces)] text-3xl text-[#141B1A] font-black tracking-tighter">
                My Father.
              </h3>
              <p className="text-[15px] md:text-[16px] text-[#141B1A]/80 leading-relaxed font-medium">
                My north star and inspiration. He is the strength that keeps me
                positive, teaching me that the strongest backbone is built with
                resilience.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-3 text-[#C56E3D]/70 italic text-sm pt-4 border-t border-[#141B1A]/10">
                <Sprout size={16} />
                <span>The root of my passion.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
