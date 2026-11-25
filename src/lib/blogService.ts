import { wpQueryAll, wpQuery } from "./wordpress";
import { stripTags } from "./wpText";

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

type WpPost = {
  databaseId: number;
  slug: string;
  title: string | null;
  date: string; // "2026-04-11T00:00:00"
  excerpt: string | null;
  content: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  categories: { nodes: { name: string }[] } | null;
  featuredImage: { node: { sourceUrl: string | null } | null } | null;
};

const FALLBACK_IMAGE = "/OG/blogsOG.png";

const POST_FIELDS = `
  databaseId
  slug
  title
  date
  excerpt
  content
  metaTitle
  metaDescription
  categories { nodes { name } }
  featuredImage { node { sourceUrl } }
`;

const ALL_POSTS_QUERY = `
  query Posts($after: String) {
    posts(first: 100, after: $after, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
      pageInfo { hasNextPage endCursor }
      nodes { ${POST_FIELDS} }
    }
  }
`;

const POST_BY_SLUG_QUERY = `
  query Post($slug: ID!) {
    post(id: $slug, idType: SLUG) { status ${POST_FIELDS} }
  }
`;

function isoDate(wpDate: string): string {
  return wpDate.slice(0, 10);
}

function formatDate(iso: string): string {
  return new Date(iso)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}

function toPost(p: WpPost): Post {
  const content = p.content ?? "";
  const excerpt = stripTags(p.excerpt ?? "") || stripTags(content).slice(0, 160);
  return {
    id: `VOL. ${String(p.databaseId).padStart(2, "0")}`,
    slug: p.slug,
    title: stripTags(p.title ?? ""),
    metaTitle: p.metaTitle?.trim() || undefined,
    metaDescription: p.metaDescription?.trim() || undefined,
    category: p.categories?.nodes[0]?.name ?? "General",
    date: formatDate(isoDate(p.date)),
    image: p.featuredImage?.node?.sourceUrl || FALLBACK_IMAGE,
    excerpt,
    content,
  };
}

// Raw ISO date variant — for sitemap/seo schemas that need the unformatted date.
export type PostWithRawDate = Omit<Post, "date"> & { date: string; rawDate: string };

async function fetchAllPosts(): Promise<WpPost[]> {
  try {
    return await wpQueryAll<WpPost>(ALL_POSTS_QUERY, "posts");
  } catch (e) {
    console.error("fetchAllPosts failed:", e instanceof Error ? e.message : e);
    return [];
  }
}

// WPGraphQL paginates by cursor, not offset, so offset/limit is applied to the
// (cached) full list. The list is small, and the request is cached by Next.
export async function getLocalPosts(limit = 3, offset = 0): Promise<Post[]> {
  const all = await fetchAllPosts();
  return all.slice(offset, offset + limit).map(toPost);
}

// NOTE: getPostBySlug intentionally keeps the date in raw ISO form (yyyy-mm-dd),
// because [slug]/page.tsx feeds it to blogPostingSchema which requires an ISO
// date. List views call getLocalPosts (above) which formats the date for UI.
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const data = await wpQuery<{ post: (WpPost & { status: string }) | null }>(
      POST_BY_SLUG_QUERY,
      { slug },
    );
    if (!data.post || data.post.status !== "publish") return null;
    return { ...toPost(data.post), date: isoDate(data.post.date) };
  } catch (e) {
    console.error("getPostBySlug failed:", e instanceof Error ? e.message : e);
    return null;
  }
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
  const all = await fetchAllPosts();
  return all.map((p) => {
    const post = toPost(p);
    return {
      slug: post.slug,
      title: post.title,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      excerpt: post.excerpt,
      date: isoDate(p.date), // raw ISO
      image: post.image,
      content: post.content,
    };
  });
}
