import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getProjectForEdit } from "@/lib/projectService";
import ProjectForm from "@/components/admin/ProjectForm";

type Props = { params: Promise<{ slug: string }> };

export default async function EditProjectPage({ params }: Props) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const { slug } = await params;
  const project = await getProjectForEdit(slug);
  if (!project) notFound();

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
          Edit project
        </span>
        <h1 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-6xl font-black tracking-tighter leading-none">
          {project.title}
        </h1>
      </header>

      <section className="bg-white/[0.02] border border-white/10 rounded-3xl p-8">
        <ProjectForm
          initial={{
            slug: project.slug,
            title: project.title,
            description: project.description,
            category: project.category,
            tech: project.tech,
            link: project.link,
            featured: project.featured,
            colorKey: project.colorKey,
            caseStudy: project.caseStudy,
            metaTitle: project.metaTitle,
            metaDescription: project.metaDescription,
            orderIndex: project.orderIndex,
            imageUrl: project.imageUrl,
          }}
        />
      </section>
    </main>
  );
}
