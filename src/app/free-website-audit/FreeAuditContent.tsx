"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import {
  Search,
  Gauge,
  Smartphone,
  Target,
  Code2,
  BarChart3,
  Check,
  ArrowRight,
} from "lucide-react";

type Faq = { q: string; a: string };

const auditChecks = [
  {
    icon: Search,
    title: "SEO & Visibility",
    desc: "Keyword gaps, indexing problems, and on-page issues keeping you off page one of Google.",
  },
  {
    icon: Gauge,
    title: "Speed & Core Web Vitals",
    desc: "Load time, LCP and CLS — the performance issues quietly costing you rankings and sales.",
  },
  {
    icon: Smartphone,
    title: "Mobile Experience",
    desc: "How your site really looks and works on phones, where most of your visitors actually are.",
  },
  {
    icon: Target,
    title: "Conversion & UX",
    desc: "Why visitors leave without enquiring — and the quick wins that turn them into leads.",
  },
  {
    icon: Code2,
    title: "Technical Health",
    desc: "Schema, broken links, redirects, security and crawl issues hiding under the hood.",
  },
  {
    icon: BarChart3,
    title: "Competitor Gap",
    desc: "What your top-ranking competitors do that you don't — and how to close the gap.",
  },
];

const steps = [
  {
    n: "01",
    title: "Send your website",
    desc: "Share your URL and goals on the contact page. It takes about 30 seconds.",
  },
  {
    n: "02",
    title: "I audit it by hand",
    desc: "A real human review of your SEO, speed and conversion — not a generic auto-generated report.",
  },
  {
    n: "03",
    title: "Get your action plan",
    desc: "A clear, prioritised report of exactly what to fix first — delivered within 48 hours.",
  },
];

const stats = [
  { to: 25, suffix: "+", label: "Checkpoints" },
  { to: 6, suffix: "", label: "Growth Areas" },
  { to: 48, suffix: "h", label: "Turnaround" },
  { to: 100, suffix: "%", label: "Free" },
];

const benchmark = [
  { label: "Search Visibility", weak: 34, strong: 91 },
  { label: "Page Speed", weak: 46, strong: 95 },
  { label: "Mobile Experience", weak: 52, strong: 97 },
  { label: "Conversion Readiness", weak: 29, strong: 88 },
];

const trustBadges = [
  "100% Free",
  "Human-reviewed",
  "48-hour delivery",
  "No obligation",
];

const EASE = [0.22, 1, 0.36, 1] as const;

/* Count-up number that animates once it scrolls into view. */
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

/* Reusable scroll-reveal wrapper. */
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

/* Animated benchmark bars for one metric (weak vs strong). */
function BenchmarkRow({
  label,
  weak,
  strong,
  delay,
}: {
  label: string;
  weak: number;
  strong: number;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <p className="mb-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-white/60">
        {label}
      </p>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${weak}%` }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 1.1, ease: EASE }}
              className="h-full rounded-full bg-white/25"
            />
          </div>
          <span className="w-9 text-right text-[11px] font-bold tabular-nums text-white/40">
            <Counter to={weak} suffix="%" />
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${strong}%` }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 1.3, ease: EASE, delay: 0.15 }}
              className="h-full rounded-full bg-[#C56E3D]"
            />
          </div>
          <span className="w-9 text-right text-[11px] font-bold tabular-nums text-[#C56E3D]">
            <Counter to={strong} suffix="%" />
          </span>
        </div>
      </div>
    </Reveal>
  );
}

export default function FreeAuditContent({ faqs }: { faqs: Faq[] }) {
  return (
    <main className="bg-[#FFFDF6] text-[#141B1A] overflow-x-clip">
      {/* ───────────────── HERO ───────────────── */}
      <section className="relative overflow-hidden bg-[#141B1A] text-[#E8E4D9] px-6 md:px-16 pt-28 md:pt-40 pb-20 md:pb-28">
        <div className="absolute top-[-10%] left-[-5%] h-[600px] w-[600px] rounded-full bg-[#C56E3D]/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#C56E3D]/5 blur-[130px] pointer-events-none" />

        {/* Continuous "scanning" line — evokes an audit in progress */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C56E3D]/50 to-transparent"
          initial={{ top: "0%" }}
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6FBF73] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#6FBF73]" />
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/70">
              100% Free · No Obligation
            </span>
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-8 block text-[10px] font-black uppercase tracking-[0.5em] text-[#C56E3D]"
          >
            Free Website &amp; SEO Audit
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-5 font-[family-name:var(--font-fraunces)] text-4xl sm:text-6xl md:text-7xl font-black leading-[0.95] tracking-tighter"
          >
            Why isn&apos;t your website bringing you{" "}
            <span className="italic font-[family-name:var(--font-playfair)] text-[#C56E3D]">
              customers?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mx-auto mt-6 max-w-2xl text-base md:text-lg font-medium leading-relaxed text-white/60"
          >
            Get a free, hand-reviewed audit of your site&apos;s SEO, speed and
            conversion — with a prioritised action plan to fix exactly
            what&apos;s holding you back. Delivered within 48 hours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-10 flex flex-col items-center gap-4"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-[#C56E3D] px-9 py-5 text-[#141B1A] transition-all duration-300 hover:bg-[#E8E4D9]"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.25em]">
                Get My Free Audit
              </span>
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {trustBadges.map((b) => (
                <span
                  key={b}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40"
                >
                  <Check size={12} className="text-[#C56E3D]" strokeWidth={3} />
                  {b}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────────────── STATS BAND ───────────────── */}
      <section className="border-b border-[#141B1A]/10 bg-[#FFFDF6] px-6 md:px-16 py-12 md:py-16">
        <div className="mx-auto grid max-w-[1000px] grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="font-[family-name:var(--font-fraunces)] text-4xl md:text-5xl font-black text-[#141B1A]">
                <Counter to={s.to} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#141B1A]/40">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────── WHAT'S INSIDE ───────────────── */}
      <section className="px-6 md:px-16 py-20 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          <Reveal className="max-w-2xl">
            <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-[#C56E3D]">
              What&apos;s Inside
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Your audit covers 6 growth areas
            </h2>
            <p className="mt-4 text-sm md:text-base font-medium leading-relaxed text-[#141B1A]/55">
              Not a generic score from an automated tool — a hand-reviewed
              breakdown of what&apos;s working, what&apos;s broken, and what to
              fix first to win more customers.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {auditChecks.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 0.1}>
                <div className="group h-full border-2 border-[#141B1A] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#C56E3D]">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#141B1A] text-[#C56E3D] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <c.icon size={20} />
                  </div>
                  <h3 className="font-[family-name:var(--font-fraunces)] text-xl font-black uppercase tracking-tight">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-[#141B1A]/60">
                    {c.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── COMPETITOR ANALYSIS ───────────────── */}
      <section className="relative overflow-hidden bg-[#141B1A] text-[#E8E4D9] px-6 md:px-16 py-20 md:py-28">
        <div className="absolute top-1/2 right-[-10%] h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#C56E3D]/5 blur-[130px] pointer-events-none" />
        <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-[#C56E3D]">
                Competitor Analysis
              </span>
              <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl md:text-5xl font-black uppercase tracking-tighter">
                See where you&apos;re losing ground
              </h2>
              <p className="mt-4 max-w-md text-sm md:text-base font-medium leading-relaxed text-white/55">
                Your audit benchmarks your site against the competitors already
                ranking above you — across the metrics that actually win
                customers — then shows you exactly how to close the gap.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/25" /> Most
                  sites
                </span>
                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#C56E3D]" />{" "}
                  Page-one competitors
                </span>
              </div>
              <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.15em] text-white/25">
                Figures illustrative — your report uses your real data.
              </p>
            </Reveal>
          </div>

          <div className="space-y-7">
            {benchmark.map((m, i) => (
              <BenchmarkRow
                key={m.label}
                label={m.label}
                weak={m.weak}
                strong={m.strong}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── AUDIT PROCESS ───────────────── */}
      <section className="px-6 md:px-16 py-20 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          <Reveal className="max-w-2xl">
            <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-[#C56E3D]">
              The Process
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Three simple steps
            </h2>
          </Reveal>

          {/* Animated progress line that fills as the steps reveal */}
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

            <div className="grid grid-cols-1 gap-10 pt-10 md:grid-cols-3">
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.18}>
                  <div className="relative">
                    <span className="font-[family-name:var(--font-fraunces)] text-5xl font-black text-[#C56E3D]">
                      {s.n}
                    </span>
                    {i === 1 && (
                      <span className="absolute left-16 top-4 flex h-2.5 w-2.5">
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
        </div>
      </section>

      {/* ───────────────── FINAL CTA ───────────────── */}
      <section className="relative overflow-hidden bg-[#141B1A] text-[#E8E4D9] px-6 md:px-16 py-20 md:py-28">
        <div className="absolute inset-0 -z-0 opacity-40">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C56E3D]/10 blur-[130px]" />
        </div>
        <Reveal className="relative z-10 mx-auto max-w-3xl text-center">
          <span className="block text-[10px] font-black uppercase tracking-[0.5em] text-[#C56E3D]">
            No Obligation · 48-Hour Turnaround
          </span>
          <h2 className="mt-5 font-[family-name:var(--font-fraunces)] text-4xl md:text-6xl font-black leading-[0.95] tracking-tighter">
            Ready to see what&apos;s holding your site back?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base font-medium leading-relaxed text-white/60">
            Send me your website and I&apos;ll review it by hand — your free,
            prioritised action plan lands in your inbox within 48 hours.
          </p>
          <Link
            href="/contact"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[#C56E3D] px-10 py-5 text-[#141B1A] transition-all duration-300 hover:bg-[#E8E4D9]"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.25em]">
              Get My Free Audit
            </span>
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </Reveal>
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
            {faqs.map((f, i) => (
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
        </div>
      </section>
    </main>
  );
}
