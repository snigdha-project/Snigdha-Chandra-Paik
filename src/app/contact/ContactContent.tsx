"use client";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Mail, MapPin, Send, CheckCircle2, ArrowLeft } from "lucide-react";
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
      className="w-full bg-[#141B1A] text-white py-6 rounded-full flex items-center justify-center gap-5 group relative overflow-hidden transition-all duration-300 hover:bg-[#C56E3D] disabled:opacity-50"
    >
      <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.5em]">
        {isLoading ? "Sending..." : "Send Message"}
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

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

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
    <main className="min-h-screen bg-[#FFFDF6] flex flex-col md:flex-row pt-16 md:pt-20">
      {/* LEFT SIDE: BRANDING & CONTACT INFO */}
      <section className="w-full md:w-1/2 bg-[#141B1A] p-10 md:p-24 flex flex-col justify-between relative overflow-hidden min-h-[45vh] md:min-h-screen">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#C56E3D]/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[10px] uppercase tracking-[1.2em] text-[#C56E3D] font-black block mb-8"
          >
            Connectivity
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-[family-name:var(--font-fraunces)] text-6xl md:text-[10rem] text-white font-black tracking-tighter leading-[0.8]"
          >
            Start a <br /> new <br />{" "}
            <span className="italic font-[family-name:var(--font-playfair)] text-[#C56E3D]">
              Chapter.
            </span>
          </motion.h1>
        </div>

        <div className="relative z-10 space-y-6 md:space-y-8 mt-12 md:mt-0 pb-10 md:pb-0">
          <div className="flex items-center gap-5 text-white/50 hover:text-white transition-colors cursor-default">
            <Mail size={18} className="text-[#C56E3D]" />
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] break-all select-all">
              snigdhachandrapaik@gmail.com
            </span>
          </div>
          <div className="flex items-center gap-5 text-white/50 hover:text-white transition-colors cursor-default">
            <MapPin size={18} className="text-[#C56E3D]" />
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] select-all">
              Kolkata, West Bengal
            </span>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE: INTERACTIVE FORM & THANK YOU */}
      <section className="w-full md:w-1/2 p-8 md:p-24 flex flex-col justify-center bg-[#FFFDF6] relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="w-full max-w-lg mx-auto py-10 md:py-0"
            >
              <div className="mb-12 md:mb-16">
                <h2 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-5xl font-black text-[#141B1A] tracking-tight mb-4">
                  Drop a message
                </h2>
                <p className="text-sm text-[#141B1A]/40 font-medium tracking-wide">
                  I usually respond within 24 hours. Night owl schedule active.
                </p>
              </div>

              <form
                action="https://forms.zohopublic.com/snigdhachandrapaikgm1/form/Myportfolioform/formperma/IB3-35pXnyBMrjVB84lM1ebg9pXSzOaQvb3kdBbyMMU/htmlRecords/submit"
                method="POST"
                onSubmit={handleSubmit}
                className="space-y-10 md:space-y-12"
              >
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
                    className="w-full bg-transparent border-b border-[#141B1A]/10 py-4 md:py-5 outline-none focus:border-[#C56E3D] transition-all font-medium text-[#141B1A] placeholder:text-[#141B1A]/30"
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
                    className="w-full bg-transparent border-b border-[#141B1A]/10 py-4 md:py-5 outline-none focus:border-[#C56E3D] transition-all font-medium text-[#141B1A] placeholder:text-[#141B1A]/30"
                  />
                </div>

                {/* Field: Message */}
                <div className="group relative">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-[#141B1A]/40 group-focus-within:text-[#C56E3D] transition-colors">
                    Your Message
                  </label>
                  <textarea
                    name="MultiLine"
                    rows={4}
                    placeholder="Tell me about your goals..."
                    className="w-full bg-transparent border-b border-[#141B1A]/10 py-4 md:py-5 outline-none focus:border-[#C56E3D] transition-all font-medium text-[#141B1A] placeholder:text-[#141B1A]/30 resize-none"
                  />
                </div>

                <InteractiveButton isLoading={isLoading} />
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
                Deep{" "}
                <span className="italic font-[family-name:var(--font-playfair)] text-[#C56E3D]">
                  Gratitude.
                </span>
              </h2>

              <p className="text-sm text-[#141B1A]/60 font-medium leading-relaxed mb-10">
                Your message has successfully transitioned beyond the logic.
                Expect a response during my next nocturnal session.
              </p>

              <button
                onClick={() => setIsSubmitted(false)}
                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#141B1A] mx-auto group"
              >
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Back to Form
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
