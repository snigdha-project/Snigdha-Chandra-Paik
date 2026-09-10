"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, MapPin, ShieldCheck, Sparkle, X } from "lucide-react";
import LeadForm from "./LeadForm";
import MagneticCta from "./MagneticCta";
import StickyLeadCta from "./StickyLeadCta";
import type { LandingConfig } from "./types";

const EASE = [0.22, 1, 0.36, 1] as const;

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration: 1.5, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, to, suffix, mv]);

  return <motion.span ref={ref}>{text}</motion.span>;
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Infinite scrolling strip of the tech/trust chips, doubled so the loop is seamless. */
function ChipMarquee({ chips }: { chips: string[] }) {
  const loop = [...chips, ...chips];
  return (
    <div className="relative overflow-hidden border-y border-[#141B1A]/10 bg-[#F1ECE0] py-4">
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((chip, i) => (
          <span
            key={`${chip}-${i}`}
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-[#141B1A]/45"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#C56E3D]" />
            {chip}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function LocationLandingContent({ config }: { config: LandingConfig }) {
  const c = config;

  return (
    <main className="bg-[#FFFDF6] text-[#141B1A] overflow-x-clip">
      <StickyLeadCta />

      {/* ───────────────── HERO ───────────────── */}
      <section className="relative overflow-hidden bg-[#141B1A] text-[#E8E4D9] px-6 md:px-16 pt-28 md:pt-40 pb-24 md:pb-32">
        <motion.div
          className="absolute top-[-10%] left-[-5%] h-[600px] w-[600px] rounded-full bg-[#C56E3D]/10 blur-[130px] pointer-events-none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#C56E3D]/5 blur-[130px] pointer-events-none"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Floating project cards (desktop only) */}
        {c.heroImages[0] && (
          <motion.a
            href={`#portfolio`}
            initial={{ opacity: 0, x: -40, rotate: -8 }}
            animate={{ opacity: 1, x: 0, rotate: -6, y: [0, -14, 0] }}
            transition={{
              opacity: { duration: 0.8, delay: 0.5 },
              x: { duration: 0.8, delay: 0.5 },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
            }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            className="hidden lg:block absolute left-[3%] top-[24%] w-40 xl:w-52 overflow-hidden rounded-2xl border-4 border-[#F7F3E9]/10 shadow-2xl"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={c.heroImages[0].src}
                alt={c.heroImages[0].alt}
                fill
                sizes="220px"
                className="object-cover"
              />
            </div>
          </motion.a>
        )}
        {c.heroImages[1] && (
          <motion.a
            href={`#portfolio`}
            initial={{ opacity: 0, x: 40, rotate: 8 }}
            animate={{ opacity: 1, x: 0, rotate: 6, y: [0, 16, 0] }}
            transition={{
              opacity: { duration: 0.8, delay: 0.65 },
              x: { duration: 0.8, delay: 0.65 },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.4 },
            }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            className="hidden lg:block absolute right-[3%] bottom-[16%] w-40 xl:w-52 overflow-hidden rounded-2xl border-4 border-[#F7F3E9]/10 shadow-2xl"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={c.heroImages[1].src}
                alt={c.heroImages[1].alt}
                fill
                sizes="220px"
                className="object-cover"
              />
            </div>
          </motion.a>
        )}

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm"
          >
            <MapPin size={12} className="text-[#C56E3D]" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/70">
              {c.trustLine}
            </span>
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-8 block text-[10px] font-black uppercase tracking-[0.5em] text-[#C56E3D]"
          >
            {c.eyebrow}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-5 font-[family-name:var(--font-fraunces)] text-4xl sm:text-6xl md:text-7xl font-black leading-[0.95] tracking-tighter"
          >
            {c.h1Pre}{" "}
            <span className="italic font-[family-name:var(--font-playfair)] text-[#C56E3D]">
              {c.h1Accent}
            </span>{" "}
            {c.h1Post}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mx-auto mt-6 max-w-2xl text-base md:text-lg font-medium leading-relaxed text-white/60"
          >
            {c.subhead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-10 flex flex-col items-center gap-6"
          >
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <MagneticCta variant="solid">Get My Free Proposal</MagneticCta>
              <MagneticCta variant="outline" icon={false}>
                Book a Free Call
              </MagneticCta>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {c.heroChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/60"
                >
                  {chip}
                </span>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-2 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-5"
            >
              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/20">
                <Image src="/images/myImage.jpg" alt="Snigdha Chandra Paik" fill sizes="32px" className="object-cover" />
              </div>
              <span className="text-[10px] font-bold text-white/60">
                Built and supported personally, no agency hand offs
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <ChipMarquee chips={[...c.heroChips, c.market, "Free Consultation", "Fixed Pricing"]} />

      {/* ───────────────── STATS BAND ───────────────── */}
      <section className="border-b border-[#141B1A]/10 bg-[#FFFDF6] px-6 md:px-16 py-12 md:py-16">
        <div className="mx-auto grid max-w-[1000px] grid-cols-2 gap-8 md:grid-cols-4">
          {c.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <motion.p
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="font-[family-name:var(--font-fraunces)] text-4xl md:text-5xl font-black text-[#141B1A]"
              >
                <Counter to={s.to} suffix={s.suffix} />
              </motion.p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#141B1A]/40">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────── SERVICES ───────────────── */}
      <section className="px-6 md:px-16 py-20 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          <Reveal className="max-w-2xl">
            <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-[#C56E3D]">
              {c.servicesEyebrow}
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl md:text-5xl font-black uppercase tracking-tighter">
              {c.servicesTitle}
            </h2>
            <p className="mt-4 text-sm md:text-base font-medium leading-relaxed text-[#141B1A]/55">
              {c.servicesIntro}
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {c.services.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 250, damping: 18 }}
                  className="group h-full border-2 border-[#141B1A] bg-white p-7 transition-shadow duration-300 hover:shadow-[8px_8px_0px_#C56E3D]"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#141B1A] text-[#C56E3D] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                    <s.icon size={20} />
                  </div>
                  <h3 className="font-[family-name:var(--font-fraunces)] text-xl font-black uppercase tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-[#141B1A]/60">
                    {s.desc}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-14 flex justify-center">
            <MagneticCta variant="ghost">Get a Fixed Quote</MagneticCta>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── NICHE SPOTLIGHT ───────────────── */}
      <section className="bg-[#F1ECE0] px-6 md:px-16 py-20 md:py-28">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-[#C56E3D]">
              <Sparkle size={13} />
              {c.nicheSpotlight.eyebrow}
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl md:text-5xl font-black uppercase tracking-tighter">
              {c.nicheSpotlight.title}
            </h2>
            <p className="mt-4 text-sm md:text-base font-medium leading-relaxed text-[#141B1A]/60">
              {c.nicheSpotlight.paragraph}
            </p>
            <ul className="mt-6 space-y-3">
              {c.nicheSpotlight.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm font-bold text-[#141B1A]/80">
                  <Check size={16} className="mt-0.5 shrink-0 text-[#C56E3D]" strokeWidth={3} />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <MagneticCta variant="light">Get This Kind of Site</MagneticCta>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-[#141B1A] shadow-xl"
            >
              <Image
                src={c.nicheSpotlight.image.src}
                alt={c.nicheSpotlight.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── WHY US / COMPARISON ───────────────── */}
      <section className="relative overflow-hidden bg-[#141B1A] text-[#E8E4D9] px-6 md:px-16 py-20 md:py-28">
        <motion.div
          className="absolute top-1/2 right-[-10%] h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#C56E3D]/5 blur-[130px] pointer-events-none"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative z-10 mx-auto max-w-[1100px]">
          <Reveal className="max-w-2xl">
            <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-[#C56E3D]">
              {c.whyEyebrow}
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl md:text-5xl font-black uppercase tracking-tighter">
              {c.whyTitle}
            </h2>
            <p className="mt-4 max-w-xl text-sm md:text-base font-medium leading-relaxed text-white/55">
              {c.whyIntro}
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-14 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 pr-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    &nbsp;
                  </th>
                  <th className="py-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#C56E3D]">
                    Snigdha Chandra Paik
                  </th>
                  <th className="py-4 pl-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    Typical Agency
                  </th>
                </tr>
              </thead>
              <tbody>
                {c.comparisonRows.map((row) => (
                  <motion.tr
                    key={row.label}
                    whileHover={{ backgroundColor: "rgba(197,110,61,0.06)" }}
                    className="border-b border-white/5"
                  >
                    <td className="py-4 pr-4 text-xs md:text-sm font-bold text-white/70">
                      {row.label}
                    </td>
                    <td className="py-4 px-4 text-xs md:text-sm font-medium text-white">
                      <span className="flex items-start gap-2">
                        <Check size={14} className="mt-0.5 shrink-0 text-[#C56E3D]" strokeWidth={3} />
                        {row.us}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-xs md:text-sm font-medium text-white/40">
                      <span className="flex items-start gap-2">
                        <X size={14} className="mt-0.5 shrink-0 text-white/25" strokeWidth={3} />
                        {row.typical}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          <Reveal delay={0.25} className="mt-14 flex justify-center">
            <MagneticCta variant="solid">Skip the Agency Markup</MagneticCta>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── PORTFOLIO ───────────────── */}
      {c.portfolio.length > 0 && (
        <section id="portfolio" className="px-6 md:px-16 py-20 md:py-28 scroll-mt-20">
          <div className="mx-auto max-w-[1200px]">
            <Reveal className="max-w-2xl">
              <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-[#C56E3D]">
                {c.portfolioEyebrow}
              </span>
              <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl md:text-5xl font-black uppercase tracking-tighter">
                {c.portfolioTitle}
              </h2>
              <p className="mt-4 text-sm md:text-base font-medium leading-relaxed text-[#141B1A]/55">
                {c.portfolioIntro}
              </p>
            </Reveal>

            <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {c.portfolio.map((p, i) => (
                <Reveal key={p.title} delay={(i % 3) * 0.1}>
                  <motion.a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 250, damping: 18 }}
                    className="group block border-2 border-[#141B1A] bg-white transition-shadow duration-300 hover:shadow-[8px_8px_0px_#C56E3D]"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden border-b-2 border-[#141B1A]">
                      <Image
                        src={p.image}
                        alt={`${p.title}, ${p.category} website built by Snigdha Chandra Paik`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-end justify-end bg-[#141B1A]/0 p-4 opacity-0 transition-all duration-300 group-hover:bg-[#141B1A]/20 group-hover:opacity-100">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C56E3D] text-[#141B1A] shadow-lg">
                          <ArrowUpRight size={18} />
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#C56E3D]">
                        {p.category}
                      </span>
                      <h3 className="mt-2 font-[family-name:var(--font-fraunces)] text-xl font-black tracking-tight">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-xs font-medium leading-relaxed text-[#141B1A]/55">
                        {p.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {p.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-[#141B1A] px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-white"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.a>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2} className="mt-14 flex justify-center">
              <MagneticCta variant="ghost">Want a Site Like These?</MagneticCta>
            </Reveal>
          </div>
        </section>
      )}

      {/* ───────────────── REGION INFO ───────────────── */}
      <section className="bg-[#F1ECE0] px-6 md:px-16 py-20 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-[#C56E3D]">
              {c.regionEyebrow}
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl md:text-5xl font-black uppercase tracking-tighter">
              {c.regionTitle}
            </h2>
            {c.regionParagraphs.map((p, i) => (
              <p key={i} className="mt-4 text-sm md:text-base font-medium leading-relaxed text-[#141B1A]/60">
                {p}
              </p>
            ))}

            <div className="mt-8 flex items-center gap-4 rounded-2xl border-2 border-[#141B1A] bg-[#FFFDF6] p-5">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-[#141B1A]">
                <Image src="/images/MyAboutImage.jpg" alt="Snigdha Chandra Paik" fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-fraunces)] text-base font-black tracking-tight">
                  Talk to Snigdha directly
                </p>
                <p className="mt-0.5 text-xs font-medium text-[#141B1A]/55">
                  No sales team in between, ever.
                </p>
              </div>
              <MagneticCta variant="ghost" icon={false} className="ml-auto shrink-0 px-5 py-3">
                Say Hi
              </MagneticCta>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#141B1A]/40">
              Areas and industries served
            </p>
            <div className="flex flex-wrap gap-2.5">
              {c.regionAreas.map((area, i) => (
                <motion.span
                  key={area}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: i * 0.04, ease: EASE }}
                  whileHover={{ scale: 1.08, backgroundColor: "#141B1A", color: "#FFFDF6" }}
                  className="rounded-full border-2 border-[#141B1A] bg-[#FFFDF6] px-4 py-2 text-xs font-bold text-[#141B1A] cursor-default"
                >
                  {area}
                </motion.span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── PROCESS ───────────────── */}
      <section className="px-6 md:px-16 py-20 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          <Reveal className="max-w-2xl">
            <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-[#C56E3D]">
              {c.processEyebrow}
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl md:text-5xl font-black uppercase tracking-tighter">
              {c.processTitle}
            </h2>
          </Reveal>

          <div className="relative mt-14">
            <div className="absolute left-0 top-0 h-0.5 w-full bg-[#141B1A]/10" />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.6, ease: EASE }}
              style={{ transformOrigin: "left" }}
              className="absolute left-0 top-0 h-0.5 w-full bg-[#C56E3D]"
            />
            <div className="grid grid-cols-1 gap-10 pt-10 md:grid-cols-4">
              {c.steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.15}>
                  <div className="relative">
                    <span className="font-[family-name:var(--font-fraunces)] text-5xl font-black text-[#C56E3D]">
                      {s.n}
                    </span>
                    {i === 0 && (
                      <span className="absolute left-14 top-3 flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C56E3D] opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#C56E3D]" />
                      </span>
                    )}
                    <h3 className="mt-4 font-[family-name:var(--font-fraunces)] text-xl font-black uppercase tracking-tight">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-[#141B1A]/60">
                      {s.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.2} className="mt-14 flex justify-center">
            <MagneticCta variant="light">Start Step One</MagneticCta>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── LEAD FORM ───────────────── */}
      <section id="lead-form" className="relative overflow-hidden bg-[#141B1A] text-[#E8E4D9] px-6 md:px-16 py-20 md:py-28 scroll-mt-20">
        <motion.div
          className="absolute inset-0 -z-0 opacity-40"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C56E3D]/10 blur-[130px]" />
        </motion.div>
        <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <span className="block text-[10px] font-black uppercase tracking-[0.5em] text-[#C56E3D]">
              {c.ctaSubtitle}
            </span>
            <h2 className="mt-5 font-[family-name:var(--font-fraunces)] text-4xl md:text-6xl font-black leading-[0.95] tracking-tighter">
              {c.ctaTitle}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base font-medium leading-relaxed text-white/60 lg:mx-0">
              Fill in the form and I&apos;ll get back to you within 24 hours with a clear, no-obligation plan. No call centre, no account manager, just me.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {["Free consultation", "24-hour reply", "No obligation"].map((item) => (
                <span key={item} className="flex items-center gap-2 text-xs font-bold text-white/70">
                  <ShieldCheck size={15} className="text-[#C56E3D]" />
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15} className="rounded-2xl bg-[#FFFDF6] p-8 sm:p-10 md:p-12">
            <LeadForm
              sourceLabel={`Landing Page: ${c.market}`}
              heading={c.formHeading}
              subheading={c.formSubheading}
            />
          </Reveal>
        </div>
      </section>

      {/* ───────────────── FAQ ───────────────── */}
      <section className="bg-[#F1ECE0] px-6 md:px-16 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <Reveal className="text-center">
            <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-[#C56E3D]">
              FAQ
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Questions, answered
            </h2>
          </Reveal>

          <div className="mt-12 space-y-4">
            {c.faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.06}>
                <details className="group border-2 border-[#141B1A] bg-[#FFFDF6] p-6 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-[family-name:var(--font-fraunces)] text-lg font-black uppercase tracking-tight">
                    {f.q}
                    <span className="shrink-0 text-[#C56E3D] transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-sm font-medium leading-relaxed text-[#141B1A]/60">
                    {f.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-14 flex flex-col items-center gap-5">
            <MagneticCta variant="solid">Still Have Questions? Ask Directly</MagneticCta>
            <Link
              href="/free-website-audit"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#141B1A]/50 hover:text-[#C56E3D] transition-colors"
            >
              Not ready to talk? Get a free website and SEO audit first
              <ArrowRight size={13} />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
