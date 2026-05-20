"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";

/**
 * Renders an iframe at its design viewport size, then CSS-scales it down to
 * fit the wrapper. This lets us preview a desktop layout (1280×800) inside a
 * smaller container without forcing the embedded site into a tablet/mobile
 * breakpoint, and lets us show a mobile layout (375×812) at native phone size.
 */
function ScaledIframe({
  src,
  title,
  designWidth,
  designHeight,
}: {
  src: string;
  title: string;
  designWidth: number;
  designHeight: number;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const update = () => {
      if (!wrapperRef.current) return;
      setScale(wrapperRef.current.offsetWidth / designWidth);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [designWidth]);

  return (
    <div
      ref={wrapperRef}
      className="relative overflow-hidden bg-white"
      style={{ aspectRatio: `${designWidth} / ${designHeight}` }}
    >
      <iframe
        src={src}
        title={title}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute top-0 left-0 border-0"
        style={{
          width: `${designWidth}px`,
          height: `${designHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: "0 0",
          willChange: "transform",
        }}
      />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#FAFAFA] pointer-events-none">
          <div className="w-7 h-7 rounded-full border-2 border-[#C56E3D] border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  );
}

function OpenInTabPill({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-[#C56E3D] backdrop-blur-md text-white text-[9px] uppercase tracking-[0.3em] font-black opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
    >
      Open
      <ExternalLink size={10} />
    </a>
  );
}

function DesktopPreview({ url, title }: { url: string; title: string }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#0F0F0F] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
      {/* Browser chrome — minimal */}
      <div className="h-9 bg-[#1A1A1A] border-b border-white/5 flex items-center px-4 gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        <div className="flex-1" />
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-black">
          Desktop · 1280
        </span>
      </div>
      <ScaledIframe
        src={url}
        title={`${title} — desktop preview`}
        designWidth={1280}
        designHeight={800}
      />
      <OpenInTabPill url={url} />
    </div>
  );
}

function MobilePreview({ url, title }: { url: string; title: string }) {
  return (
    <div className="group relative mx-auto w-full max-w-[280px]">
      {/* Phone bezel */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-b from-[#1F1F1F] to-[#111111] border border-white/10 p-3 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]">
        {/* Notch */}
        <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-20 h-[18px] rounded-b-2xl bg-black z-10" />
        {/* Screen */}
        <div className="relative rounded-[1.8rem] overflow-hidden bg-white">
          <ScaledIframe
            src={url}
            title={`${title} — responsive preview`}
            designWidth={375}
            designHeight={812}
          />
        </div>
      </div>
      <OpenInTabPill url={url} />
    </div>
  );
}

export default function LivePreview({
  url,
  title,
  fallbackImage,
  fallbackAlt,
}: {
  url: string | null;
  title: string;
  fallbackImage: string;
  fallbackAlt: string;
}) {
  // No live URL → fall back to the cover image so the page still has a visual.
  if (!url) {
    return (
      <section className="px-6 md:px-12 lg:px-24 max-w-[1500px] mx-auto mb-24 md:mb-32">
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-2xl border border-white/5 bg-[#141414]">
          <Image
            src={fallbackImage}
            alt={fallbackAlt}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 md:px-12 lg:px-24 max-w-[1500px] mx-auto mb-24 md:mb-32">
      {/* Mobile / tablet: only the responsive preview, centered.
          Desktop (lg+): desktop preview on the left, responsive on the right. */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 lg:gap-12 items-start">
        <div className="hidden lg:block">
          <DesktopPreview url={url} title={title} />
        </div>
        <div className="lg:pt-6">
          <MobilePreview url={url} title={title} />
        </div>
      </div>

      <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-white/30 font-black text-center lg:text-left">
        Live preview · interact freely · some sites may block embedding
      </p>
    </section>
  );
}
