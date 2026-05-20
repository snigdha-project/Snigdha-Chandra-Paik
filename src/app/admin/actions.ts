"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  checkRateLimit,
  clearAdminSessionCookie,
  clearRateLimit,
  isAdminAuthenticated,
  setAdminSessionCookie,
  verifyPassword,
} from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

// ---------- types ----------
export type ActionState = {
  ok?: boolean;
  error?: string;
  message?: string;
};

// ---------- helpers ----------
async function getRequestIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) throw new Error("Unauthorized");
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function fileExtension(file: File): string {
  const dot = file.name.lastIndexOf(".");
  if (dot === -1) return "bin";
  return file.name.slice(dot + 1).toLowerCase();
}

async function uploadImage(
  bucket: "project-images" | "blog-images",
  slug: string,
  file: File,
): Promise<string> {
  const ext = fileExtension(file);
  const path = `${slug}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
  if (error) throw new Error(`Image upload failed: ${error.message}`);
  return path;
}

// ============================================================================
// Auth actions
// ============================================================================

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ip = await getRequestIp();
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return {
      error: `Too many attempts. Try again in ${Math.ceil(limit.retryInSec / 60)} min.`,
    };
  }

  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "Password is required." };

  const ok = await verifyPassword(password);
  if (!ok) return { error: "Incorrect password." };

  clearRateLimit(ip);
  await setAdminSessionCookie();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}

// ============================================================================
// Project create
// ============================================================================

export async function createProjectAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const techRaw = String(formData.get("tech") ?? "");
  const link = String(formData.get("link") ?? "").trim() || null;
  const featured = formData.get("featured") === "on";
  const colorKey = String(formData.get("color_key") ?? "").trim() || null;
  const caseStudy = String(formData.get("case_study") ?? "").trim() || null;
  const metaTitle = String(formData.get("meta_title") ?? "").trim() || null;
  const metaDescription =
    String(formData.get("meta_description") ?? "").trim() || null;
  const orderIndexRaw = String(formData.get("order_index") ?? "0").trim();
  const image = formData.get("image");

  if (!title) return { error: "Title is required." };
  if (!description) return { error: "Description is required." };
  if (!category) return { error: "Category is required." };
  if (!(image instanceof File) || image.size === 0) {
    return { error: "Image is required." };
  }

  const slug = slugRaw ? slugify(slugRaw) : slugify(title);
  if (!slug) return { error: "Could not derive a slug from the title." };

  const tech = techRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const orderIndex = Number(orderIndexRaw);
  if (!Number.isFinite(orderIndex)) {
    return { error: "Order index must be a number." };
  }

  let imagePath: string;
  try {
    imagePath = await uploadImage("project-images", slug, image);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Image upload failed." };
  }

  const { error } = await supabaseAdmin.from("projects").insert({
    slug,
    title,
    description,
    category,
    tech,
    image_path: imagePath,
    link,
    featured,
    color_key: colorKey,
    case_study: caseStudy,
    meta_title: metaTitle,
    meta_description: metaDescription,
    order_index: orderIndex,
  });

  if (error) {
    // Try to clean up the orphaned image so retries work.
    await supabaseAdmin.storage.from("project-images").remove([imagePath]);
    if (error.code === "23505") return { error: `Slug "${slug}" already exists.` };
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  return { ok: true, message: `Project "${title}" published.` };
}

// ============================================================================
// Project update / delete
// ============================================================================

export async function updateProjectAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const originalSlug = String(formData.get("original_slug") ?? "").trim();
  if (!originalSlug) return { error: "Missing original_slug." };

  const title = String(formData.get("title") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const techRaw = String(formData.get("tech") ?? "");
  const link = String(formData.get("link") ?? "").trim() || null;
  const featured = formData.get("featured") === "on";
  const colorKey = String(formData.get("color_key") ?? "").trim() || null;
  const caseStudy = String(formData.get("case_study") ?? "").trim() || null;
  const metaTitle = String(formData.get("meta_title") ?? "").trim() || null;
  const metaDescription =
    String(formData.get("meta_description") ?? "").trim() || null;
  const orderIndexRaw = String(formData.get("order_index") ?? "0").trim();
  const image = formData.get("image");

  if (!title) return { error: "Title is required." };
  if (!description) return { error: "Description is required." };
  if (!category) return { error: "Category is required." };

  const slug = slugRaw ? slugify(slugRaw) : slugify(title);
  if (!slug) return { error: "Could not derive a slug from the title." };

  const tech = techRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const orderIndex = Number(orderIndexRaw);
  if (!Number.isFinite(orderIndex)) {
    return { error: "Order index must be a number." };
  }

  // Look up the existing row so we can know its current image_path.
  const { data: existing, error: fetchErr } = await supabaseAdmin
    .from("projects")
    .select("id, image_path")
    .eq("slug", originalSlug)
    .maybeSingle();
  if (fetchErr || !existing) return { error: "Project not found." };

  // Optional image replacement.
  let newImagePath: string | null = null;
  if (image instanceof File && image.size > 0) {
    try {
      newImagePath = await uploadImage("project-images", slug, image);
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Image upload failed." };
    }
  }

  const update: Record<string, unknown> = {
    slug,
    title,
    description,
    category,
    tech,
    link,
    featured,
    color_key: colorKey,
    case_study: caseStudy,
    meta_title: metaTitle,
    meta_description: metaDescription,
    order_index: orderIndex,
  };
  if (newImagePath) update.image_path = newImagePath;

  const { error } = await supabaseAdmin
    .from("projects")
    .update(update)
    .eq("id", existing.id);

  if (error) {
    if (newImagePath) {
      await supabaseAdmin.storage.from("project-images").remove([newImagePath]);
    }
    if (error.code === "23505") return { error: `Slug "${slug}" already exists.` };
    return { error: error.message };
  }

  // Image was replaced — clean up the old file in storage.
  if (newImagePath && existing.image_path) {
    await supabaseAdmin.storage
      .from("project-images")
      .remove([existing.image_path]);
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${originalSlug}`);
  if (slug !== originalSlug) revalidatePath(`/projects/${slug}`);
  return { ok: true, message: `Project "${title}" updated.` };
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return;

  const { data: row } = await supabaseAdmin
    .from("projects")
    .select("id, image_path")
    .eq("slug", slug)
    .maybeSingle();

  if (row) {
    await supabaseAdmin.from("projects").delete().eq("id", row.id);
    if (row.image_path) {
      await supabaseAdmin.storage.from("project-images").remove([row.image_path]);
    }
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/admin");
}

// ============================================================================
// Post (blog) create
// ============================================================================

export async function createPostAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const metaTitle = String(formData.get("meta_title") ?? "").trim() || null;
  const metaDescription =
    String(formData.get("meta_description") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const image = formData.get("image");

  if (!title) return { error: "Title is required." };
  if (!category) return { error: "Category is required." };
  if (!date) return { error: "Date is required (YYYY-MM-DD)." };
  if (!excerpt) return { error: "Excerpt is required." };
  if (!content) return { error: "Content is required." };
  if (!(image instanceof File) || image.size === 0) {
    return { error: "Image is required." };
  }

  const slug = slugRaw ? slugify(slugRaw) : slugify(title);
  if (!slug) return { error: "Could not derive a slug from the title." };

  let imagePath: string;
  try {
    imagePath = await uploadImage("blog-images", slug, image);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Image upload failed." };
  }

  const { error } = await supabaseAdmin.from("posts").insert({
    slug,
    title,
    meta_title: metaTitle,
    meta_description: metaDescription,
    category,
    date,
    image_path: imagePath,
    excerpt,
    content,
  });

  if (error) {
    await supabaseAdmin.storage.from("blog-images").remove([imagePath]);
    if (error.code === "23505") return { error: `Slug "${slug}" already exists.` };
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/blogs");
  revalidatePath(`/blogs/${slug}`);
  return { ok: true, message: `Post "${title}" published.` };
}

// ============================================================================
// Post update / delete
// ============================================================================

export async function updatePostAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const originalSlug = String(formData.get("original_slug") ?? "").trim();
  if (!originalSlug) return { error: "Missing original_slug." };

  const title = String(formData.get("title") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const metaTitle = String(formData.get("meta_title") ?? "").trim() || null;
  const metaDescription =
    String(formData.get("meta_description") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const image = formData.get("image");

  if (!title) return { error: "Title is required." };
  if (!category) return { error: "Category is required." };
  if (!date) return { error: "Date is required (YYYY-MM-DD)." };
  if (!excerpt) return { error: "Excerpt is required." };
  if (!content) return { error: "Content is required." };

  const slug = slugRaw ? slugify(slugRaw) : slugify(title);
  if (!slug) return { error: "Could not derive a slug from the title." };

  const { data: existing, error: fetchErr } = await supabaseAdmin
    .from("posts")
    .select("id, image_path")
    .eq("slug", originalSlug)
    .maybeSingle();
  if (fetchErr || !existing) return { error: "Post not found." };

  let newImagePath: string | null = null;
  if (image instanceof File && image.size > 0) {
    try {
      newImagePath = await uploadImage("blog-images", slug, image);
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Image upload failed." };
    }
  }

  const update: Record<string, unknown> = {
    slug,
    title,
    meta_title: metaTitle,
    meta_description: metaDescription,
    category,
    date,
    excerpt,
    content,
  };
  if (newImagePath) update.image_path = newImagePath;

  const { error } = await supabaseAdmin
    .from("posts")
    .update(update)
    .eq("id", existing.id);

  if (error) {
    if (newImagePath) {
      await supabaseAdmin.storage.from("blog-images").remove([newImagePath]);
    }
    if (error.code === "23505") return { error: `Slug "${slug}" already exists.` };
    return { error: error.message };
  }

  if (newImagePath && existing.image_path) {
    await supabaseAdmin.storage.from("blog-images").remove([existing.image_path]);
  }

  revalidatePath("/");
  revalidatePath("/blogs");
  revalidatePath(`/blogs/${originalSlug}`);
  if (slug !== originalSlug) revalidatePath(`/blogs/${slug}`);
  return { ok: true, message: `Post "${title}" updated.` };
}

export async function deletePostAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return;

  const { data: row } = await supabaseAdmin
    .from("posts")
    .select("id, image_path")
    .eq("slug", slug)
    .maybeSingle();

  if (row) {
    await supabaseAdmin.from("posts").delete().eq("id", row.id);
    if (row.image_path) {
      await supabaseAdmin.storage.from("blog-images").remove([row.image_path]);
    }
  }

  revalidatePath("/");
  revalidatePath("/blogs");
  revalidatePath(`/blogs/${slug}`);
  revalidatePath("/admin");
}
