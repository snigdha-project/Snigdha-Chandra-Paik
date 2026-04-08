"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFacebookF, 
  faInstagram, 
  faGithub, 
  faWhatsapp 
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

export default function Footer() {
  const socials = [
    { icon: faFacebookF, link: "https://www.facebook.com/snigdha.chandra.paik" },
    { icon: faInstagram, link: "https://www.instagram.com/snigdha_chandra_paik/" },
    { icon: faGithub, link: "https://github.com/snigdha-project" },
    { icon: faWhatsapp, link: "https://wa.me/918391879168" },
  ];

  return (
    <footer className="bg-[#141B1A] text-[#F7F3E9] px-6 md:px-16 py-24 mt-20 border-t border-[#F7F3E9]/5">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid: Added items-center to keep middle columns from touching the top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 items-start md:items-center">
          
          {/* Column 1: Identity */}
          <div className="flex flex-col gap-6">
            <a href="/" className="group inline-block">
              <span className="font-[family-name:var(--font-signature)] text-4xl text-[#C58473] group-hover:text-[#F7F3E9] transition-all duration-700">
                Snigdha Chandra Paik
              </span>
              <div className="h-[1px] w-0 bg-[#C58473] group-hover:w-full transition-all duration-700 mt-2 opacity-30" />
            </a>
            <p className="text-[9px] uppercase tracking-[0.4em] text-[#F7F3E9]/40 leading-relaxed font-bold">
              Architecting Digital <br /> Ecosystems & SEO
            </p>
          </div>

          {/* Column 2: Inquiries (Centered vertically) */}
          <div className="flex flex-col gap-6">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#F7F3E9]/20 font-bold">Inquiries</p>
            <div className="flex flex-col gap-5">
              <a href="mailto:snigdhachandrapaik@gmail.com" className="group flex items-center gap-4 text-sm hover:text-[#C58473] transition-all duration-500">
                <div className="w-9 h-9 rounded-full border border-[#F7F3E9]/10 flex items-center justify-center group-hover:border-[#C58473]/50 transition-colors">
                  <FontAwesomeIcon icon={faEnvelope} className="text-[#C58473] text-xs" />
                </div>
                <span className="tracking-wide opacity-70 group-hover:opacity-100">Email Me</span>
              </a>
              <a href="tel:+918391879168" className="group flex items-center gap-4 text-sm hover:text-[#C58473] transition-all duration-500">
                <div className="w-9 h-9 rounded-full border border-[#F7F3E9]/10 flex items-center justify-center group-hover:border-[#C58473]/50 transition-colors">
                  <FontAwesomeIcon icon={faPhone} className="text-[#C58473] text-xs" />
                </div>
                <span className="tracking-wide opacity-70 group-hover:opacity-100">+91 8391879168</span>
              </a>
            </div>
          </div>

          {/* Column 3: Studio / Location (Centered vertically) */}
          <div className="flex flex-col gap-6">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#F7F3E9]/20 font-bold">Studio</p>
            <p className="text-sm leading-relaxed opacity-60 font-light tracking-wide">
              South 24 Parganas, <br /> 
              West Bengal, India <br /> 
              <span className="text-[#C58473]/80">743395</span>
            </p>
          </div>

          {/* Column 4: Socials */}
          <div className="flex flex-col gap-6 md:items-end">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#F7F3E9]/20 font-bold">Social Presence</p>
            <div className="flex gap-4">
              {socials.map((social, i) => (
                <motion.a 
                  key={i} 
                  href={social.link} 
                  target="_blank" 
                  whileHover={{ y: -4, scale: 1.05 }}
                  className="relative w-11 h-11 flex items-center justify-center rounded-full border border-[#F7F3E9]/10 hover:border-[#C58473] text-[#F7F3E9]/60 hover:text-[#C58473] transition-all duration-500 group"
                >
                  <div className="absolute inset-0 rounded-full bg-[#C58473] opacity-0 group-hover:opacity-10 blur-md transition-opacity" />
                  <FontAwesomeIcon icon={social.icon} className="text-base relative z-10" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-20 pt-8 border-t border-[#F7F3E9]/5 flex justify-center text-[8px] uppercase tracking-[0.5em] text-[#F7F3E9]/20">
          <p>© 2026 SNIGDHA CHANDRA PAIK — CURATED EXPERIENCE</p>
        </div>
      </div>
    </footer>
  );
}