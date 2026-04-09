"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { Leaf } from "lucide-react";

const hobbyData = [
  {
    title: "Gardening",
    desc: "A conversation with nature. In every bloom, I find the loyalty and pure honesty of the earth.",
    img: "/hobbies/Garden.png",
    rotate: -5,
    align: "justify-start",
  },
  {
    title: "Aquarium",
    desc: "My underwater sanctuary. Watching my Oscars is a silent meditation that brings peace.",
    img: "/hobbies/Aquarium.png",
    rotate: 3,
    align: "justify-center",
  },
  {
    title: "Pet Caring",
    desc: "Kindness in its purest form. Animals teach us how to love without conditions or boundaries.",
    img: "/hobbies/animal.png",
    rotate: -3,
    align: "justify-end",
  },
  {
    title: "Writing",
    desc: "Ink and soul. Every poem is a step toward discovery and a way to turn thoughts into art.",
    img: "/hobbies/writing.png",
    rotate: 4,
    align: "justify-start",
  },
  {
    title: "Listening Music",
    desc: "The rhythm of life. Whether soulful or high energy, music is the fuel for my fire.",
    img: "/hobbies/music.png",
    rotate: -4,
    align: "justify-center",
  },
  {
    title: "Motivate People",
    desc: "Spreading the light. There is a special kind of strength found in lifting others up.",
    img: "/hobbies/motivation.png",
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
    <div
      className={`flex w-full ${item.align} mb-28 md:mb-40 last:mb-0 relative`}
    >
      {/* 🌪️ WIND LAYER: This div ONLY handles the constant swaying loop */}
      <motion.div
        animate={{
          rotateZ: [item.rotate - 1.5, item.rotate + 1.5, item.rotate - 1.5],
          x: [0, 15, 0],
        }}
        transition={{
          rotateZ: { repeat: Infinity, duration: 5 + index, ease: "easeInOut" },
          x: { repeat: Infinity, duration: 6 + index, ease: "easeInOut" },
        }}
        className="w-full md:w-fit flex justify-center sticky top-24 md:top-auto"
        style={{ zIndex: isHovered ? 100 : index }}
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
            filter: isSomeoneElseHovered
              ? "blur(4px) grayscale(0.3)"
              : "blur(0px) grayscale(0)",
          }}
          animate={{
            scale: isHovered ? 1.05 : 1,
            opacity: isSomeoneElseHovered ? 0.4 : 1,
          }}
          whileHover={{ rotateZ: 0 }} // Straightens on hover
          className="w-full md:w-[480px] bg-white p-6 pb-20 shadow-2xl border border-[#141B1A]/5 rounded-sm cursor-grab active:cursor-grabbing group transition-all duration-500"
        >
          {/* Image */}
          <div
            style={{ transform: "translateZ(80px)" }}
            className="relative aspect-square overflow-hidden bg-[#F7F3E9] mb-10 pointer-events-none shadow-inner"
          >
            <Image
              src={item.img}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 480px"
            />
          </div>

          <div
            style={{ transform: "translateZ(50px)" }}
            className="space-y-4 px-2 pointer-events-none text-[#141B1A]"
          >
            <h3 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-5xl font-black tracking-tighter italic leading-none">
              {item.title}
            </h3>
            <p className="text-sm md:text-base leading-relaxed font-semibold opacity-50 italic">
              {item.desc}
            </p>
          </div>

          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-28 h-12 bg-[#A64D32]/15 backdrop-blur-md -rotate-2 pointer-events-none" />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Hobbies() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // 🍃 Increased Leaf Density for the "Forest/Green" theme
  const backgroundLeaves = [
    {
      delay: 0,
      top: "10%",
      left: "85%",
      rotate: "15deg",
      scale: 1.1,
      blur: "blur-md",
    },
    {
      delay: 2,
      top: "25%",
      left: "5%",
      rotate: "-30deg",
      scale: 1.6,
      blur: "blur-2xl",
    },
    {
      delay: 4,
      top: "45%",
      left: "75%",
      rotate: "60deg",
      scale: 1.3,
      blur: "blur-xl",
    },
    {
      delay: 1,
      top: "65%",
      left: "15%",
      rotate: "100deg",
      scale: 1.5,
      blur: "blur-3xl",
    },
    {
      delay: 6,
      top: "85%",
      left: "90%",
      rotate: "-90deg",
      scale: 1.2,
      blur: "blur-sm",
    },
    {
      delay: 3,
      top: "15%",
      left: "35%",
      rotate: "120deg",
      scale: 1.4,
      blur: "blur-lg",
    },
  ];

  return (
    <section
      className="bg-[#FFFDF6] py-24 md:py-32 px-6 md:px-16 relative overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle at center, #FFF9E9 0%, #FFFDFA 75%)",
      }}
    >
      {/* Green Leaves Layer */}
      {backgroundLeaves.map((leaf, i) => (
        <motion.div
          key={`leaf-${i}`}
          animate={{
            opacity: [0.0, 0.15, 0.0],
            y: ["0%", "200%", "0%"],
            x: ["0px", "40px", "-20px"],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            delay: leaf.delay,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: leaf.top,
            left: leaf.left,
            color: "#141B1A",
            scale: leaf.scale,
            filter: leaf.blur,
            pointerEvents: "none",
          }}
        >
          <Leaf size={64} fill="#141B1A" />
        </motion.div>
      ))}

      {/* Sun Dust Particles */}
      {[0, 3, 6].map((delay, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0, 0.2, 0], x: ["0px", "30px", "0px"] }}
          transition={{
            repeat: Infinity,
            duration: 12,
            delay,
            ease: "easeInOut",
          }}
          className="absolute w-16 h-16 bg-white rounded-full blur-3xl"
          style={{
            top: `${20 + i * 30}%`,
            left: `${10 + i * 35}%`,
            pointerEvents: "none",
          }}
        />
      ))}

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

        <div className="relative flex flex-col w-full pb-20">
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
