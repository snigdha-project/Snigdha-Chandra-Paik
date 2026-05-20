import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getPostForEdit } from "@/lib/blogService";
import PostForm from "@/components/admin/PostForm";

type Props = { params: Promise<{ slug: string }> };

export default async function EditPostPage({ params }: Props) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const { slug } = await params;
  const post = await getPostForEdit(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen px-6 md:px-12 py-12 max-w-[1000px] mx-auto">
      <Link
        href="/admin"
        className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-white/60 hover:text-[#C56E3D] transition-colors mb-10"
      >
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
        Dashboard
      </Link>

      <header className="mb-12">
        <span className="text-[10px] uppercase tracking-[0.6em] text-[#C56E3D] font-black block mb-4">
          Edit post
        </span>
        <h1 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-6xl font-black tracking-tighter leading-none">
          {post.title}
        </h1>
      </header>

      <section className="bg-white/[0.02] border border-white/10 rounded-3xl p-8">
        <PostForm
          initial={{
            slug: post.slug,
            title: post.title,
            metaTitle: post.metaTitle,
            metaDescription: post.metaDescription,
            category: post.category,
            date: post.date,
            excerpt: post.excerpt,
            content: post.content,
            imageUrl: post.imageUrl,
          }}
        />
      </section>
    </main>
  );
}
