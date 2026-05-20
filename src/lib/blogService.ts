import {
  supabasePublic,
  publicImageUrl,
  BLOG_IMAGES_BUCKET,
} from "./supabase/public";

export type Post = {
  id: string; // formatted as "VOL. 01"
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  category: string;
  date: string; // formatted: "11 APR 2026"
  image: string; // full public URL
  excerpt: string;
  content: string;
};

type Row = {
  id: number;
  slug: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  category: string;
  date: string; // ISO yyyy-mm-dd
  image_path: string;
  excerpt: string;
  content: string;
};

function formatDate(iso: string): string {
  return new Date(iso)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}

function toPost(row: Row): Post {
  return {
    id: `VOL. ${String(row.id).padStart(2, "0")}`,
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title ?? undefined,
    metaDescription: row.meta_description ?? undefined,
    category: row.category,
    date: formatDate(row.date),
    image: publicImageUrl(BLOG_IMAGES_BUCKET, row.image_path),
    excerpt: row.excerpt,
    content: row.content,
  };
}

// Raw ISO date variant — for sitemap/seo schemas that need the unformatted date.
export type PostWithRawDate = Omit<Post, "date"> & { date: string; rawDate: string };

export async function getLocalPosts(limit = 3, offset = 0): Promise<Post[]> {
  const { data, error } = await supabasePublic
    .from("posts")
    .select(
      "id, slug, title, meta_title, meta_description, category, date, image_path, excerpt, content",
    )
    .order("date", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("getLocalPosts failed:", error.message);
    return [];
  }
  return (data as Row[]).map(toPost);
}

// NOTE: getPostBySlug intentionally keeps the date in raw ISO form (yyyy-mm-dd),
// because [slug]/page.tsx feeds it to blogPostingSchema which requires an ISO
// date. List views call getLocalPosts (above) which formats the date for UI.
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabasePublic
    .from("posts")
    .select(
      "id, slug, title, meta_title, meta_description, category, date, image_path, excerpt, content",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as Row;
  return {
    ...toPost(row),
    date: row.date,
  };
}

export type PostEditRow = {
  id: number;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  date: string; // raw ISO yyyy-mm-dd
  imagePath: string;
  imageUrl: string;
  excerpt: string;
  content: string;
};

export async function getPostForEdit(slug: string): Promise<PostEditRow | null> {
  const { data, error } = await supabasePublic
    .from("posts")
    .select(
      "id, slug, title, meta_title, meta_description, category, date, image_path, excerpt, content",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as Row;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title ?? "",
    metaDescription: row.meta_description ?? "",
    category: row.category,
    date: row.date,
    imagePath: row.image_path,
    imageUrl: publicImageUrl(BLOG_IMAGES_BUCKET, row.image_path),
    excerpt: row.excerpt,
    content: row.content,
  };
}

export type PostSummary = {
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string; // raw ISO yyyy-mm-dd
};

// Lightweight listing for the admin dashboard.
export async function getAllPostSummaries(): Promise<PostSummary[]> {
  const { data, error } = await supabasePublic
    .from("posts")
    .select("id, slug, title, category, date")
    .order("date", { ascending: false });
  if (error || !data) return [];
  return data as PostSummary[];
}

// For sitemap.ts and seo schemas which need ISO dates.
export async function getAllPostsForSeo(): Promise<
  {
    slug: string;
    title: string;
    metaTitle?: string;
    metaDescription?: string;
    excerpt: string;
    date: string;
    image: string;
    content: string;
  }[]
> {
  const { data, error } = await supabasePublic
    .from("posts")
    .select(
      "slug, title, meta_title, meta_description, category, date, image_path, excerpt, content",
    )
    .order("date", { ascending: false });

  if (error || !data) return [];
  return (data as Row[]).map((row) => ({
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title ?? undefined,
    metaDescription: row.meta_description ?? undefined,
    excerpt: row.excerpt,
    date: row.date, // raw ISO
    image: publicImageUrl(BLOG_IMAGES_BUCKET, row.image_path),
    content: row.content,
  }));
}
