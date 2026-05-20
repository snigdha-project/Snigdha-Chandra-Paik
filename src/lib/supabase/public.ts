import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in env.",
  );
}

// Anon client — safe for browser use (only sees what RLS allows: SELECT on
// public.projects and public.posts, public read on storage buckets).
export const supabasePublic = createClient(url, anonKey, {
  auth: { persistSession: false },
});

export const PROJECT_IMAGES_BUCKET = "project-images";
export const BLOG_IMAGES_BUCKET = "blog-images";

export function publicImageUrl(
  bucket: typeof PROJECT_IMAGES_BUCKET | typeof BLOG_IMAGES_BUCKET,
  path: string,
): string {
  return supabasePublic.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
