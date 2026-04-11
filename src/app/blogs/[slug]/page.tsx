import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

// 1. HELPER TO CLEAN HTML
const decodeHTML = (html: string) => {
  if (!html) return "";
  return html
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#8211;/g, "–");
};

// 2. DYNAMIC SEO METADATA
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/wp-proxy?slug=${slug}`, {
      cache: "no-store",
    });
    const posts = await res.json();
    const post = posts[0];

    if (!post) return { title: "Post Not Found" };

    const seo = post.yoast_head_json;
    return {
      title: seo?.title || decodeHTML(post.title.rendered),
      description: seo?.description || "The Night Journal Editorial",
    };
  } catch (error) {
    return { title: "The Night Journal" };
  }
}

// 3. THE MAIN PAGE COMPONENT
export default async function SingleBlogPost({ params }: Props) {
  const { slug } = await params; // Unwrapping the promise
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // FETCHING WITH NO-STORE TO PREVENT "UNTOLD DEVELOPER" GHOSTING
  const res = await fetch(`${baseUrl}/api/wp-proxy?slug=${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) notFound();

  const posts = await res.json();

  // Logic check: ensure the post we got actually matches the slug we asked for
  const post = posts.find((p: any) => p.slug === slug) || posts[0];

  if (
    !post ||
    (posts.length > 0 && post.slug !== slug && slug !== "hello-world")
  ) {
    // This extra check ensures that if the API fails to filter, we don't show the wrong post
    console.error("Slug mismatch! Expected:", slug, "Got:", post?.slug);
  }

  // IMAGE LOGIC
  let featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  if (!featuredImage) {
    const match = post.content.rendered.match(/<img[^>]+src="([^">]+)"/);
    if (match) featuredImage = match[1];
  }
  if (featuredImage?.includes("localhost")) {
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
    <main className="min-h-screen bg-[#E8E4D9] selection:bg-[#141B1A] selection:text-[#E8E4D9] pb-32 relative">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.15] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

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
          <div className="text-[10px] font-black uppercase tracking-widest text-[#141B1A]/40 font-mono uppercase">
            {post.slug} // Dispatch #{post.id}
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
                {decodeHTML(post.title.rendered)}
              </h1>
            </div>
          </header>

          {featuredImage && (
            <section className="py-12 md:py-20">
              <div className="relative w-full aspect-[21/9] border-2 border-[#141B1A] p-2 bg-white/50">
                <div className="relative w-full h-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                  <Image
                    src={featuredImage}
                    alt="Cover"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </section>
          )}

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-16">
            <aside className="hidden lg:block lg:col-span-3 space-y-12 border-t-2 border-[#141B1A] pt-12 text-[#141B1A]">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#C56E3D] mb-5 underline decoration-2 underline-offset-4">
                Dispatch From
              </h4>
              <p className="text-sm font-bold uppercase tracking-wider">
                Wasmer Cloud // {slug}
              </p>
            </aside>

            <div className="lg:col-span-8 lg:col-start-5">
              <div
                className="prose prose-xl prose-stone max-w-none 
                  prose-p:text-[#141B1A] prose-p:leading-relaxed prose-p:font-medium prose-p:text-lg md:prose-p:text-xl
                  prose-headings:font-[family-name:var(--font-fraunces)] prose-headings:uppercase prose-headings:font-black prose-headings:text-[#141B1A]
                  prose-strong:text-[#C56E3D] prose-strong:font-black
                  prose-img:border-2 prose-img:border-[#141B1A] prose-img:p-1
                  first-letter:text-8xl first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:text-[#C56E3D] first-letter:leading-[0.85] first-letter:mt-2"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
