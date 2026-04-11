export async function getWPPosts(limit = 3, offset = 0) {
  try {
    const res = await fetch(`/api/wp-proxy?per_page=${limit}&offset=${offset}`);
    if (!res.ok) return [];

    const posts = await res.json();
    if (!Array.isArray(posts)) return [];

    // We use Promise.all to handle secondary fetches for images if needed
    return await Promise.all(
      posts.map(async (post: any) => {
        let featuredImage = "";

        // 1. Try to get image from embedded data (Standard way)
        const embeddedMedia = post._embedded?.["wp:featuredmedia"]?.[0];

        if (embeddedMedia && embeddedMedia.source_url) {
          featuredImage = embeddedMedia.source_url;
        }
        // 2. DYNAMIC FALLBACK: If _embedded is empty but featured_media ID exists
        else if (post.featured_media > 0) {
          try {
            // Fetch the specific media details using the ID (e.g., media/7)
            const mediaRes = await fetch(
              `https://blogsforme.wasmer.app/index.php/wp-json/wp/v2/media/${post.featured_media}`,
            );
            if (mediaRes.ok) {
              const mediaData = await mediaRes.json();
              featuredImage = mediaData.source_url || mediaData.guid?.rendered;
            }
          } catch (err) {
            console.error("Media Fetch Error:", err);
          }
        }

        // 3. THE WASMER LOCALHOST FIX
        if (featuredImage && featuredImage.includes("localhost")) {
          featuredImage = featuredImage.replace(
            /http:\/\/localhost(:\d+)?/,
            "https://blogsforme.wasmer.app",
          );
        }

        return {
          id: `VOL. ${post.id}`,
          title: post.title.rendered,
          excerpt:
            post.excerpt.rendered.replace(/<[^>]+>/g, "").substring(0, 140) +
            "...",
          // Priority: WordPress Image > Unsplash Fallback
          image:
            featuredImage ||
            "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc",
          category: post._embedded?.["wp:term"]?.[0]?.[0]?.name || "JOURNAL",
          date: new Date(post.date)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .toUpperCase(),
          slug: post.slug,
        };
      }),
    );
  } catch (error) {
    console.error("Wasmer Connection Error:", error);
    return [];
  }
}
