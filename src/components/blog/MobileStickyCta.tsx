"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * MobileStickyCta — responsive (below `xl`) sticky "Let's Talk" button.
 *
 * Only renders on screens that don't get the fixed <SideCtaRail /> tabs, and is
 * shown *only while the article content section is in view* — it slides in once
 * the reader enters the body and slides away again over the header / related
 * posts / footer. Visibility is driven by an IntersectionObserver on the
 * content element identified by `targetId`.
 */
export default function MobileStickyCta({ targetId }: { targetId: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [targetId]);

  return (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-300 ease-out xl:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-[140%] opacity-0"
      }`}
    >
      <Link
        href="/contact"
        tabIndex={visible ? 0 : -1}
        className="group pointer-events-auto flex items-center gap-3 rounded-full border border-[#141B1A] bg-[#141B1A] py-2 pl-7 pr-2 text-[#E8E4D9] shadow-[0_14px_34px_-10px_rgba(20,27,26,0.65)]"
      >
        <span className="text-[11px] font-black uppercase tracking-[0.3em]">
          Let&apos;s Talk
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C56E3D] text-[#141B1A]">
          <ArrowUpRight
            size={16}
            className="transition-transform group-hover:rotate-45"
          />
        </span>
      </Link>
    </div>
  );
}
