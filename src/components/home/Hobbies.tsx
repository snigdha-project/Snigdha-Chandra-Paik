"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const hobbyData = [
  {
    title: "Gardening",
    desc: "Plants can talk. They are honest and loyal. They don't cheat me like humans.",
    img: "/hobbies/Garden.png",
    rotate: "-5deg",
    pos: "md:top-0 md:left-0",
  },
  {
    title: "Aquarium",
    desc: "Nature understands emotion. Oscars and Discus are my peace. Fish understand us.",
    img: "/hobbies/Aquarium.png",
    rotate: "3deg",
    pos: "md:top-12 md:left-[35%]",
  },
  {
    title: "Pet Caring",
    desc: "Bunnies, dogs, monkeys. I feed every animal. Animals are far better than humans.",
    img: "/hobbies/animal.png",
    rotate: "-4deg",
    pos: "md:top-6 md:left-[62%]",
  },
  {
    title: "Writing",
    desc: "My therapy. Story, poems, and thoughts. I'm not a good writer, but it's mine.",
    img: "/hobbies/writing.png",
    rotate: "6deg",
    pos: "md:top-[45%] md:left-[5%]",
  },
  {
    title: "Listening Music",
    desc: "Love and sad songs for solitude, or dancing mode with friends. Night energy.",
    img: "/hobbies/music.png",
    rotate: "-3deg",
    pos: "md:top-[55%] md:left-[38%]",
  },
  {
    title: "Motivate People",
    desc: "My underrated hobby. Always trying to push others forward and give strength.",
    img: "/hobbies/motivation.png",
    rotate: "4deg",
    pos: "md:top-[50%] md:left-[66%]",
  },
];

function HobbyCard({
  item,
  index,
}: {
  item: (typeof hobbyData)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0, rotate: item.rotate }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 40, delay: index * 0.05 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.05, zIndex: 60, rotate: "0deg" }}
      // Card width increased to 450px
      className="relative w-full md:w-[450px] bg-white p-6 pb-20 shadow-2xl border border-[#141B1A]/5 rounded-sm cursor-grab active:cursor-grabbing group transition-shadow duration-500 hover:shadow-[0_60px_120px_rgba(0,0,0,0.2)]"
    >
      <div
        style={{ transform: "translateZ(70px)" }}
        className="relative aspect-square overflow-hidden bg-[#F7F3E9] mb-10 shadow-inner pointer-events-none"
      >
        <Image
          src={item.img}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 450px"
        />
      </div>

      <div
        style={{ transform: "translateZ(50px)" }}
        className="space-y-5 px-2 pointer-events-none"
      >
        <h3 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-5xl font-black text-[#141B1A] tracking-tighter italic leading-none">
          {item.title}
        </h3>
        <p className="text-sm md:text-base leading-relaxed font-semibold text-[#141B1A]/50 italic">
          "{item.desc}"
        </p>
      </div>

      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-14 bg-[#A64D32]/10 backdrop-blur-md -rotate-2 pointer-events-none" />
    </motion.div>
  );
}

export default function Hobbies() {
  return (
    <section className="bg-[#F7F3E9] py-32 px-6 md:px-16 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.01] pointer-events-none select-none">
        <h2 className="text-[30vw] font-black uppercase leading-none text-center">
          CORE
          <br />
          VIBE
        </h2>
      </div>

      <div className="max-w-[1600px] mx-auto relative">
        <div className="mb-24 md:mb-40">
          <span className="text-[10px] uppercase tracking-[1em] text-[#A64D32] font-black block mb-4">
            Lifestyle
          </span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-6xl md:text-[11rem] text-[#141B1A] leading-[0.8] font-black tracking-tighter">
            Beyond the{" "}
            <span className="font-[family-name:var(--font-playfair)] italic text-[#C56E3D]">
              Logic.
            </span>
          </h2>
        </div>

        {/* Height expanded to accommodate larger cards */}
        <div className="relative md:h-[1200px] grid grid-cols-1 md:block gap-24 md:gap-0">
          {hobbyData.map((item, i) => (
            <div key={i} className={`md:absolute ${item.pos} w-full md:w-auto`}>
              <HobbyCard item={item} index={i} />
            </div>
          ))}
        </div>

        <div className="mt-48 border-t border-[#141B1A]/10 pt-16 text-center">
          <p className="text-[9px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[1.5em] font-black text-[#141B1A] opacity-20 px-4 leading-relaxed">
            " Animals are far better than humans "
          </p>
        </div>
      </div>
    </section>
  );
}
