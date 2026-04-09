"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Compass, Fingerprint } from "lucide-react";

// --- Guidance Fluid Simulation ---
function GuidanceFluid({
  containerRef,
}: {
  // FIXED: Added | null to match the useRef type and satisfy the compiler
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Safety check already exists here, so the code remains safe
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: any[] = [];
    const maxParticles = 60;

    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (particles.length < maxParticles) {
        particles.push({
          x,
          y,
          size: Math.random() * 45 + 20,
          opacity: 0.6,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "screen";

      particles.forEach((p, i) => {
        p.opacity -= 0.008;
        p.size += 0.6;
        p.x += p.vx;
        p.y += p.vy;

        if (p.opacity <= 0) {
          particles.splice(i, 1);
        } else {
          const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.size,
          );
          gradient.addColorStop(0, `rgba(197, 110, 61, ${p.opacity * 0.45})`);
          gradient.addColorStop(1, `rgba(197, 110, 61, 0)`);
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
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

export default function Tirtharaj() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#FFFDF6] overflow-hidden flex flex-col justify-center py-20 px-6 md:px-16"
    >
      <GuidanceFluid containerRef={sectionRef} />

      <div className="max-w-[1400px] mx-auto w-full relative z-20">
        {/* Header Block */}
        <div className="mb-12 md:mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[9px] uppercase tracking-[0.6em] md:tracking-[1em] text-[#C56E3D] font-black block mb-4"
          >
            The Navigator
          </motion.span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-4xl sm:text-6xl md:text-8xl text-[#141B1A] font-black tracking-tighter leading-[1.1] md:leading-[0.9]">
            Brother. Mentor. <br className="hidden sm:block" />
            <span className="italic font-[family-name:var(--font-playfair)] text-[#C56E3D]">
              Tirtharaj Bhowmik.
            </span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-32 items-center lg:items-start">
          {/* Portrait - Responsive Sizing */}
          <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className={`relative w-full max-w-[450px] aspect-[4/5] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden transition-all duration-1000
              ${isHovered ? "shadow-[0_0_60px_rgba(197,110,61,0.3)] scale-[1.02]" : "shadow-xl md:shadow-2xl"}`}
          >
            <Image
              src="/images/Gurudev.png"
              alt="Tirtharaj Bhowmik"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141B1A]/60 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <Compass className="text-[#C56E3D]" size={18} />
              </div>
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-white">
                Brotherhood & Guidance
              </span>
            </div>
          </motion.div>

          {/* Emotional Content - Better spacing for small screens */}
          <div className="flex-1 space-y-8 md:space-y-10 pt-0 lg:pt-12">
            <div className="space-y-6">
              <p className="font-[family-name:var(--font-fraunces)] text-xl sm:text-2xl md:text-4xl text-[#141B1A] font-medium leading-tight italic">
                &ldquo;Tirtha Da is more than a senior to me. He is the brother
                from another mother who helps me evolve in every aspect of
                life.&rdquo;
              </p>

              <div className="h-[1px] w-24 bg-[#C56E3D]/30" />

              <p className="text-base md:text-xl text-[#141B1A]/70 leading-relaxed font-medium">
                He has always been more than just a mentor; he is my guide and
                my closest friend. Tirtha Da helps me navigate life's complex
                challenges, encouraging me to grow beyond my limits. He has
                proven to me that the strongest bonds are built on genuine care
                and shared growth.
              </p>
            </div>

            {/* Tags - Centered on mobile, left on desktop */}
            <div className="flex flex-row flex-wrap gap-3 md:gap-4 pt-4">
              {["Growth Mentor", "Life Guide", "Brotherly Support"].map(
                (tag) => (
                  <div
                    key={tag}
                    className="px-4 md:px-5 py-2 md:py-2.5 rounded-full border border-[#141B1A]/10 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#141B1A]/40 bg-white/60 backdrop-blur-sm shadow-sm whitespace-nowrap"
                  >
                    {tag}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Background Element - Hidden on very small screens to avoid clutter */}
      <div className="absolute -bottom-20 -right-20 md:bottom-10 md:right-10 pointer-events-none select-none opacity-5 group hidden sm:block">
        <Fingerprint
          size={300}
          className="text-[#141B1A] rotate-12 transition-transform duration-1000 group-hover:rotate-45"
        />
      </div>
    </section>
  );
}
