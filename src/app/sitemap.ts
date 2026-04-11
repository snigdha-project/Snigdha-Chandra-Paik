import { MetadataRoute } from "next";
import { getLocalPosts } from "@/lib/blogService";
import projectData from "@/data/projects.json";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://snigdhachandrapaik.vercel.app";

  // 1. Fetch all blog posts from your local JSON service
  const posts = await getLocalPosts(100, 0);
  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 2. Map all projects from your projects.json
  const projectUrls = projectData.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // 3. Return the full array including static routes
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    ...blogUrls,
    ...projectUrls,
  ];
}
