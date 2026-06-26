import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// GEO: explicitly welcome the major AI / LLM crawlers so the site is eligible to
// be read, indexed and cited by generative engines (ChatGPT, Claude, Perplexity,
// Gemini, Copilot, etc.). They're already covered by the "*" rule, but listing
// them makes the intent explicit and survives any future tightening of "*".
const AI_CRAWLERS = [
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic (Claude)
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google (Gemini / AI Overviews grounding & training)
  "Google-Extended",
  // Apple Intelligence
  "Applebot-Extended",
  // Others
  "Amazonbot",
  "meta-externalagent",
  "DuckAssistBot",
  "cohere-ai",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      {
        userAgent: AI_CRAWLERS,
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
