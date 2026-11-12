"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Loader2, Newspaper, Search, X } from "lucide-react";
// 1. Updated Import: Pointing to local JSON service
import { getLocalPosts } from "@/lib/blogService";
import { buildSearchIndex, searchIndex } from "@/lib/blogSearch";

/**
 * Helper to clean HTML entities
 * Since we are using local JSON, we can write clean text,
 * but this remains for safety if you paste HTML into your JSON.
 */
const decodeHTML = (html: string) => {
  if (typeof window === "undefined") return html;
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

export default function BlogPage({ initialPosts }: { initialPosts: any[] }) {
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  // Search: the full list is fetched once, the first time the user focuses
  // or types in the search box (the page itself still paginates 3 at a time).
  const [query, setQuery] = useState("");
  const [allPosts, setAllPosts] = useState<any[] | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const ensureAllPosts = useCallback(async () => {
    if (allPosts || isSearchLoading) return;
    setIsSearchLoading(true);
    try {
      setAllPosts(await getLocalPosts(200, 0));
    } catch {
      setAllPosts([]);
    } finally {
      setIsSearchLoading(false);
    }
  }, [allPosts, isSearchLoading]);

  const isSearching = query.trim().length > 0;

  // Built once when the full post list arrives (not on every keystroke).
  const searchableIndex = useMemo(
    () => buildSearchIndex(allPosts ?? []),
    [allPosts],
  );

  const search = useMemo(() => {
    if (!isSearching || !allPosts) return null;
    const results = searchIndex(searchableIndex, query);
    const exact = results.filter((r) => r.exact);
    if (exact.length > 0) {
      // literal hits first, then close (typo-tolerant) matches as "similar"
      return {
        kind: "exact" as const,
        posts: exact.map((r) => r.post),
        similar: results.filter((r) => !r.exact).map((r) => r.post).slice(0, 3),
      };
    }
    if (results.length > 0) {
      return {
        kind: "similar" as const,
        posts: results.slice(0, 6).map((r) => r.post),
        similar: [] as any[],
      };
    }
    return {
      kind: "none" as const,
      posts: allPosts.slice(0, 3),
      similar: [] as any[],
    };
  }, [isSearching, allPosts, searchableIndex, query]);

  const sections: { label: string | null; posts: any[] }[] = !isSearching
    ? [{ label: null, posts }]
    : !search
      ? []
      : [
          { label: null, posts: search.posts },
          ...(search.similar.length > 0
            ? [{ label: "Similar blogs you may like", posts: search.similar }]
            : []),
        ];

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px",
  });

  const loadPosts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const offset = posts.length;
      // 2. Updated Fetch: Calling local service instead of WP proxy
      const newLocalPosts = await getLocalPosts(3, offset);

      if (!newLocalPosts || newLocalPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => {
          const existingSlugs = new Set(prev.map((p) => p.slug));
          const uniqueNew = newLocalPosts.filter(
            (p) => !existingSlugs.has(p.slug),
          );

          if (uniqueNew.length === 0) {
            setHasMore(false);
            return prev;
          }

          return [...prev, ...uniqueNew];
        });
      }
    } catch (error) {
      console.error("Local Data Sync Failure:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, posts.length]);

  useEffect(() => {
    if (inView) {
      loadPosts();
    }
  }, [inView, loadPosts]);

  const currentMonthYear = new Date()
    .toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
    .toUpperCase();

  return (
    <main className="min-h-screen bg-[#E8E4D9] selection:bg-[#141B1A] selection:text-[#E8E4D9] overflow-x-hidden">
      {/* Newspaper Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-20 mix-blend-multiply bg-[url('/textures/paper-fibers.webp')]" />

      <header className="pt-24 md:pt-32 pb-12 px-6 md:px-16 lg:px-24 border-b-4 border-double border-[#141B1A]">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-12">
          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <span className="text-[9px] md:text-[10px] font-black tracking-widest text-[#141B1A] border-2 border-[#141B1A] px-2 md:px-3 py-1 uppercase">
                Late Night Edition
              </span>
              <span
                suppressHydrationWarning
                className="text-[9px] md:text-[10px] font-black tracking-widest text-[#141B1A]/60 uppercase"
              >
                {currentMonthYear} // FROM DISPATCH
              </span>
            </div>
            <h1 className="font-[family-name:var(--font-fraunces)] text-[15vw] md:text-[11rem] text-[#141B1A] font-black tracking-tighter leading-[0.8] uppercase break-words">
              The Night <br />
              <span className="italic font-[family-name:var(--font-playfair)] text-[#C56E3D]">
                Journal.
              </span>
            </h1>
          </div>
        </div>
      </header>

      <section className="relative z-10 px-6 md:px-16 lg:px-24 max-w-[1400px] mx-auto">
        {/* SEARCH BAR */}
        <div className="pt-10 pb-6 md:pt-14 md:pb-8 border-b-2 border-[#141B1A]">
          <label htmlFor="blog-search" className="sr-only">
            Search blogs
          </label>
          <div className="relative flex items-center border-2 border-[#141B1A] bg-white/60 focus-within:shadow-[6px_6px_0px_#C56E3D] transition-shadow">
            <Search
              className="absolute left-4 md:left-6 w-5 h-5 md:w-6 md:h-6 text-[#141B1A]/50 pointer-events-none"
              strokeWidth={2.5}
            />
            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                ensureAllPosts();
              }}
              onFocus={ensureAllPosts}
              placeholder="Search the archive… (typos are fine)"
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-transparent pl-12 md:pl-16 pr-12 py-4 md:py-6 text-base md:text-xl font-bold text-[#141B1A] placeholder:text-[#141B1A]/35 placeholder:font-semibold outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 md:right-5 p-1 text-[#141B1A]/60 hover:text-[#C56E3D] transition-colors"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
              </button>
            )}
          </div>
          {isSearching && (
            <p
              className="mt-4 text-[10px] md:text-xs font-black uppercase tracking-widest text-[#141B1A]/60"
              aria-live="polite"
            >
              {!search
                ? "Searching the archive…"
                : search.kind === "exact"
                  ? `${search.posts.length} ${search.posts.length === 1 ? "result" : "results"} for “${query.trim()}”`
                  : search.kind === "similar"
                    ? `No exact match for “${query.trim()}” — did you mean one of these?`
                    : `Nothing matched “${query.trim()}” — here are some recent blogs`}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          {sections.map((section, si) => (
            <div key={si} className="flex flex-col">
              {section.label && (
                <div className="pt-10 pb-2 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[#C56E3D]">
                  {section.label}
                </div>
              )}
          {section.posts.map((post: any, index: number) => (
            <Link
              href={`/blogs/${post.slug}`}
              key={`${post.slug}-${post.id}-${index}`}
              onMouseEnter={() => setHoveredSlug(post.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              className="group relative border-b-2 border-[#141B1A] py-8 md:py-24 flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center transition-all duration-500 hover:bg-[#141B1A]/[0.02]"
            >
              {/* RESPONSIVE IMAGE BOX */}
              <div className="relative w-full md:absolute md:right-0 md:top-0 md:h-full md:w-1/2 md:-z-10 overflow-hidden">
                {/* Mobile View */}
                <div className="block md:hidden relative w-full aspect-[16/10]">
                  <Image
                    src={post.image}
                    alt={decodeHTML(post.title)}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Desktop View: Hover Reveal */}
                <div className="hidden md:block w-full h-full">
                  {/* Always mounted so the image is fetched before hover;
                      only its visibility is animated. */}
                  <motion.div
                    initial="hide"
                    animate={hoveredSlug === post.slug ? "show" : "hide"}
                    variants={{
                      show: { x: 0, opacity: 0.55 },
                      // slide out left, then park at the right ready for next entry
                      hide: { x: -100, opacity: 0, transitionEnd: { x: 100 } },
                    }}
                    transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                    style={{ x: 100 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={post.image}
                      alt={decodeHTML(post.title)}
                      fill
                      sizes="50vw"
                      className="object-cover"
                    />
                  </motion.div>
                </div>
              </div>

              <div className="hidden sm:block w-24 md:w-32 shrink-0">
                <span className="font-black text-[10px] md:text-xs text-[#C56E3D] font-mono border-l-4 border-[#C56E3D] pl-4 uppercase">
                  {post.id}
                </span>
              </div>

              <div className="flex-1 space-y-4 md:space-y-6 relative z-20 w-full">
                <div className="flex items-center gap-3 md:gap-4">
                  <span className="text-[8px] md:text-[10px] font-black text-white bg-[#141B1A] px-2 py-0.5 md:py-1 uppercase tracking-widest">
                    {post.category}
                  </span>
                  <span className="text-[8px] md:text-[10px] font-black text-[#141B1A]/40 uppercase tracking-widest">
                    {post.date}
                  </span>
                </div>
                <h2 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-7xl text-[#141B1A] font-black tracking-tighter uppercase leading-[0.95] md:leading-[0.9] group-hover:text-[#C56E3D] transition-colors duration-500">
                  {decodeHTML(post.title)}
                </h2>
                <p className="max-w-xl text-[#141B1A]/80 text-sm md:text-xl font-medium leading-snug">
                  {post.excerpt}
                </p>
              </div>

              <div className="relative z-30 self-end md:self-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  className="w-10 h-10 md:w-24 md:h-24 rounded-full bg-[#141B1A] text-[#E8E4D9] flex items-center justify-center shadow-lg md:shadow-[8px_8px_0px_rgba(20,27,26,0.1)] group-hover:bg-[#C56E3D] transition-all"
                >
                  <ChevronRight
                    className="w-5 h-5 md:w-9 md:h-9"
                    strokeWidth={3}
                  />
                </motion.div>
              </div>
            </Link>
          ))}
            </div>
          ))}

          {isSearching && !search && (
            <div className="py-16 flex justify-center">
              <Loader2 className="animate-spin text-[#C56E3D] w-6 h-6 md:w-8 md:h-8" />
            </div>
          )}

          <div
            ref={ref}
            className={`py-16 md:py-20 flex justify-center items-center ${isSearching ? "hidden" : ""}`}
          >
            {hasMore ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-[#C56E3D] w-6 h-6 md:w-8 md:h-8" />
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-[#141B1A]/40 italic">
                  Printing next issue...
                </span>
              </div>
            ) : (
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-[#141B1A]/20">
                Archive Complete // No further issues
              </span>
            )}
          </div>
        </div>
      </section>

      <footer className="py-24 md:py-40 px-6 md:px-16 lg:px-24 bg-[#141B1A] text-[#E8E4D9] border-t-8 border-double border-[#141B1A]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 items-center">
          <div className="space-y-6 md:space-y-8 order-2 md:order-1">
            <Newspaper className="text-[#C56E3D] w-8 h-8 md:w-10 md:h-10" />
            <p className="text-xs md:text-sm font-medium leading-relaxed opacity-60 uppercase tracking-wider max-w-[300px]">
              Specializing in Webflow, SEO, and Next.js. Available for projects
              that demand soul and structural integrity.
            </p>
          </div>
          <div className="md:col-span-2 text-center md:text-right order-1 md:order-2">
            <Link
              href="/contact"
              className="group relative inline-block w-full md:w-auto"
            >
              <motion.div
                initial="initial"
                whileHover="hover"
                className="relative overflow-hidden pt-2 pb-2 md:pt-4 md:pb-4"
              >
                <h2 className="font-[family-name:var(--font-fraunces)] text-[12vw] md:text-[9rem] font-black uppercase tracking-tighter leading-none text-[#E8E4D9] opacity-20 select-none transition-opacity duration-500 group-hover:opacity-10">
                  Apply Within <br className="hidden md:block" /> Today.
                </h2>
                <motion.div
                  variants={{
                    initial: { clipPath: "inset(0% 0% 100% 0%)" },
                    hover: { clipPath: "inset(0% 0% 0% 0%)" },
                  }}
                  transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
                  className="absolute inset-0 pointer-events-none select-none z-10 pt-2 pb-2 md:pt-4 md:pb-4"
                >
                  <h2 className="font-[family-name:var(--font-fraunces)] text-[12vw] md:text-[9rem] font-black uppercase tracking-tighter leading-none text-[#C56E3D]">
                    Apply Within <br className="hidden md:block" /> Today.
                  </h2>
                </motion.div>
              </motion.div>
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
