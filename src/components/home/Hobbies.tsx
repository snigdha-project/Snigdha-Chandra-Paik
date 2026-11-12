"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import LazyOnView from "../LazyOnView";

const FallingLeaves = dynamic(() => import("./FallingLeaves"), { ssr: false });

const hobbyData = [
  {
    title: "Gardening",
    desc: "A conversation with nature. In every bloom, I find the loyalty and pure honesty of the earth.",
    img: "/hobbies/Garden.webp",
    rotate: -5,
    align: "justify-start",
  },
  {
    title: "Aquarium",
    desc: "My underwater sanctuary. Watching my Oscars is a silent meditation that brings peace.",
    img: "/hobbies/Aquarium.webp",
    rotate: 3,
    align: "justify-center",
  },
  {
    title: "Pet Caring",
    desc: "Kindness in its purest form. Animals teach us how to love without conditions or boundaries.",
    img: "/hobbies/animal.webp",
    rotate: -3,
    align: "justify-end",
  },
  {
    title: "Writing",
    desc: "Ink and soul. Every poem is a step toward discovery and a way to turn thoughts into art.",
    img: "/hobbies/writing.webp",
    rotate: 4,
    align: "justify-start",
  },
  {
    title: "Listening Music",
    desc: "The rhythm of life. Whether soulful or high energy, music is the fuel for my fire.",
    img: "/hobbies/music.webp",
    rotate: -4,
    align: "justify-center",
  },
  {
    title: "Motivate People",
    desc: "Spreading the light. There is a special kind of strength found in lifting others up.",
    img: "/hobbies/motivation.webp",
    rotate: 2,
    align: "justify-end",
  },
];

function HobbyCard({ item, index, activeIndex, setActiveIndex }: any) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const isHovered = activeIndex === index;
  const isSomeoneElseHovered = activeIndex !== null && activeIndex !== index;

  return (
    <div className="flex w-full relative">
      {/* 🌪️ WIND LAYER: This div ONLY handles the constant swaying loop */}
      <div
        className="w-full flex justify-center hobby-sway"
        style={
          {
            zIndex: isHovered ? 100 : index,
            "--r": `${item.rotate}deg`,
            animationDuration: `${5 + index}s`,
          } as React.CSSProperties
        }
      >
        {/* ✨ INTERACTIVE LAYER: This handles Tilt, Scale, and Focus Blur */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setActiveIndex(index)}
          onMouseLeave={() => {
            setActiveIndex(null);
            x.set(0);
            y.set(0);
          }}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          animate={{
            scale: isHovered ? 1.05 : 1,
            opacity: isSomeoneElseHovered ? 0.4 : 1,
          }}
          whileHover={{ rotateZ: 0 }} // Straightens on hover
          className="w-full bg-white p-4 pb-12 md:p-5 md:pb-14 shadow-2xl border border-[#141B1A]/5 rounded-sm cursor-grab active:cursor-grabbing group transition-all duration-500"
        >
          {/* Image */}
          <div
            style={{ transform: "translateZ(80px)" }}
            className="relative aspect-square overflow-hidden bg-[#F7F3E9] mb-6 pointer-events-none shadow-inner"
          >
            <Image
              src={item.img}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>

          <div
            style={{ transform: "translateZ(50px)" }}
            className="space-y-3 px-1 pointer-events-none text-[#141B1A]"
          >
            <h3 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-3xl lg:text-4xl font-black tracking-tighter italic leading-none">
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed font-semibold opacity-50 italic">
              {item.desc}
            </p>
          </div>

          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-28 h-12 bg-[#A64D32]/15 backdrop-blur-md -rotate-2 pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
}

export default function Hobbies() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section
      className="bg-[#FFFDF6] py-24 md:py-32 px-6 md:px-16 relative overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle at center, #FFF9E9 0%, #FFFDFA 75%)",
      }}
    >
      {/* Falling leaves (tsparticles) */}
      <LazyOnView
        className="absolute inset-0 z-0 pointer-events-none"
        rootMargin="0px"
      >
        <FallingLeaves />
      </LazyOnView>

      <div className="max-w-[1500px] mx-auto relative z-10">
        <div className="mb-20 md:mb-32">
          <span className="text-[10px] uppercase tracking-[1em] text-[#A64D32] font-black block mb-4">
            Lifestyle
          </span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-6xl md:text-[9rem] text-[#141B1A] leading-[0.8] font-black tracking-tighter">
            Beyond the{" "}
            <span className="font-[family-name:var(--font-playfair)] italic text-[#C56E3D]">
              Logic.
            </span>
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 md:gap-y-16 w-full pb-20 pt-4">
          {hobbyData.map((item, i) => (
            <HobbyCard
              key={i}
              item={item}
              index={i}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          ))}
        </div>

        <div className="border-t border-[#141B1A]/10 pt-16 text-center">
          <p className="text-[10px] md:text-[12px] uppercase tracking-[0.5em] md:tracking-[1.2em] font-black text-[#141B1A] opacity-20 px-4 leading-relaxed">
            Kind to Nature, Loyal to Life
          </p>
        </div>
      </div>
    </section>
  );
}
