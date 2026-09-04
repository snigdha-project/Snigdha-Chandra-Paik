"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MagneticCta from "./MagneticCta";

/** Floating CTA that appears once the visitor scrolls past the hero and hides again near the footer. */
export default function StickyLeadCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolledPastHero = window.scrollY > 760;
      const nearFooter =
        window.scrollY + window.innerHeight > document.body.scrollHeight - 700;
      setVisible(scrolledPastHero && !nearFooter);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-5 z-40 md:bottom-7 md:right-7"
        >
          <MagneticCta variant="solid" className="shadow-2xl shadow-black/20">
            Free Proposal
          </MagneticCta>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
