import postsData from "@/content/posts.json";

export async function getLocalPosts(limit = 3, offset = 0) {
  // Simulate an async fetch
  const posts = postsData.slice(offset, offset + limit);
  return posts.map((post) => ({
    ...post,
    id: `VOL. ${post.id}`,
    // Ensure dates are formatted correctly
    date: new Date(post.date)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase(),
  }));
}

export async function getPostBySlug(slug: string) {
  return postsData.find((p) => p.slug === slug) || null;
}
