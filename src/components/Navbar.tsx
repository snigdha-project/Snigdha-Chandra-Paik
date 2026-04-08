"use client";

import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Menu, X } from "lucide-react";

// 1. Define the interface to handle optional properties
interface NavLink {
  name: string;
  href: string;
  special?: boolean; // The '?' makes it optional
}

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
        <a
          href="/"
          className="flex flex-col cursor-pointer group text-[#141B1A] justify-self-start relative"
        >
          <span className="font-[family-name:var(--font-signature)] text-2xl md:text-3xl leading-none block transition-colors duration-500 group-hover:text-[#A64D32]">
            Snigdha Chandra Paik
          </span>
          <motion.div className="absolute -bottom-1 left-0 h-[1px] bg-[#A64D32] w-0 group-hover:w-full transition-all duration-500" />
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-10 justify-self-center items-center text-[10px] font-black uppercase tracking-[0.2em] text-[#141B1A]">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="relative group py-1">
              {link.name}
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#A64D32] origin-right scale-x-0 transition-transform duration-500 group-hover:scale-x-100 group-hover:origin-left" />
            </a>
          ))}
        </div>

        {/* Contact & Mobile Toggle */}
        <div className="flex items-center justify-self-end gap-6">
          <a
            href="/contact"
            className="hidden md:block px-5 py-2.5 bg-[#A64D32] text-[#F7F3E9] font-[family-name:var(--font-fraunces)] font-bold text-base lowercase italic rounded-sm shadow-[3px_3px_0px_#141B1A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-300"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
