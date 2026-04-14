import { MetadataRoute } from "next";
import { getLocalPosts } from "@/lib/blogService";
import projectData from "@/data/projects.json";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://snigdhachandrapaik.vercel.app"; // replace later with custom domain

  // 1. Blog URLs
  const posts = await getLocalPosts(100, 0);

  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 2. Project URLs (FIXED)
  const projectUrls = projectData.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: new Date(), // ✅ FIX: removed updatedAt
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // 3. Static URLs
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    },
  ];

  // 4. Final sitemap
  return [...staticUrls, ...blogUrls, ...projectUrls];
}
