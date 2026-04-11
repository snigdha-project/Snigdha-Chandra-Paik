import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"], // Hide your private routes
      },
      {
        // Block AI crawlers from using your content for training if desired
        userAgent: ["GPTBot", "ChatGPT-User", "CCBot"],
        disallow: "/",
      },
    ],
    sitemap: "https://snigdhachandrapaik.vercel.app/sitemap.xml",
  };
}
