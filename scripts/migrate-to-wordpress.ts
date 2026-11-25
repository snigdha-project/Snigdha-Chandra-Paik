/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * One-time migration: src/data/projects.json + src/content/posts.json (+ images
 * in /public) → WordPress, through the WP REST API.
 *
 * Usage:
 *   npm run migrate            # migrate everything
 *   npm run migrate -- --dry   # show what would happen, change nothing
 *   npm run migrate -- --from-supabase
 *       # read posts + projects (incl. case studies) from the live Supabase
 *       # project instead of the local JSON files. Needs SUPABASE_URL and
 *       # SUPABASE_ANON_KEY in .env.local (read-only, public data).
 *
 * Needs in .env.local:  WP_URL, WP_USER, WP_APP_PASSWORD
 * Idempotent: items are matched by slug and updated, images by filename, so
 * re-running never creates duplicates.
 *
 * Projects need the "Portfolio Projects" plugin (wordpress/portfolio-projects)
 * to be installed and active; posts do not.
 */

import { readFile } from "node:fs/promises";
import { resolve, extname, basename } from "node:path";
import { config as loadEnv } from "dotenv";

loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

const DRY = process.argv.includes("--dry");
const WP_URL = (process.env.WP_URL ?? "https://portfolio-cms.wasmer.app").replace(/\/$/, "");
const USER = process.env.WP_USER;
const PASS = process.env.WP_APP_PASSWORD;

if (!USER || !PASS) {
  console.error("Missing WP_USER or WP_APP_PASSWORD in .env.local");
  process.exit(1);
}

const AUTH = "Basic " + Buffer.from(`${USER}:${PASS}`).toString("base64");

async function wp<T = any>(
  path: string,
  init: RequestInit & { raw?: boolean } = {},
): Promise<{ status: number; body: T; headers: Headers }> {
  const res = await fetch(`${WP_URL}/wp-json${path}`, {
    ...init,
    headers: { Authorization: AUTH, ...(init.headers ?? {}) },
  });
  const text = await res.text();
  let body: any = text;
  try {
    body = JSON.parse(text);
  } catch {
    /* non-JSON body */
  }
  return { status: res.status, body, headers: res.headers };
}

function must<T>(r: { status: number; body: T }, what: string): T {
  if (r.status < 200 || r.status >= 300) {
    const msg = (r.body as any)?.message ?? JSON.stringify(r.body).slice(0, 300);
    throw new Error(`${what} failed (${r.status}): ${msg}`);
  }
  return r.body;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mimeFor(filename: string): string {
  switch (extname(filename).toLowerCase()) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

// Uploads /public/<rel> once (matched by slug of the filename) → media id.
const mediaCache = new Map<string, number>();
async function ensureMedia(
  publicRel: string,
  altText: string,
  remoteUrl?: string,
): Promise<number> {
  const ext = extname(publicRel);
  const safeBase = slugify(basename(publicRel, ext));
  const fileName = `${safeBase}${ext.toLowerCase()}`;
  const cached = mediaCache.get(fileName);
  if (cached) return cached;

  const existing = must(
    await wp<any[]>(`/wp/v2/media?slug=${encodeURIComponent(safeBase)}&per_page=1`),
    `media lookup ${fileName}`,
  );
  if (existing.length > 0) {
    mediaCache.set(fileName, existing[0].id);
    console.log(`    · image exists  ${fileName} (#${existing[0].id})`);
    return existing[0].id;
  }
  if (DRY) {
    console.log(`    · [dry] would upload ${fileName}`);
    return -1;
  }

  let data: Buffer;
  if (remoteUrl) {
    const img = await fetch(remoteUrl);
    if (!img.ok) throw new Error(`download ${remoteUrl} failed (${img.status})`);
    data = Buffer.from(await img.arrayBuffer());
  } else {
    data = await readFile(resolve(process.cwd(), "public", publicRel.replace(/^\//, "")));
  }
  const uploaded = must(
    await wp<any>("/wp/v2/media", {
      method: "POST",
      headers: {
        "Content-Type": mimeFor(fileName),
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
      body: new Uint8Array(data),
    }),
    `upload ${fileName}`,
  );
  // alt text for accessibility / SEO
  await wp(`/wp/v2/media/${uploaded.id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ alt_text: altText }),
  });
  mediaCache.set(fileName, uploaded.id);
  console.log(`    · image uploaded ${fileName} (#${uploaded.id})`);
  return uploaded.id;
}

async function ensureCategory(name: string): Promise<number> {
  const found = must(
    await wp<any[]>(`/wp/v2/categories?per_page=100`),
    "category lookup",
  ).find(
    (c) => c.name.replace(/&amp;/g, "&").toLowerCase() === name.toLowerCase(),
  );
  if (found) return found.id;
  if (DRY) return -1;
  return must(
    await wp<any>("/wp/v2/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }),
    `create category ${name}`,
  ).id;
}

// Upsert by slug into a REST collection (e.g. "posts", "projects").
async function upsert(
  restBase: string,
  slug: string,
  payload: Record<string, unknown>,
): Promise<{ id: number; created: boolean } | null> {
  const found = must(
    await wp<any[]>(`/wp/v2/${restBase}?slug=${encodeURIComponent(slug)}&status=any&per_page=1`),
    `${restBase} lookup ${slug}`,
  );
  if (DRY) return null;
  const headers = { "Content-Type": "application/json" };
  if (found.length > 0) {
    const r = must(
      await wp<any>(`/wp/v2/${restBase}/${found[0].id}`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      }),
      `update ${restBase}/${slug}`,
    );
    return { id: r.id, created: false };
  }
  const r = must(
    await wp<any>(`/wp/v2/${restBase}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...payload, slug }),
    }),
    `create ${restBase}/${slug}`,
  );
  return { id: r.id, created: true };
}

// A Custom HTML block is stored and returned verbatim — WordPress does not
// run its paragraph/line-break auto-formatting over it — so the markup that
// the site rendered before is exactly what is rendered now.
const htmlBlock = (html: string) => `<!-- wp:html -->\n${html}\n<!-- /wp:html -->`;

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------
type PostJson = {
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  category: string;
  date: string;
  image: string;
  imageUrl?: string; // remote source (Supabase storage); otherwise /public
  excerpt: string;
  content: string;
};

// ---------------------------------------------------------------------------
// Optional source: the live Supabase project (read-only, via PostgREST)
// ---------------------------------------------------------------------------
const FROM_SUPABASE = process.argv.includes("--from-supabase");
const SB_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SB_KEY = process.env.SUPABASE_ANON_KEY;

async function sbRows<T>(table: string, order: string): Promise<T[]> {
  if (!SB_URL || !SB_KEY) {
    throw new Error("--from-supabase needs SUPABASE_URL and SUPABASE_ANON_KEY in .env.local");
  }
  const res = await fetch(`${SB_URL}/rest/v1/${table}?select=*&order=${order}`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase ${table} read failed (${res.status}): ${await res.text()}`);
  return (await res.json()) as T[];
}
const sbImage = (bucket: string, path: string) =>
  `${SB_URL}/storage/v1/object/public/${bucket}/${path.split("/").map(encodeURIComponent).join("/")}`;

async function loadPosts(): Promise<PostJson[]> {
  if (!FROM_SUPABASE) {
    return JSON.parse(await readFile(resolve(process.cwd(), "src/content/posts.json"), "utf8"));
  }
  const rows = await sbRows<any>("posts", "date.desc");
  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    metaTitle: r.meta_title ?? undefined,
    metaDescription: r.meta_description ?? undefined,
    category: r.category,
    date: String(r.date).slice(0, 10),
    image: r.image_path,
    imageUrl: sbImage("blog-images", r.image_path),
    excerpt: r.excerpt,
    content: r.content,
  }));
}

async function migratePosts(): Promise<number> {
  const posts = await loadPosts();
  console.log(`\nPosts: ${posts.length}`);
  let failed = 0;
  for (const p of posts) {
    try {
      console.log(`  → ${p.title}`);
      const media = await ensureMedia(p.image, p.title, p.imageUrl);
      const cat = await ensureCategory(p.category);
      const meta: Record<string, string> = {};
      if (p.metaTitle) meta._yoast_wpseo_title = p.metaTitle;
      if (p.metaDescription) meta._yoast_wpseo_metadesc = p.metaDescription;
      const r = await upsert("posts", p.slug, {
        title: p.title,
        status: "publish",
        date: `${p.date}T00:00:00`,
        excerpt: p.excerpt,
        content: htmlBlock(p.content),
        categories: [cat],
        featured_media: media,
        meta,
      });
      console.log(
        DRY ? "    [dry] ok" : `    ✓ ${r!.created ? "created" : "updated"} #${r!.id}`,
      );
    } catch (e) {
      failed++;
      console.error(`    ✗ ${e instanceof Error ? e.message : e}`);
    }
  }
  return failed;
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
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
  slug?: string;
  imageUrl?: string;
  createdAt?: string; // original creation time → keeps tie-break order
  caseStudy?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

async function loadProjects(): Promise<ProjectJson[]> {
  if (!FROM_SUPABASE) {
    return JSON.parse(await readFile(resolve(process.cwd(), "src/data/projects.json"), "utf8"));
  }
  const rows = await sbRows<any>("projects", "order_index.asc");
  return rows.map((r) => ({
    id: r.order_index,
    title: r.title,
    slug: r.slug,
    description: r.description,
    category: r.category,
    tech: r.tech ?? [],
    image: r.image_path,
    imageUrl: sbImage("project-images", r.image_path),
    link: r.link ?? "",
    featured: r.featured,
    colorKey: r.color_key ?? undefined,
    createdAt: r.created_at,
    caseStudy: r.case_study,
    metaTitle: r.meta_title,
    metaDescription: r.meta_description,
  }));
}

async function migrateProjects(): Promise<number> {
  const probe = await wp("/wp/v2/projects?per_page=1");
  if (probe.status === 404) {
    console.error(
      "\nProjects: SKIPPED — the 'project' post type is not on the WordPress site.\n" +
        "  Install + activate wordpress/portfolio-projects.zip (Plugins → Add New → Upload),\n" +
        "  then run this script again.",
    );
    return -1;
  }

  const projects = await loadProjects();
  console.log(`\nProjects: ${projects.length}`);
  let failed = 0;
  for (const p of projects) {
    const slug = p.slug ?? slugify(p.title);
    try {
      console.log(`  → ${p.title}  (${slug})`);
      const media = await ensureMedia(p.image, `${p.title} website screenshot`, p.imageUrl);
      const r = await upsert("projects", slug, {
        title: p.title,
        status: "publish",
        ...(p.createdAt ? { date_gmt: new Date(p.createdAt).toISOString().slice(0, 19) } : {}),
        excerpt: p.description,
        content: p.caseStudy?.trim() ? htmlBlock(p.caseStudy) : "", // empty → no /projects/<slug> page
        menu_order: p.id,
        featured_media: media,
        meta: {
          pp_category: p.category,
          pp_tech: p.tech.join(", "),
          pp_link: p.link,
          pp_featured: p.featured,
          pp_color_key: p.colorKey ?? "",
          ...(p.metaTitle ? { _yoast_wpseo_title: p.metaTitle } : {}),
          ...(p.metaDescription ? { _yoast_wpseo_metadesc: p.metaDescription } : {}),
        },
      });
      console.log(
        DRY ? "    [dry] ok" : `    ✓ ${r!.created ? "created" : "updated"} #${r!.id}`,
      );
    } catch (e) {
      failed++;
      console.error(`    ✗ ${e instanceof Error ? e.message : e}`);
    }
  }
  return failed;
}

async function main() {
  console.log(`Target: ${WP_URL}${DRY ? "   (dry run)" : ""}`);
  const me = must(await wp<any>("/wp/v2/users/me"), "authentication");
  console.log(`Authenticated as ${me.name} (${me.roles?.join(", ")})`);

  const postFails = await migratePosts();
  const projectFails = await migrateProjects();

  console.log("\nSummary");
  console.log(`  posts:    ${postFails === 0 ? "ok" : `${postFails} failed`}`);
  console.log(
    `  projects: ${projectFails === -1 ? "skipped (plugin missing)" : projectFails === 0 ? "ok" : `${projectFails} failed`}`,
  );
  if (postFails > 0 || projectFails > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
