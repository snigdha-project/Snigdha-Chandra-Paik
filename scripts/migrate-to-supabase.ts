/**
 * One-time migration: src/data/projects.json + src/content/posts.json → Supabase.
 *
 * Usage:
 *   npm run migrate
 *
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 * Idempotent: re-running upserts by slug so it's safe.
 */

import { readFile } from "node:fs/promises";
import { resolve, extname, basename } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { config as loadEnv } from "dotenv";

// Load .env.local first, then fall back to .env
loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function contentTypeFor(filename: string): string {
  const ext = extname(filename).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".svg") return "image/svg+xml";
  return "application/octet-stream";
}

async function uploadFromPublic(
  bucket: string,
  publicRelPath: string,
): Promise<string> {
  // publicRelPath looks like "/projects/AMJ.png"
  const filename = basename(publicRelPath);
  const localPath = resolve(process.cwd(), "public", publicRelPath.replace(/^\//, ""));
  const buffer = await readFile(localPath);
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, buffer, {
      contentType: contentTypeFor(filename),
      upsert: true,
    });
  if (error) throw new Error(`Upload to ${bucket}/${filename} failed: ${error.message}`);
  return filename;
}

// ----------------------------------------------------------------------------
// Projects
// ----------------------------------------------------------------------------
type ProjectJson = {
  id: number;
  title: string;
  description: string;
  category: string;
  tech: string[];
  image: string;
  link: string;
  featured: boolean;
  colorKey?: string;
};

async function migrateProjects() {
  const raw = await readFile(
    resolve(process.cwd(), "src/data/projects.json"),
    "utf8",
  );
  const projects: ProjectJson[] = JSON.parse(raw);

  console.log(`Migrating ${projects.length} projects...`);

  for (const p of projects) {
    const slug = slugify(p.title);
    try {
      const imagePath = await uploadFromPublic("project-images", p.image);
      const { error } = await supabase.from("projects").upsert(
        {
          slug,
          title: p.title,
          description: p.description,
          category: p.category,
          tech: p.tech,
          image_path: imagePath,
          link: p.link,
          featured: p.featured,
          color_key: p.colorKey ?? null,
          case_study: null,
          order_index: p.id,
        },
        { onConflict: "slug" },
      );
      if (error) throw error;
      console.log(`  ✓ ${p.title}  (slug=${slug})`);
    } catch (e) {
      console.error(`  ✗ ${p.title}:`, e instanceof Error ? e.message : e);
    }
  }
}

// ----------------------------------------------------------------------------
// Posts
// ----------------------------------------------------------------------------
type PostJson = {
  id: string;
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
};

async function migratePosts() {
  const raw = await readFile(
    resolve(process.cwd(), "src/content/posts.json"),
    "utf8",
  );
  const posts: PostJson[] = JSON.parse(raw);

  console.log(`Migrating ${posts.length} posts...`);

  for (const p of posts) {
    try {
      const imagePath = await uploadFromPublic("blog-images", p.image);
      const { error } = await supabase.from("posts").upsert(
        {
          slug: p.slug,
          title: p.title,
          meta_title: p.metaTitle ?? null,
          meta_description: p.metaDescription ?? null,
          category: p.category,
          date: p.date,
          image_path: imagePath,
          excerpt: p.excerpt,
          content: p.content,
        },
        { onConflict: "slug" },
      );
      if (error) throw error;
      console.log(`  ✓ ${p.title}  (slug=${p.slug})`);
    } catch (e) {
      console.error(`  ✗ ${p.title}:`, e instanceof Error ? e.message : e);
    }
  }
}

async function main() {
  await migrateProjects();
  await migratePosts();
  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
