import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

// 1. HELPER TO CLEAN HTML STRINGS
const decodeHTML = (html: string) => {
  if (!html) return "";
  return html
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/<[^>]+>/g, ""); // Strips tags for SEO title
};

// 2. DYNAMIC SEO METADATA
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // DYNAMIC URL LOGIC: Fixes the Vercel 500 error
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/wp-proxy?slug=${slug}&_embed`);
    const posts = await res.json();
    const post = posts[0];

    if (!post) return { title: "Post Not Found" };

    const seo = post.yoast_head_json;
    return {
      title: seo?.title || decodeHTML(post.title.rendered),
      description: seo?.description || "Read this story on The Night Journal",
    };
  } catch (error) {
    return { title: "The Night Journal // Editorial" };
  }
}

// 3. THE SINGLE POST COMPONENT
export default async function SingleBlogPost({ params }: Props) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // We fetch with _embed to get the Featured Image
  const res = await fetch(`${baseUrl}/api/wp-proxy?slug=${slug}&_embed`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) notFound();

  const posts = await res.json();
  const post = posts[0];

  if (!post) notFound();

  // IMAGE LOGIC: Pulling from WordPress Featured Image
  let featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  // Fallback if Featured Image isn't set but an image exists in content
  if (!featuredImage) {
    const match = post.content.rendered.match(/<img[^>]+src="([^">]+)"/);
    if (match) featuredImage = match[1];
  }

  // THE WASMER FIX: Correct localhost images
  if (featuredImage && featuredImage.includes("localhost")) {
    featuredImage = featuredImage.replace(
      /http:\/\/localhost(:\d+)?/,
      "https://blogsforme.wasmer.app",
    );
  }

  const wordCount = post.content.rendered
    .replace(/<[^>]+>/g, "")
    .split(" ").length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <main className="min-h-screen bg-[#E8E4D9] selection:bg-[#141B1A] selection:text-[#E8E4D9] pb-32 relative text-[#141B1A]">
      {/* Texture Overlay - Stay at z-0 */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.12] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

      <div className="relative z-10">
        <nav className="p-6 md:p-10 border-b-2 border-[#141B1A]/10 flex justify-between items-center">
          <Link
            href="/blogs"
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#141B1A]"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to Journal
          </Link>
          <div className="text-[10px] font-black uppercase tracking-widest text-[#141B1A]/40 font-mono">
            Wasmer Edition // Dispatch #{post.id}
          </div>
        </nav>

        <article className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
          <header className="py-16 md:py-24 border-b border-[#141B1A]">
            <div className="max-w-5xl">
              <div className="flex flex-wrap items-center gap-6 mb-10">
                <span className="bg-[#141B1A] text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest">
                  {post._embedded?.["wp:term"]?.[0]?.[0]?.name ||
                    "Uncategorized"}
                </span>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#141B1A] uppercase tracking-widest font-mono">
                  <CalendarDays size={12} />
                  {new Date(post.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#141B1A] uppercase tracking-widest font-mono">
                  <Clock3 size={12} />~ {readTime} Minute Read
                </div>
              </div>

              <h1 className="font-[family-name:var(--font-fraunces)] text-5xl md:text-8xl lg:text-9xl text-[#141B1A] font-black tracking-tighter leading-[0.9] uppercase mb-16">
                {post.title.rendered.replace(/&#8217;/g, "'")}
              </h1>
            </div>
          </header>

          {/* FEATURED IMAGE - Fixed Visibility */}
          {featuredImage && (
            <section className="py-12 md:py-20">
              <div className="relative w-full aspect-[21/9] border-2 border-[#141B1A] p-2 bg-[#DED9CC] shadow-2xl">
                <div className="relative w-full h-full overflow-hidden grayscale contrast-125 brightness-90 transition-all hover:grayscale-0 duration-700">
                  <Image
                    src={featuredImage}
                    alt="Editorial Visual"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </section>
          )}

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-16">
            <aside className="hidden lg:block lg:col-span-3 space-y-12 border-t-2 border-[#141B1A] pt-12">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#C56E3D] mb-5 underline decoration-2 underline-offset-4">
                  Dispatch From
                </h4>
                <p className="text-sm font-bold text-[#141B1A] uppercase tracking-wider">
                  Wasmer Cloud // {slug}
                </p>
              </div>
            </aside>

            {/* CONTENT BODY - Fixed White Text & New Lines */}
            <div className="lg:col-span-8 lg:col-start-5">
              <div
                className="prose prose-xl prose-stone max-w-none 
                  prose-p:text-[#141B1A] prose-p:leading-relaxed prose-p:mb-10 prose-p:block
                  prose-headings:text-[#141B1A] prose-headings:font-black prose-headings:uppercase prose-headings:mt-12 prose-headings:mb-6
                  prose-strong:text-[#141B1A] prose-strong:font-black
                  prose-li:text-[#141B1A]
                  first-letter:text-8xl first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:text-[#C56E3D] first-letter:leading-[0.85] first-letter:mt-2"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
            </div>
          </section>
        </article>

        <footer className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 mt-24">
          <div className="border-t-4 border-double border-[#141B1A] pt-16 text-center">
            <p className="font-[family-name:var(--font-playfair)] italic text-3xl md:text-5xl text-[#141B1A]">
              End of Dispatch.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
