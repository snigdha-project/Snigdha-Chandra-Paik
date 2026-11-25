import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ChevronDown } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import ToolRunner from "@/components/tools/ToolRunner";
import ToolIcon from "@/components/tools/ToolIcon";
import { SITE_URL, breadcrumbSchema, faqSchema, toolSchema } from "@/lib/seo";
import { getToolBySlug, getTools } from "@/lib/toolService";

type Props = { params: Promise<{ slug: string }> };

// Pre-render every tool; new/edited tools refresh through /api/revalidate and
// unknown slugs are rendered on demand.
export async function generateStaticParams() {
  const tools = await getTools();
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) return { title: "Tool Not Found" };

  const title = tool.metaTitle ?? `${tool.title} | Snigdha Chandra Paik`;
  const description = tool.metaDescription ?? tool.description;
  const canonical = `/tools/${slug}`;

  return {
    title,
    description,
    alternates: { canonical, languages: { "en-IN": canonical } },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Snigdha Chandra Paik",
      locale: "en_IN",
      type: "website",
      images: [{ url: "/OG/projectsOG.png", width: 1200, height: 630, alt: tool.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/OG/projectsOG.png"],
    },
  };
}

const ARTICLE_STYLES = [
  "max-w-3xl",
  "[&_h2]:font-[family-name:var(--font-fraunces)] [&_h2]:text-3xl md:[&_h2]:text-4xl [&_h2]:font-black [&_h2]:tracking-tighter [&_h2]:text-white [&_h2]:mt-12 [&_h2]:mb-5 first:[&_h2]:mt-0",
  "[&_h3]:text-xl [&_h3]:font-black [&_h3]:text-white [&_h3]:mt-8 [&_h3]:mb-3",
  "[&_p]:text-white/65 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-5",
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6",
  "[&_li]:text-white/65 [&_li]:text-lg [&_li]:leading-relaxed [&_li]:mb-2",
  "[&_strong]:text-white [&_a]:text-[#C56E3D] [&_a]:underline [&_a]:underline-offset-4",
].join(" ");

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const [tool, allTools] = await Promise.all([getToolBySlug(slug), getTools()]);
  if (!tool) notFound();

  const related = allTools.filter((t) => t.slug !== tool.slug).slice(0, 3);
  const canonical = `${SITE_URL}/tools/${tool.slug}`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Tools", url: `${SITE_URL}/tools` },
            { name: tool.title, url: canonical },
          ]),
          toolSchema(tool),
          ...(tool.faq.length ? [faqSchema(tool.faq)] : []),
        ]}
      />

      <main className="min-h-screen bg-[#050505] overflow-x-hidden selection:bg-[#C56E3D] selection:text-white">
        <section className="pt-36 md:pt-40 pb-10 px-6 md:px-16 lg:px-24 max-w-[1400px] mx-auto">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-black text-white/50 hover:text-[#C56E3D] transition-colors mb-10"
          >
            <ArrowLeft size={14} /> All tools
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <span className="grid place-items-center size-12 rounded-2xl bg-[#C56E3D]/15 text-[#C56E3D]">
              <ToolIcon name={tool.icon} />
            </span>
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#C56E3D] font-black">
              {tool.category}
            </span>
          </div>
          <h1 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-6xl lg:text-7xl text-white font-black tracking-tighter leading-[0.95] max-w-5xl">
            {tool.title}
          </h1>
          {tool.description && (
            <p className="mt-6 text-white/50 text-lg md:text-xl max-w-3xl leading-relaxed font-medium">
              {tool.description}
            </p>
          )}
        </section>

        <section className="px-6 md:px-16 lg:px-24 pb-20 max-w-[1400px] mx-auto">
          <ToolRunner runtime={tool.runtime} title={tool.title} />
        </section>

        {tool.contentHtml.trim() && (
          <section className="px-6 md:px-16 lg:px-24 pb-20 max-w-[1400px] mx-auto">
            <article
              className={ARTICLE_STYLES}
              dangerouslySetInnerHTML={{ __html: tool.contentHtml }}
            />
          </section>
        )}

        {tool.faq.length > 0 && (
          <section className="px-6 md:px-16 lg:px-24 pb-20 max-w-[1400px] mx-auto">
            <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-5xl text-white font-black tracking-tighter mb-8">
              Frequently asked{" "}
              <span className="italic font-[family-name:var(--font-playfair)] text-[#C56E3D]">
                questions.
              </span>
            </h2>
            <div className="max-w-3xl flex flex-col gap-3">
              {tool.faq.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl bg-[#0F0F0F] border border-white/5 open:border-[#C56E3D]/30 transition-colors"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-white font-bold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown
                      size={18}
                      className="shrink-0 text-[#C56E3D] transition-transform group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <p className="px-6 pb-6 text-white/60 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <section className="px-6 md:px-16 lg:px-24 pb-24 max-w-[1400px] mx-auto">
          <div className="rounded-[2.5rem] bg-gradient-to-br from-[#C56E3D]/20 to-[#C56E3D]/5 border border-[#C56E3D]/30 p-8 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-5xl text-white font-black tracking-tighter leading-[1]">
                Need something built for your business?
              </h2>
              <p className="mt-4 text-white/60 text-lg max-w-xl">
                I build fast websites, landing pages and custom tools that turn
                visitors into customers.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-5 rounded-full bg-[#C56E3D] hover:bg-[#A64D32] text-white text-[10px] uppercase tracking-[0.4em] font-black transition-colors shrink-0"
            >
              Start a project <ArrowUpRight size={14} />
            </Link>
          </div>
        </section>

        {related.length > 0 && (
          <section className="px-6 md:px-16 lg:px-24 pb-28 max-w-[1400px] mx-auto">
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#C56E3D] font-black mb-6">
              More tools
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/tools/${t.slug}`}
                    className="flex items-center gap-4 rounded-2xl bg-[#0F0F0F] border border-white/5 hover:border-[#C56E3D]/30 p-5 transition-colors"
                  >
                    <span className="grid place-items-center size-10 shrink-0 rounded-xl bg-[#C56E3D]/15 text-[#C56E3D]">
                      <ToolIcon name={t.icon} size={18} />
                    </span>
                    <span className="text-white font-bold leading-snug">{t.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
