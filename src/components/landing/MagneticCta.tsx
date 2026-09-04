"use client";

import type { ReactNode, MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";

type Variant = "solid" | "outline" | "light" | "ghost";

const VARIANT_STYLES: Record<Variant, string> = {
  solid: "bg-[#C56E3D] text-[#141B1A] hover:bg-[#E8E4D9]",
  outline:
    "border-2 border-[#F7F3E9]/30 text-[#F7F3E9] hover:border-[#C56E3D] hover:text-[#C56E3D]",
  light: "bg-[#141B1A] text-[#FFFDF6] hover:bg-[#C56E3D] hover:text-[#141B1A]",
  ghost:
    "border-2 border-[#141B1A] text-[#141B1A] hover:bg-[#141B1A] hover:text-[#FFFDF6]",
};

/** A CTA link with a subtle magnetic cursor pull, used everywhere a section routes back to the lead form. */
export default function MagneticCta({
  href = "#lead-form",
  children,
  variant = "solid",
  className = "",
  icon = true,
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  icon?: boolean;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 300, damping: 20, mass: 0.5 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  const handleMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.94 }}
      className={`group inline-flex items-center gap-3 rounded-full px-8 py-4 transition-colors duration-300 ${VARIANT_STYLES[variant]} ${className}`}
    >
      <span className="text-[11px] font-black uppercase tracking-[0.25em]">{children}</span>
      {icon && (
        <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </motion.a>
  );
}
