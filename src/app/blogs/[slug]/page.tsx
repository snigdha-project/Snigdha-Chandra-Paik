import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Bookmark,
  ArrowUpRight,
} from "lucide-react";
import { getPostBySlug, getLocalPosts } from "@/lib/blogService";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, blogPostingSchema, breadcrumbSchema } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

// 1. DYNAMIC SEO METADATA — prefers `metaTitle` / `metaDescription` from posts.json,
//    falls back to the visible `title` / `excerpt` when those fields are absent.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  const seoTitle = post.metaTitle ?? `${post.title} | Snigdha Chandra Paik`;
  const seoDescription = post.metaDescription ?? post.excerpt;
  const canonical = `/blogs/${slug}`;

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical,
      languages: { "en-IN": canonical },
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonical,
      siteName: "Snigdha Chandra Paik",
      locale: "en_IN",
      type: "article",
      publishedTime: post.date,
      authors: ["Snigdha Chandra Paik"],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [post.image],
    },
  };
}

// 2. HELPER TO CREATE ANCHOR LINKS
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default async function SingleBlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // 3. RELATED POSTS LOGIC (Based on Category)
  const allPosts = await getLocalPosts(100, 0);
  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 2);

  // 4. TOC EXTRACTION & CONTENT ID INJECTION
  let modifiedContent = post.content;
  const headings: { text: string; id: string }[] = [];
  modifiedContent = post.content.replace(
    /<h2.*?>(.*?)<\/h2>/g,
    (match, title) => {
      const cleanTitle = title.replace(/<[^>]*>?/gm, "").trim();
      const id = slugify(cleanTitle);
      headings.push({ text: cleanTitle, id });
      return `<h2 id="${id}">${title}</h2>`;
    },
  );

  const wordCount = post.content.replace(/<[^>]+>/g, "").split(" ").length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <main className="min-h-screen bg-[#E8E4D9] text-[#141B1A] relative selection:bg-[#C56E3D] selection:text-white scroll-smooth">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Blogs", url: `${SITE_URL}/blogs` },
            { name: post.title, url: `${SITE_URL}/blogs/${slug}` },
          ]),
          blogPostingSchema(post),
        ]}
      />
      {/* Newspaper Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-10 mix-blend-multiply"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/paper-fibers.png')",
        }}
      />

      {/* TOP NAV */}
      <nav className="p-6 md:p-8 border-b border-[#141B1A]/10 flex justify-between items-center bg-[#E8E4D9]/90 backdrop-blur-sm sticky top-0 z-50">
        <Link
          href="/blogs"
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-1"
          />
          Archive
        </Link>
        <div className="text-[10px] font-black uppercase tracking-widest text-[#C56E3D]">
          Editorial // {post.category}
        </div>
      </nav>

      <article className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* MAIN COLUMN */}
          <div className="lg:col-span-8 py-12 md:py-20">
            <header className="mb-12">
              <div className="flex items-center gap-4 mb-6 text-[9px] font-black uppercase tracking-widest opacity-40">
                <CalendarDays size={12} /> {post.date}
                <span>/</span>
                <Clock3 size={12} /> {readTime} Min Read
              </div>
              <h1 className="font-[family-name:var(--font-fraunces)] text-5xl md:text-8xl font-black tracking-tighter leading-none uppercase mb-10">
                {post.title}
              </h1>
              <div className="relative aspect-[21/9] w-full border-2 border-[#141B1A] p-1 bg-white">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </header>

            {/* CONTENT BODY - MANUAL STYLING */}
            <div
              className="
                [&_p]:text-lg md:[&_p]:text-xl [&_p]:leading-relaxed [&_p]:mb-8 [&_p]:text-[#141B1A]/80
                [&_h2]:text-3xl md:[&_h2]:text-5xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:tracking-tighter [&_h2]:mt-16 [&_h2]:mb-8 [&_h2]:font-[family-name:var(--font-fraunces)] [&_h2]:scroll-mt-24 [&_h2]:border-l-8 [&_h2]:border-[#C56E3D] [&_h2]:pl-6
                [&_h3]:text-xl [&_h3]:font-black [&_h3]:uppercase [&_h3]:mt-10 [&_h3]:mb-4
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-8 [&_li]:mb-2 [&_li]:font-medium
                [&_table]:w-full [&_table]:my-10 [&_table]:border-2 [&_table]:border-[#141B1A]
                [&_thead]:bg-[#141B1A] [&_thead]:text-[#E8E4D9]
                [&_th]:p-4 [&_th]:text-[10px] [&_th]:uppercase [&_th]:tracking-widest [&_th]:text-left
                [&_td]:p-4 [&_td]:border [&_td]:border-[#141B1A]/10 [&_td]:text-base
                [&_p:first-of-type]:first-letter:text-6xl [&_p:first-of-type]:first-letter:font-black [&_p:first-of-type]:first-letter:float-left [&_p:first-of-type]:first-letter:mr-3 [&_p:first-of-type]:first-letter:text-[#C56E3D] [&_p:first-of-type]:first-letter:leading-none [&_p:first-of-type]:first-letter:mt-1
              "
              dangerouslySetInnerHTML={{ __html: modifiedContent }}
            />
          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4 py-12 lg:py-20 lg:border-l border-[#141B1A]/10 lg:pl-12">
            <div className="sticky top-32 space-y-12">
              <section>
                <div className="flex items-center gap-2 mb-6 text-[#C56E3D]">
                  <Bookmark size={14} fill="currentColor" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Outline
                  </span>
                </div>
                <nav className="flex flex-col gap-4">
                  {headings.map((h, i) => (
                    <a
                      key={i}
                      href={`#${h.id}`}
                      className="text-xs font-black uppercase tracking-tight text-[#141B1A]/50 hover:text-[#C56E3D] hover:translate-x-1 transition-all"
                    >
                      <span className="mr-3 opacity-20 font-mono">
                        0{i + 1}
                      </span>{" "}
                      {h.text}
                    </a>
                  ))}
                </nav>
              </section>

              <div className="p-8 border-2 border-[#141B1A] bg-white/50 relative">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40 block mb-2">
                  Author Info
                </span>
                <p className="font-[family-name:var(--font-fraunces)] text-2xl font-black uppercase leading-tight mb-2">
                  Snigdha C. Paik
                </p>
                <p className="text-[10px] font-bold opacity-60 uppercase">
                  Web Architect & SEO Specialist.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* RELATED DISPATCHES */}
        <section className="mt-20 py-20 border-t-2 border-[#141B1A]">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C56E3D] mb-2 block">
                Related Issues
              </span>
              <h2 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-6xl font-black uppercase tracking-tighter">
                More in {post.category}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedPosts.length > 0 ? (
              relatedPosts.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blogs/${rel.slug}`}
                  className="group block bg-white p-6 border-2 border-[#141B1A] transition-all hover:shadow-[10px_10px_0px_#C56E3D]"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40">
                      {rel.date}
                    </span>
                    <ArrowUpRight
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      size={20}
                    />
                  </div>
                  <h3 className="font-[family-name:var(--font-fraunces)] text-2xl md:text-3xl font-black uppercase tracking-tight leading-none mb-4">
                    {rel.title}
                  </h3>
                  <p className="text-sm opacity-60 line-clamp-2 uppercase font-bold tracking-tight">
                    {rel.excerpt}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-[10px] font-black uppercase opacity-30 italic">
                No further issues found in this category.
              </p>
            )}
          </div>
        </section>
      </article>

      <footer className="py-20 text-center border-t border-[#141B1A]/10">
        <p className="font-[family-name:var(--font-playfair)] italic text-4xl opacity-10 mb-6">
          Finis.
        </p>
        <Link
          href="/blogs"
          className="text-[10px] font-black uppercase tracking-[0.3em] border-b-2 border-[#C56E3D] pb-1 text-[#C56E3D]"
        >
          Browse All Issues
        </Link>
      </footer>
    </main>
  );
}
