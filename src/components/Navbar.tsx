"use client";

import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import Link from "next/link";

// 1. Define the interface to handle optional properties
interface NavLink {
  name: string;
  href: string;
  special?: boolean; // The '?' makes it optional
}

const CV_URL = "/CV/Snigdha_Chandra_Paik_Resume.pdf";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // 2. Explicitly type the array
  const navLinks: NavLink[] = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Blogs", href: "/blogs" },
  ];

  return (
    <>
      <motion.nav
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 left-0 right-0 z-[1000] grid grid-cols-2 md:grid-cols-3 items-center px-6 md:px-16 py-4 bg-[#F7F3E9] backdrop-blur-md border-b border-[#141B1A]/10"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex flex-col cursor-pointer group text-[#141B1A] justify-self-start relative"
        >
          <span className="font-[family-name:var(--font-signature)] text-2xl md:text-3xl leading-none block transition-colors duration-500 group-hover:text-[#A64D32]">
            Snigdha Chandra Paik
          </span>
          <motion.div className="absolute -bottom-1 left-0 h-[1px] bg-[#A64D32] w-0 group-hover:w-full transition-all duration-500" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-10 justify-self-center items-center text-[10px] font-black uppercase tracking-[0.2em] text-[#141B1A]">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="relative group py-1">
              {link.name}
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#A64D32] origin-right scale-x-0 transition-transform duration-500 group-hover:scale-x-100 group-hover:origin-left" />
            </a>
          ))}
        </div>

        {/* CV, Contact & Mobile Toggle */}
        <div className="flex items-center justify-self-end gap-3 lg:gap-4">
          <motion.a
            href={CV_URL}
            download
            aria-label="Download CV"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.94, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 16 }}
            className="group relative hidden md:flex h-11 items-center gap-2 overflow-hidden rounded-sm bg-[#141B1A] px-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#F7F3E9] shadow-[3px_3px_0px_#C56E3D] transition-shadow duration-300 hover:shadow-[6px_6px_0px_#C56E3D]"
          >
            {/* black fill that sweeps across on hover */}
            <span className="pointer-events-none absolute inset-0 z-0 -translate-x-[105%] bg-black transition-transform duration-300 ease-out group-hover:translate-x-0" />
            {/* endlessly nudging download icon (orange accent stays) */}
            <motion.span
              animate={{ y: [0, 2.5, 0] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 text-[#C56E3D]"
            >
              <Download size={13} strokeWidth={2.75} />
            </motion.span>
            <span className="relative z-10">
              <span className="hidden lg:inline">Download </span>CV
            </span>
          </motion.a>

          <a
            href="/contact"
            className="hidden md:flex h-11 items-center justify-center px-5 bg-[#A64D32] text-[#F7F3E9] font-[family-name:var(--font-fraunces)] font-bold text-base lowercase italic rounded-sm shadow-[3px_3px_0px_#141B1A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-300"
          >
            Contact
          </a>

          {!isOpen && (
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-1 transition-transform active:scale-90"
            >
              <Menu size={28} color="#141B1A" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at 90% 5%)" }}
            animate={{ clipPath: "circle(150% at 90% 5%)" }}
            exit={{ clipPath: "circle(0% at 90% 5%)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[10000] bg-[#141B1A] flex flex-col justify-center items-center"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-7 right-6 p-2 text-[#F7F3E9] hover:text-[#A64D32] transition-colors"
            >
              <X size={32} strokeWidth={1.5} />
            </button>

            <div className="flex flex-col gap-8 text-center">
              {[
                ...navLinks,
                { name: "Contact", href: "/contact", special: true },
              ].map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  onClick={() => setIsOpen(false)}
                  className={`text-[#F7F3E9] no-underline ${
                    link.special
                      ? "font-[family-name:var(--font-playfair)] text-5xl italic text-[#A64D32]"
                      : "font-[family-name:var(--font-fraunces)] text-4xl font-black uppercase tracking-tighter"
                  } hover:text-[#A64D32] transition-colors`}
                >
                  {link.name}
                </motion.a>
              ))}

              <motion.a
                href={CV_URL}
                download
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (navLinks.length + 1) * 0.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(false)}
                className="group mt-6 inline-flex items-center gap-3 self-center rounded-sm border-2 border-[#C58473] px-7 py-3 text-[#F7F3E9] font-[family-name:var(--font-fraunces)] text-2xl font-black uppercase tracking-tight shadow-[4px_4px_0px_#C58473] transition-all duration-300 hover:-translate-y-1 hover:bg-[#C58473] hover:text-[#141B1A] hover:shadow-[6px_6px_0px_#F7F3E9]/20"
              >
                <motion.span
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Download size={20} />
                </motion.span>
                Download CV
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
