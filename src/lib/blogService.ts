import postsData from "@/content/posts.json";

export type Post = {
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

export async function getLocalPosts(limit = 3, offset = 0) {
  const posts = (postsData as Post[]).slice(offset, offset + limit);
  return posts.map((post) => ({
    ...post,
    id: `VOL. ${post.id}`,
    date: new Date(post.date)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase(),
  }));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return (postsData as Post[]).find((p) => p.slug === slug) ?? null;
}
