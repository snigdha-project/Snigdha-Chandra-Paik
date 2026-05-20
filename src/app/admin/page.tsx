import Link from "next/link";
import { redirect } from "next/navigation";
import { Pencil } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getProjects } from "@/lib/projectService";
import { getAllPostSummaries } from "@/lib/blogService";
import {
  deletePostAction,
  deleteProjectAction,
  logoutAction,
} from "./actions";
import ProjectForm from "@/components/admin/ProjectForm";
import PostForm from "@/components/admin/PostForm";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const [projects, posts] = await Promise.all([
    getProjects(),
    getAllPostSummaries(),
  ]);

  return (
    <main className="min-h-screen px-6 md:px-12 py-12 max-w-[1600px] mx-auto">
      {/* Header */}
      <header className="flex items-end justify-between mb-12 md:mb-16 gap-6 flex-wrap">
        <div>
          <span className="text-[10px] uppercase tracking-[0.6em] text-[#C56E3D] font-black block mb-3">
            Console
          </span>
          <h1 className="font-[family-name:var(--font-fraunces)] text-5xl md:text-7xl font-black tracking-tighter leading-none">
            Publish{" "}
            <span className="italic font-[family-name:var(--font-playfair)] text-[#C56E3D]">
              new work.
            </span>
          </h1>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-[10px] uppercase tracking-[0.4em] font-black px-6 py-3 rounded-full border border-white/15 hover:border-[#C56E3D] hover:text-[#C56E3D] transition-colors"
          >
            Sign out
          </button>
        </form>
      </header>

      {/* Forms grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* PROJECTS column */}
        <div className="space-y-10">
          <section className="bg-white/[0.02] border border-white/10 rounded-3xl p-8">
            <header className="mb-8">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#C56E3D] font-black block mb-2">
                New entry
              </span>
              <h2 className="font-[family-name:var(--font-fraunces)] text-3xl font-black tracking-tighter">
                Project
              </h2>
            </header>
            <ProjectForm />
          </section>

          <section className="bg-white/[0.02] border border-white/10 rounded-3xl p-8">
            <header className="mb-6 flex items-end justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#C56E3D] font-black block mb-2">
                  Manage
                </span>
                <h2 className="font-[family-name:var(--font-fraunces)] text-3xl font-black tracking-tighter">
                  Projects
                </h2>
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black">
                {projects.length} total
              </span>
            </header>

            {projects.length === 0 ? (
              <p className="text-sm text-white/40 italic">No projects yet.</p>
            ) : (
              <ul className="divide-y divide-white/10">
                {projects.map((p) => (
                  <li
                    key={p.id}
                    className="py-4 flex items-center justify-between gap-4 flex-wrap"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-black tracking-tight truncate">
                          {p.title}
                        </h3>
                        {p.featured && (
                          <span className="text-[8px] uppercase tracking-[0.3em] font-black px-2 py-0.5 rounded-full bg-[#C56E3D]/15 text-[#C56E3D] border border-[#C56E3D]/30">
                            Featured
                          </span>
                        )}
                        {p.hasCaseStudy && (
                          <span className="text-[8px] uppercase tracking-[0.3em] font-black px-2 py-0.5 rounded-full bg-white/5 text-white/60 border border-white/10">
                            Case study
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black">
                        {p.category} · /{p.slug}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/admin/projects/${p.slug}/edit`}
                        className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.3em] font-black px-3 py-1.5 rounded-full border border-white/10 text-white/60 hover:text-[#C56E3D] hover:border-[#C56E3D]/40 transition-colors"
                      >
                        <Pencil size={11} />
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteProjectAction}
                        slug={p.slug}
                        label={p.title}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* POSTS column */}
        <div className="space-y-10">
          <section className="bg-white/[0.02] border border-white/10 rounded-3xl p-8">
            <header className="mb-8">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#C56E3D] font-black block mb-2">
                New entry
              </span>
              <h2 className="font-[family-name:var(--font-fraunces)] text-3xl font-black tracking-tighter">
                Blog post
              </h2>
            </header>
            <PostForm />
          </section>

          <section className="bg-white/[0.02] border border-white/10 rounded-3xl p-8">
            <header className="mb-6 flex items-end justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#C56E3D] font-black block mb-2">
                  Manage
                </span>
                <h2 className="font-[family-name:var(--font-fraunces)] text-3xl font-black tracking-tighter">
                  Blog posts
                </h2>
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black">
                {posts.length} total
              </span>
            </header>

            {posts.length === 0 ? (
              <p className="text-sm text-white/40 italic">No posts yet.</p>
            ) : (
              <ul className="divide-y divide-white/10">
                {posts.map((p) => (
                  <li
                    key={p.id}
                    className="py-4 flex items-center justify-between gap-4 flex-wrap"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-black tracking-tight truncate mb-1">
                        {p.title}
                      </h3>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black">
                        {p.category} · {p.date} · /{p.slug}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/admin/posts/${p.slug}/edit`}
                        className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.3em] font-black px-3 py-1.5 rounded-full border border-white/10 text-white/60 hover:text-[#C56E3D] hover:border-[#C56E3D]/40 transition-colors"
                      >
                        <Pencil size={11} />
                        Edit
                      </Link>
                      <DeleteButton
                        action={deletePostAction}
                        slug={p.slug}
                        label={p.title}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
