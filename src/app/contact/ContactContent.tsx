"use client";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Mail,
  Phone,
  Check,
  Send,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Star,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedinIn,
  faGithub,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";

function InteractiveButton({ isLoading }: { isLoading: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Snappy Spring Config for instant responsiveness
  const springConfig = { stiffness: 400, damping: 20, mass: 0.5 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Magnetic pull strength
    x.set((e.clientX - centerX) * 0.4);
    y.set((e.clientY - centerY) * 0.4);
  };

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x: mouseXSpring, y: mouseYSpring }}
      whileTap={{ scale: 0.95 }}
      type="submit"
      disabled={isLoading}
      className="w-full bg-[#141B1A] text-white py-5 md:py-6 rounded-full flex items-center justify-center gap-5 group relative overflow-hidden transition-all duration-300 hover:bg-[#C56E3D] disabled:opacity-50"
    >
      <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em]">
        {isLoading ? "Sending..." : "Get My Free Proposal"}
      </span>
      {!isLoading && (
        <div className="relative z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-[#141B1A] transition-all">
          <Send
            size={14}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </div>
      )}
    </motion.button>
  );
}

const benefits = [
  "SEO-ready — engineered to rank on Google",
  "Lightning-fast, animated & mobile-first",
  "Designed to turn visitors into customers",
];

const clients = [
  "Daikin TMI",
  "The House of Abigail",
  "AMJ Mechanical",
  "Texas Bluebonnet",
];

const socials = [
  {
    icon: faLinkedinIn,
    label: "LinkedIn",
    link: "https://www.linkedin.com/in/snigdha-chandra-paik/",
  },
  { icon: faGithub, label: "GitHub", link: "https://github.com/snigdha-project" },
  {
    icon: faInstagram,
    label: "Instagram",
    link: "https://www.instagram.com/snigdha_chandra_paik/",
  },
  { icon: faWhatsapp, label: "WhatsApp", link: "https://wa.me/918391879168" },
];

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    // Zoho's Date field expects `dd-MMM-yyyy` (e.g. 05-Jul-2026), but the
    // native <input type="date"> submits `yyyy-mm-dd` — reformat before sending.
    const rawDate = formData.get("Date");
    if (typeof rawDate === "string" && rawDate) {
      const parsed = new Date(`${rawDate}T00:00:00`);
      if (!Number.isNaN(parsed.getTime())) {
        const day = String(parsed.getDate()).padStart(2, "0");
        const month = parsed.toLocaleString("en-US", { month: "short" });
        formData.set("Date", `${day}-${month}-${parsed.getFullYear()}`);
      }
    }

    try {
      // Direct AJAX submission to Zoho
      await fetch(e.currentTarget.action, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });

      // Premium feeling delay before showing success
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
      }, 1200);
    } catch (error) {
      console.error("Submission failed", error);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFDF6] flex flex-col lg:flex-row pt-16 md:pt-20 overflow-x-clip">
      {/* LEFT SIDE: SALES / VALUE PROPOSITION */}
      <section className="relative w-full lg:w-1/2 overflow-hidden bg-[#141B1A] flex flex-col justify-center p-8 sm:p-12 lg:p-14 xl:p-20">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#C56E3D]/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[500px] h-[500px] bg-[#C56E3D]/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-xl mx-auto lg:mx-0">
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
              Available for new projects
            </span>
          </motion.div>

          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-8 block text-[10px] font-black uppercase tracking-[0.6em] text-[#C56E3D]"
          >
            Free Consultation
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 font-[family-name:var(--font-fraunces)] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-[0.9] text-white"
          >
            Let&apos;s build a site that{" "}
            <span className="italic font-[family-name:var(--font-playfair)] text-[#C56E3D]">
              sells.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-md text-sm md:text-base font-medium leading-relaxed text-white/50"
          >
            I design and build fast, SEO-optimised websites that turn visitors
            into customers — engineered for rankings, speed and conversions.
          </motion.p>

          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 space-y-3.5"
          >
            {benefits.map((b) => (
              <li
                key={b}
                className="flex items-center gap-3 text-sm font-medium text-white/75"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C56E3D]/20 text-[#C56E3D]">
                  <Check size={12} strokeWidth={3.5} />
                </span>
                {b}
              </li>
            ))}
          </motion.ul>

          {/* SOCIAL PROOF */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 border-t border-white/10 pt-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5 text-[#C56E3D]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" />
                ))}
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                Trusted across US · UK · India
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {clients.map((c) => (
                <span
                  key={c}
                  className="text-[11px] font-bold uppercase tracking-wide text-white/50"
                >
                  {c}
                </span>
              ))}
            </div>
          </motion.div>

          {/* DIRECT CHANNELS + SOCIALS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <a
                href="mailto:snigdhachandrapaik@gmail.com"
                className="group flex items-center gap-2.5 text-white/60 transition-colors hover:text-white"
              >
                <Mail size={15} className="text-[#C56E3D]" />
                <span className="text-[11px] font-bold">Email me</span>
              </a>
              <a
                href="https://wa.me/918391879168"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 text-white/60 transition-colors hover:text-white"
              >
                <Phone size={15} className="text-[#C56E3D]" />
                <span className="text-[11px] font-bold">+91 8391879168</span>
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all hover:-translate-y-0.5 hover:border-[#C56E3D]/50 hover:text-[#C56E3D]"
                >
                  <FontAwesomeIcon icon={s.icon} className="text-xs" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* RIGHT SIDE: FORM (scrolls with the page — no nested scrollbar) */}
      <section className="relative w-full lg:w-1/2 flex flex-col justify-center bg-[#FFFDF6] p-8 sm:p-12 lg:p-14 xl:p-20">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="w-full max-w-lg mx-auto"
            >
              <div className="mb-8 md:mb-10">
                <h2 className="font-[family-name:var(--font-fraunces)] text-3xl sm:text-4xl md:text-5xl font-black text-[#141B1A] tracking-tight mb-4">
                  Get your free proposal
                </h2>
                <p className="text-sm text-[#141B1A]/50 font-medium tracking-wide leading-relaxed">
                  Tell me about your project and I&apos;ll reply within 24 hours
                  with a clear, no-obligation plan.
                </p>

                {/* Reassurance row */}
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                  {[
                    "Free consultation",
                    "24-hour reply",
                    "No obligation",
                  ].map((item) => (
                    <span
                      key={item}
                      className="flex items-center gap-1.5 text-[11px] font-bold text-[#141B1A]/60"
                    >
                      <Check size={13} className="text-[#C56E3D]" strokeWidth={3} />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <form
                action="https://forms.zohopublic.com/snigdhachandrapaikgm1/form/Myportfolioform/formperma/IB3-35pXnyBMrjVB84lM1ebg9pXSzOaQvb3kdBbyMMU/htmlRecords/submit"
                method="POST"
                onSubmit={handleSubmit}
                className="space-y-7 md:space-y-8"
              >
                {/* Zoho tracking (hidden) — leave values empty */}
                <input type="hidden" name="zf_referrer_name" defaultValue="" />
                <input type="hidden" name="zf_redirect_url" defaultValue="" />
                <input type="hidden" name="zc_gad" defaultValue="" />

                {/* Field: Name */}
                <div className="group relative">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-[#141B1A]/40 group-focus-within:text-[#C56E3D] transition-colors">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="SingleLine"
                    required
                    placeholder="Snigdha Chandra Paik"
                    className="w-full bg-transparent border-b border-[#141B1A]/10 py-3.5 md:py-4 outline-none focus:border-[#C56E3D] transition-all font-medium text-[#141B1A] placeholder:text-[#141B1A]/30"
                  />
                </div>

                {/* Field: Email */}
                <div className="group relative">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-[#141B1A]/40 group-focus-within:text-[#C56E3D] transition-colors">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="Email"
                    required
                    placeholder="hello@example.com"
                    className="w-full bg-transparent border-b border-[#141B1A]/10 py-3.5 md:py-4 outline-none focus:border-[#C56E3D] transition-all font-medium text-[#141B1A] placeholder:text-[#141B1A]/30"
                  />
                </div>

                {/* Field: Website (optional) */}
                <div className="group relative">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-[#141B1A]/40 group-focus-within:text-[#C56E3D] transition-colors">
                    Website{" "}
                    <span className="text-[#141B1A]/25 normal-case tracking-normal">
                      — optional
                    </span>
                  </label>
                  <input
                    type="text"
                    name="Website"
                    maxLength={2083}
                    placeholder="https://yoursite.com"
                    className="w-full bg-transparent border-b border-[#141B1A]/10 py-3.5 md:py-4 outline-none focus:border-[#C56E3D] transition-all font-medium text-[#141B1A] placeholder:text-[#141B1A]/30"
                  />
                </div>

                {/* Fields: Preferred Date + Time (optional) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-8">
                  <div className="group relative">
                    <label className="text-[10px] uppercase tracking-[0.4em] font-black text-[#141B1A]/40 group-focus-within:text-[#C56E3D] transition-colors">
                      Preferred Date{" "}
                      <span className="text-[#141B1A]/25 normal-case tracking-normal">
                        — optional
                      </span>
                    </label>
                    <input
                      type="date"
                      name="Date"
                      aria-label="Preferred date"
                      className="w-full bg-transparent border-b border-[#141B1A]/10 py-3.5 md:py-4 outline-none focus:border-[#C56E3D] transition-all font-medium text-[#141B1A] scheme-light"
                    />
                  </div>

                  <div className="group relative">
                    <label className="text-[10px] uppercase tracking-[0.4em] font-black text-[#141B1A]/40 group-focus-within:text-[#C56E3D] transition-colors">
                      Preferred Time
                    </label>
                    <div className="flex items-center gap-1.5 border-b border-[#141B1A]/10 py-3.5 md:py-4 transition-all focus-within:border-[#C56E3D]">
                      <select
                        name="Time_hours"
                        defaultValue=""
                        aria-label="Hour"
                        className="bg-transparent outline-none font-medium text-[#141B1A] cursor-pointer"
                      >
                        <option value="">HH</option>
                        {Array.from({ length: 12 }, (_, i) =>
                          String(i + 1).padStart(2, "0"),
                        ).map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                      <span className="text-[#141B1A]/40 font-black">:</span>
                      <select
                        name="Time_minutes"
                        defaultValue=""
                        aria-label="Minutes"
                        className="bg-transparent outline-none font-medium text-[#141B1A] cursor-pointer"
                      >
                        <option value="">MM</option>
                        {["00", "15", "30", "45"].map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <select
                        name="Time_meridiem"
                        defaultValue=""
                        aria-label="AM or PM"
                        className="ml-auto bg-transparent outline-none font-medium text-[#141B1A] cursor-pointer"
                      >
                        <option value="">--</option>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Field: Requirement */}
                <div className="group relative">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-[#141B1A]/40 group-focus-within:text-[#C56E3D] transition-colors">
                    Project Details
                  </label>
                  <textarea
                    name="MultiLine"
                    rows={3}
                    placeholder="What are you looking to build, and what are your goals?"
                    className="w-full bg-transparent border-b border-[#141B1A]/10 py-3.5 md:py-4 outline-none focus:border-[#C56E3D] transition-all font-medium text-[#141B1A] placeholder:text-[#141B1A]/30 resize-none"
                  />
                </div>

                <InteractiveButton isLoading={isLoading} />

                <p className="flex items-center justify-center gap-2 text-[10px] font-medium text-[#141B1A]/40">
                  <ShieldCheck size={13} className="text-[#C56E3D]" />
                  Your details stay private — no spam, ever.
                </p>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-sm mx-auto"
            >
              <motion.div
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
                className="w-24 h-24 bg-[#C56E3D] rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-[#C56E3D]/30"
              >
                <CheckCircle2 size={48} className="text-white" />
              </motion.div>

              <h2 className="font-[family-name:var(--font-fraunces)] text-5xl font-black text-[#141B1A] mb-6 tracking-tighter">
                Message{" "}
                <span className="italic font-[family-name:var(--font-playfair)] text-[#C56E3D]">
                  sent.
                </span>
              </h2>

              <p className="text-sm text-[#141B1A]/60 font-medium leading-relaxed mb-10">
                Thanks for reaching out. Your message has landed in my inbox —
                I&apos;ll get back to you within 24 hours with the next steps.
              </p>

              <button
                onClick={() => setIsSubmitted(false)}
                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#141B1A] mx-auto group"
              >
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Send another message
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
