"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";

// --- Advanced Fluid Simulation (Internal & Scoped) ---
function FluidSimulation({
  activeTarget,
  targetPos,
  containerRef,
}: {
  activeTarget: "button" | "image" | null;
  targetPos: { x: number; y: number } | null;
  // FIXED: Added | null to the RefObject type to match useRef initialization
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Safety check: if either is null, we exit early
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = container.offsetWidth;
    let height = container.offsetHeight;
    let particles: any[] = [];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;

      constructor(x: number, y: number, isSpecial = false) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * (isSpecial ? 4 : 1.5);
        this.vy = (Math.random() - 0.5) * (isSpecial ? 4 : 1.5);
        this.radius = isSpecial
          ? Math.random() * 80 + 40
          : Math.random() * 50 + 20;
        this.alpha = isSpecial ? 0.7 : 0.5;
        this.color = "197, 110, 61";
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.007;
        this.radius += 1.1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.radius,
        );
        gradient.addColorStop(0, `rgba(${this.color}, ${this.alpha})`);
        gradient.addColorStop(1, `rgba(${this.color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (particles.length < 150) {
        particles.push(new Particle(x, y));
      }
    };

    const burstInterval = setInterval(() => {
      if (activeTarget && targetPos && container) {
        const rect = container.getBoundingClientRect();
        const x = targetPos.x - rect.left;
        const y = targetPos.y - rect.top;

        const count = activeTarget === "image" ? 4 : 2;
        for (let i = 0; i < count; i++) {
          particles.push(
            new Particle(
              x + (Math.random() * 160 - 80),
              y + (Math.random() * 160 - 80),
              true,
            ),
          );
        }
      }
    }, 40);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "screen";
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      requestAnimationFrame(animate);
    };

    const resize = () => {
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;
    };

    container.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
      clearInterval(burstInterval);
    };
  }, [activeTarget, targetPos, containerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0, filter: "blur(35px)" }}
    />
  );
}

export default function AboutHero() {
  const heroRef = useRef<HTMLElement>(null);
  const [interaction, setInteraction] = useState<{
    target: "button" | "image" | null;
    pos: { x: number; y: number } | null;
  }>({
    target: null,
    pos: null,
  });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 25 });
  const springY = useSpring(y, { stiffness: 400, damping: 25 });

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen pt-32 pb-20 md:pt-48 md:pb-40 px-6 md:px-16 overflow-hidden bg-[#FFFDF6]"
    >
      <FluidSimulation
        activeTarget={interaction.target}
        targetPos={interaction.pos}
        containerRef={heroRef}
      />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-start">
          <motion.div
            onMouseMove={(e) =>
              setInteraction({
                target: "image",
                pos: { x: e.clientX, y: e.clientY },
              })
            }
            onMouseLeave={() => setInteraction({ target: null, pos: null })}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative w-full md:w-[480px] aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl z-20 transition-all duration-700
              ${interaction.target === "image" ? "shadow-[0_0_80px_rgba(197,110,61,0.4)] scale-[1.01]" : ""}`}
          >
            <Image
              src="/images/MyAboutImage.jpg"
              alt="Snigdha Chandra Paik working on Next.js & Three.js frontend projects"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141B1A]/40 to-transparent" />
          </motion.div>

          <div className="flex-1 relative z-20">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[10px] uppercase tracking-[1em] text-[#C56E3D] font-black block mb-12"
            >
              The Persona
            </motion.span>

            <h1 className="font-[family-name:var(--font-fraunces)] text-6xl md:text-[8.5rem] text-[#141B1A] font-black tracking-tighter leading-[0.82] mb-12">
              <span className="block">Code.</span>
              <span className="block italic font-[family-name:var(--font-playfair)] text-[#C56E3D]">
                Community.
              </span>
              <span className="block">Context.</span>
            </h1>

            <div className="max-w-md space-y-12">
              <p className="text-lg md:text-xl text-[#141B1A]/80 leading-relaxed font-medium">
                I am{" "}
                <span className="text-[#141B1A] font-black underline decoration-[#C56E3D]/30 underline-offset-4">
                  Snigdha Chandra Paik
                </span>
                . A bridge between complex architectures and organic digital
                experiences.
              </p>

              <div className="flex flex-row flex-wrap gap-4 pt-4">
                {["Webflow Expert", "Computer Science", "SEO Specialist"].map(
                  (tag) => (
                    <div
                      key={tag}
                      className="px-5 py-2.5 rounded-full border border-[#141B1A]/10 text-[9px] font-black uppercase tracking-widest text-[#141B1A]/40 bg-white/60 backdrop-blur-sm shadow-sm whitespace-nowrap"
                    >
                      {tag}
                    </div>
                  ),
                )}
              </div>

              <div className="pt-8">
                <motion.a
                  href="/CV/Snigdha_Chandra_Paik_Resume.pdf"
                  download
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.4);
                    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.4);
                    setInteraction({
                      target: "button",
                      pos: { x: e.clientX, y: e.clientY },
                    });
                  }}
                  onMouseLeave={() => {
                    x.set(0);
                    y.set(0);
                    setInteraction({ target: null, pos: null });
                  }}
                  style={{ x: springX, y: springY }}
                  className={`group relative inline-flex items-center gap-6 px-12 py-6 rounded-full overflow-hidden transition-all duration-500 
                    ${interaction.target === "button" ? "bg-[#C56E3D] shadow-[0_0_50px_rgba(197,110,61,0.6)]" : "bg-[#141B1A]"}`}
                >
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-[#C56E3D] -z-0"
                    initial={{ height: "0%" }}
                    animate={{
                      height: interaction.target === "button" ? "100%" : "0%",
                    }}
                    transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
                  />
                  <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.5em] text-white">
                    Download CV
                  </span>
                  <div
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${interaction.target === "button" ? "bg-white text-[#C56E3D]" : "bg-white/10 text-white"}`}
                  >
                    <Download size={18} />
                  </div>
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-10 right-0 pointer-events-none select-none hidden md:block">
        <span className="text-[18rem] font-black text-[#141B1A]/[0.05] tracking-tighter leading-none whitespace-nowrap translate-y-1/2 uppercase">
          Engineered
        </span>
      </div>
    </section>
  );
}
