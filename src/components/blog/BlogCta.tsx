import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * SideCtaRail — slim vertical lead tab flush to a screen edge.
 *
 * Rendered once for the left and once for the right of a page. Only shows on
 * `xl+`, where the page's wide `lg:px-24` gutter leaves clear space at the
 * viewport edges, so the tab never overlaps the content. Below `xl` it is
 * hidden. Deliberately minimal — one label, one small accent arrow — so it
 * reads as an intentional accent, not an ad.
 *
 * `tone` themes the tab to its page: `"dark"` for light backgrounds (the blog),
 * `"accent"` (orange) so it pops on dark backgrounds (the projects page).
 */
export function SideCtaRail({
  side,
  label,
  tone = "dark",
}: {
  side: "left" | "right";
  label: string;
  tone?: "dark" | "accent";
}) {
  const isLeft = side === "left";
  const isAccent = tone === "accent";

  return (
    <aside
      className={`hidden xl:block fixed top-1/2 -translate-y-1/2 z-40 ${
        isLeft ? "left-0" : "right-0"
      }`}
    >
      <Link
        href="/contact"
        aria-label={`${label} — start a project with Snigdha`}
        className={`group flex flex-col items-center gap-3.5 py-5 pl-2 pr-2 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.55)] transition-transform duration-300 ${
          isAccent
            ? "bg-[#C56E3D] text-[#141B1A]"
            : "bg-[#141B1A] text-[#E8E4D9]"
        } ${
          isLeft
            ? "rounded-r-xl hover:translate-x-1"
            : "rounded-l-xl hover:-translate-x-1"
        }`}
      >
        <span className="font-[family-name:var(--font-fraunces)] text-[13px] font-black uppercase tracking-[0.18em] [writing-mode:vertical-rl] rotate-180">
          {label}
        </span>
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full ${
            isAccent
              ? "bg-[#141B1A] text-[#E8E4D9]"
              : "bg-[#C56E3D] text-[#141B1A]"
          }`}
        >
          <ArrowUpRight
            size={13}
            className="transition-transform group-hover:rotate-45"
          />
        </span>
      </Link>
    </aside>
  );
}

/**
 * InlineCtaBanner — full-width editorial lead banner placed in the reading
 * flow (end of the article). Visible on every breakpoint, so mobile and
 * tablet readers — who never see the fixed side rails — still get a CTA.
 */
export function InlineCtaBanner() {
  return (
    <section aria-label="Work with Snigdha" className="my-16 md:my-20">
      <div className="relative overflow-hidden border-2 border-[#141B1A] bg-[#141B1A] p-8 text-[#E8E4D9] md:p-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#C56E3D]/20 blur-[100px]" />

        <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xl">
            <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.4em] text-[#C56E3D]">
              Let&apos;s Work Together
            </span>
            <h3 className="font-[family-name:var(--font-fraunces)] text-3xl font-black uppercase leading-[0.95] tracking-tighter md:text-5xl">
              Want a website that actually{" "}
              <span className="font-[family-name:var(--font-playfair)] italic lowercase text-[#C56E3D]">
                ranks &amp; converts?
              </span>
            </h3>
            <p className="mt-5 text-sm font-medium tracking-wide text-[#E8E4D9]/60">
              Book a free 30-minute strategy call. No pitch — just a clear plan
              for your traffic, design, and conversions.
            </p>
          </div>

          <Link
            href="/contact"
            className="group inline-flex shrink-0 items-center gap-4 rounded-full bg-[#C56E3D] px-8 py-5 text-[#141B1A] transition-all duration-300 hover:bg-[#E8E4D9]"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Book a Free Call
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#141B1A] text-[#E8E4D9] transition-transform group-hover:rotate-45">
              <ArrowUpRight size={16} />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
