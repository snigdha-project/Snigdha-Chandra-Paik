"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Send, CheckCircle2, ArrowLeft, ShieldCheck, Check } from "lucide-react";

function InteractiveButton({ isLoading }: { isLoading: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 400, damping: 20, mass: 0.5 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
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
          <Send size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      )}
    </motion.button>
  );
}

/**
 * Shared Zoho "Leads form" embed. The `name` attributes on every field are
 * dictated by the Zoho form definition. Changing or removing them silently
 * breaks record submission, so they must stay exactly as provided.
 */
export default function LeadForm({
  sourceLabel,
  heading,
  subheading,
}: {
  sourceLabel: string;
  heading: string;
  subheading: string;
}) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await fetch(e.currentTarget.action, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });
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
    <div className="w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-8 md:mb-10">
              <h2 className="font-[family-name:var(--font-fraunces)] text-3xl sm:text-4xl md:text-5xl font-black text-[#141B1A] tracking-tight mb-4">
                {heading}
              </h2>
              <p className="text-sm text-[#141B1A]/50 font-medium tracking-wide leading-relaxed">
                {subheading}
              </p>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                {["Free consultation", "24-hour reply", "No obligation"].map((item) => (
                  <span key={item} className="flex items-center gap-1.5 text-[11px] font-bold text-[#141B1A]/60">
                    <Check size={13} className="text-[#C56E3D]" strokeWidth={3} />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <form
              action="https://forms.zohopublic.com/snigdhachandrapaikgm1/form/Leadsform/formperma/Id5-cxm7zfDvy-on4d1WrrZR2FoQ_CBYaUq7cmnkohk/htmlRecords/submit"
              method="POST"
              encType="multipart/form-data"
              acceptCharset="UTF-8"
              onSubmit={handleSubmit}
              className="space-y-7 md:space-y-8"
            >
              {/* Zoho tracking (hidden): referrer name records which landing page the lead came from */}
              <input type="hidden" name="zf_referrer_name" defaultValue={sourceLabel} />
              <input type="hidden" name="zf_redirect_url" defaultValue="" />
              <input type="hidden" name="zc_gad" defaultValue="" />

              <div className="group relative">
                <label className="text-[10px] uppercase tracking-[0.4em] font-black text-[#141B1A]/40 group-focus-within:text-[#C56E3D] transition-colors">
                  Name
                </label>
                <input
                  type="text"
                  name="SingleLine"
                  required
                  maxLength={255}
                  placeholder="Your name"
                  className="w-full bg-transparent border-b border-[#141B1A]/10 py-3.5 md:py-4 outline-none focus:border-[#C56E3D] transition-all font-medium text-[#141B1A] placeholder:text-[#141B1A]/30"
                />
              </div>

              <div className="group relative">
                <label className="text-[10px] uppercase tracking-[0.4em] font-black text-[#141B1A]/40 group-focus-within:text-[#C56E3D] transition-colors">
                  Email
                </label>
                <input
                  type="email"
                  name="Email"
                  required
                  maxLength={255}
                  placeholder="hello@example.com"
                  className="w-full bg-transparent border-b border-[#141B1A]/10 py-3.5 md:py-4 outline-none focus:border-[#C56E3D] transition-all font-medium text-[#141B1A] placeholder:text-[#141B1A]/30"
                />
              </div>

              <div className="group relative">
                <label className="text-[10px] uppercase tracking-[0.4em] font-black text-[#141B1A]/40 group-focus-within:text-[#C56E3D] transition-colors">
                  Phone{" "}
                  <span className="text-[#141B1A]/25 normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  name="PhoneNumber_countrycode"
                  maxLength={20}
                  placeholder="+1 555 000 0000"
                  className="w-full bg-transparent border-b border-[#141B1A]/10 py-3.5 md:py-4 outline-none focus:border-[#C56E3D] transition-all font-medium text-[#141B1A] placeholder:text-[#141B1A]/30"
                />
              </div>

              <div className="group relative">
                <label className="text-[10px] uppercase tracking-[0.4em] font-black text-[#141B1A]/40 group-focus-within:text-[#C56E3D] transition-colors">
                  Tell me your idea
                </label>
                <textarea
                  name="MultiLine"
                  required
                  rows={3}
                  maxLength={65535}
                  placeholder="What are you looking to build, and what are your goals?"
                  className="w-full bg-transparent border-b border-[#141B1A]/10 py-3.5 md:py-4 outline-none focus:border-[#C56E3D] transition-all font-medium text-[#141B1A] placeholder:text-[#141B1A]/30 resize-none"
                />
              </div>

              <InteractiveButton isLoading={isLoading} />

              <p className="flex items-center justify-center gap-2 text-[10px] font-medium text-[#141B1A]/40">
                <ShieldCheck size={13} className="text-[#C56E3D]" />
                Your details stay private. No spam, ever.
              </p>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-sm mx-auto py-10"
          >
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
              className="w-24 h-24 bg-[#C56E3D] rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-[#C56E3D]/30"
            >
              <CheckCircle2 size={48} className="text-white" />
            </motion.div>
            <h2 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-5xl font-black text-[#141B1A] mb-6 tracking-tighter">
              Message{" "}
              <span className="italic font-[family-name:var(--font-playfair)] text-[#C56E3D]">
                sent.
              </span>
            </h2>
            <p className="text-sm text-[#141B1A]/60 font-medium leading-relaxed mb-10">
              Thanks for reaching out. Your message has landed in my inbox, and I&apos;ll get back to you within 24 hours with the next steps.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#141B1A] mx-auto group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Send another message
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
